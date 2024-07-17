import React, { useContext, useEffect, useState } from "react";
import { TwicPicture } from "@twicpics/components/react";
import {
  Book,
  Briefcase,
  Brush,
  Code,
  Cpu,
  GripVertical,
  Layers2,
  Layers3,
  LineChart,
  Link2,
  LoaderCircle,
  PenTool,
  ShoppingCart,
  Smartphone,
  Sparkle,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import { db } from "../../../utils";
import { project } from "../../../utils/schema";
import { eq } from "drizzle-orm";
import { toast } from "react-toastify";
import { uploadBytes, ref } from "firebase/storage";
import { storage } from "../../../utils/firebaseConfig";
import Swal from "sweetalert2";
import { chatSession } from "../../../utils/AIGemini";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { PreviewUpdateContext } from "../../_context/PreviewUpdateContext";

function ProjectListEdit({ projectList, refreshData }) {
  const [selected, setSelected] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState();
  const [aiInput, setAiInput] = useState();
  const [aiOutput, setAiOutput] = useState([]);
  const [showAiDesc, setShowAiDesc] = useState(false);
  const [projectListData, setProjectListData] = useState([]);
  const { updatePreview, setUpdatePreview } = useContext(PreviewUpdateContext);

  let timeoutId;

  useEffect(() => {
    projectList && setProjectListData(projectList);
  }, [projectList]);

  const onInputchange = (value, fieldName, projectId) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(async () => {
      const result = await db
        .update(project)
        .set({ [fieldName]: value })
        .where(eq(project.id, projectId));

      if (result) {
        refreshData();
        toast.success("Reload to see saved changes!", {
          position: "top-right",
        });
        setUpdatePreview(updatePreview + 1);
      } else if (!result) {
        toast.error("Unsuccessful attempt!", {
          position: "top-right",
        });
      }
    }, 1000);
  };

  const onFileChange = async (event, projectId) => {
    const file = event.target.files[0];
    // console.log(file);

    const fileName = Date.now().toString() + "." + file.type.split("/")[1];
    console.log(fileName);
    const storageRef = ref(storage, fileName);

    try {
      await uploadBytes(storageRef, file);
      console.log("Uploaded a blob or file!", fileName);

      // Update database after the file upload is complete
      const result = await db
        .update(project)
        .set({ logo: fileName + "?alt=media" })
        .where(eq(project.id, projectId));

      if (result) {
        refreshData();
        toast.success("Image Saved!", {
          position: "top-right",
        });
        setUpdatePreview(updatePreview + 1);
      } else {
        toast.error("Unsuccessful attempt!", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("File upload failed!", {
        position: "top-right",
      });
    }
  };

  const onProjectDelete = (projectId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const result = await db
          .delete(project)
          .where(eq(project.id, projectId));
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
        refreshData();
        toast.success("Deleted :)", {
          position: "top-right",
        });
        setUpdatePreview(updatePreview + 1);
      }
    });
  };

  const submitAI = async (event) => {
    setLoading(true);
    event.preventDefault();
    const InputPrompt = aiInput;
    console.log(InputPrompt);

    try {
      const result = await chatSession.sendMessage(InputPrompt);
      const responseText = await result.response.text();
      const jsonResponse = JSON.parse(responseText);
      console.log("AI Response", jsonResponse);
      // console.log(result.response.text)

      if (Array.isArray(jsonResponse)) {
        setAiOutput(jsonResponse);
        setShowAiDesc(true);
      } else if (typeof jsonResponse === "object") {
        const outputs = Object.keys(jsonResponse).map((key) => ({
          field: key,
          value: jsonResponse[key],
        }));
        setAiOutput(outputs);
        setShowAiDesc(true);
      } else if (typeof jsonResponse === "string") {
        setAiOutput([{ field: "description", value: jsonResponse }]);
        setShowAiDesc(true);
      } else {
        console.warn("Unsupported AI response format:", jsonResponse);
      }
      // console.log("Output", aiOutput);
      // setShowAiDesc(true);
    } catch (error) {
      console.error("AI generation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenDialog(false);
    setAiInput("");
    setAiOutput([]);
    setShowAiDesc(false);
  };

  const formatAIOutput = () => {
    // return aiOutput
    // .map((output, idx) => {
    //   let text = "";
    //   if (output.field) {
    //     text += `${output.field.toUpperCase()}:\n`;
    //   }
    //   if (typeof output.value === "string") {
    //     text += `${output.value}\n\n`;
    //   } else if (Array.isArray(output.value)) {
    //     text += output.value.map((item) => `- ${item}\n`).join("");
    //     text += "\n";
    //   } else if (typeof output.value === "object") {
    //     text += Object.keys(output.value)
    //       .map((key) => `${key.toUpperCase()}: ${output.value[key]}\n`)
    //       .join("");
    //     text += "\n";
    //   }
    //   return text;
    // })
    // .join("");
  };

  const handleOnDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }
    // console.log(result);
    const items = Array.from(projectListData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setProjectListData(items);

    try {
      // Update the order of all items in the database
      const updatePromises = items.map((item, index) => {
        return db
          .update(project)
          .set({ order: index })
          .where(eq(project.id, item.id));
      });

      await Promise.all(updatePromises);
      refreshData();
      toast.success("Order updated :)", {
        position: "top-right",
      });
      setUpdatePreview(updatePreview + 1);
    } catch (error) {
      console.error("Order update failed", error);
      toast.error("Order update failed :(", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="mt-8">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {projectListData.map((project, index) => (
                <Draggable
                  key={project.id}
                  draggableId={project.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="my-5 bg-primary bg-opacity-50 p-3 rounded-lg"
                    >
                      <div className="flex flex-col w-full">
                        <div className="flex items-center gap-2 ">
                          <label
                            htmlFor={"project-file-input" + index}
                            className="cursor-pointer"
                          >
                            <TwicPicture
                              src={`${project.logo}`}
                              className="h-[40px] w-[40px] rounded-full"
                            ></TwicPicture>
                          </label>
                          <input
                            type="file"
                            id={"project-file-input" + index}
                            style={{ display: "none" }}
                            onChange={(event) =>
                              onFileChange(event, project.id)
                            }
                            accept="image/png , image/gif , image/jpeg"
                          />
                          <input
                            type="text"
                            placeholder="Project Name"
                            defaultValue={project.name}
                            className="input input-bordered w-full "
                            onChange={(event) =>
                              onInputchange(
                                event.target.value,
                                "name",
                                project.id
                              )
                            }
                          />
                        </div>
                        <div>
                          <textarea
                            placeholder="Describe your project"
                            className="textarea textarea-bordered w-full mt-3 text-sm"
                            defaultValue={project.desc}
                            onChange={(event) =>
                              onInputchange(
                                event.target.value,
                                "desc",
                                project.id
                              )
                            }
                          />
                        </div>

                        <div>
                          <div className="flex gap-2 mt-4 items-center justify-between">
                            <div className="flex gap-2 mt-4 items-center">
                              <div
                                {...provided.dragHandleProps}
                                className="tooltip tooltip-top"
                                data-tip="Drag"
                              >
                                <GripVertical className="text-blue-50" />
                              </div>
                              <div
                                className="tooltip tooltip-top "
                                data-tip="Link"
                              >
                                <Link2
                                  className={` h-11 w-11 p-3 rounded-md hover:bg-white hover:bg-opacity-30 
                                  ${selected == "url" && `bg-gray-700`} `}
                                  onClick={() => setSelected("url" + index)}
                                />
                              </div>
                              <div
                                className="tooltip tooltip-top"
                                data-tip="Category"
                              >
                                <Layers2
                                  className={` h-12 w-12 p-3 rounded-md hover:bg-white hover:bg-opacity-30 text-green-400
                                  ${selected == "category" && `bg-gray-700`}`}
                                  onClick={() =>
                                    setSelected("category" + index)
                                  }
                                />
                              </div>
                              <div
                                className="tooltip tooltip-top"
                                data-tip="Stats"
                              >
                                <LineChart
                                  className={` h-12 w-12 p-3 rounded-md hover:bg-white hover:bg-opacity-30 text-yellow-100
                                  ${selected == "linechart" && `bg-gray-700`}`}
                                  onClick={() =>
                                    setSelected("linechart" + index)
                                  }
                                />
                              </div>
                              <button
                                className="btn btn-ghost"
                                // onClick={() => setOpenDialog(true)}
                                onClick={() => {
                                  setOpenDialog(true);
                                  setSelected("ai" + index);
                                }}
                              >
                                AI
                                <Sparkles className="text-yellow-300" />
                              </button>
                            </div>

                            <div className="flex gap-3 items-center">
                              <button
                                className="btn btn-error btn-sm"
                                onClick={() => onProjectDelete(project.id)}
                              >
                                <Trash2 />
                              </button>
                              <input
                                type="checkbox"
                                className="toggle toggle-primary"
                                defaultChecked={project.active}
                                onChange={(event) =>
                                  onInputchange(
                                    event.target.checked,
                                    "active",
                                    project.id
                                  )
                                }
                              />
                            </div>
                          </div>

                          {selected == "url" + index ? (
                            <div className="mt-2">
                              <label className="input input-bordered flex items-center gap-2">
                                <Link2 />
                                <input
                                  type="url"
                                  className="grow"
                                  placeholder="Link to Project"
                                  key={1}
                                  defaultValue={project?.url}
                                  onChange={(event) =>
                                    onInputchange(
                                      event.target.value,
                                      "url",
                                      project.id
                                    )
                                  }
                                />
                              </label>
                            </div>
                          ) : selected == "category" + index ? (
                            <div className="mt-2">
                              <select
                                className="select select-bordered rounded-lg w-full "
                                onChange={(event) =>
                                  onInputchange(
                                    event.target.value,
                                    "category",
                                    project.id
                                  )
                                }
                                key={2}
                                defaultValue={
                                  project?.category ? project?.category : ""
                                }
                              >
                                <option disabled selected>
                                  Choose category of project{" "}
                                </option>
                                <option>
                                  {" "}
                                  <Book className="mr-2" /> Education{" "}
                                </option>
                                <option>
                                  {" "}
                                  <Cpu className="mr-2" /> Technology{" "}
                                </option>
                                <option>
                                  {" "}
                                  <Smartphone className="mr-2" /> Mobile App{" "}
                                </option>
                                <option>
                                  {" "}
                                  <Code className="mr-2" /> Software{" "}
                                </option>
                                <option>
                                  {" "}
                                  <Briefcase className="mr-2" /> Services{" "}
                                </option>
                                <option>
                                  {" "}
                                  <PenTool className="mr-2" /> Design{" "}
                                </option>
                                <option>
                                  {" "}
                                  <Brush className="mr-2" /> Art{" "}
                                </option>
                                <option>
                                  {" "}
                                  <ShoppingCart className="mr-2" /> ECommerce{" "}
                                </option>
                                <option>
                                  {" "}
                                  <Users className="mr-2" /> Social{" "}
                                </option>
                                <option>
                                  {" "}
                                  <Layers3 className="mr-2" /> Miscellaneous{" "}
                                </option>
                              </select>
                            </div>
                          ) : selected == "linechart" + index ? (
                            <div className="mt-2 flex items-center justify-between border p-4 rounded-lg">
                              <label>Visitors' Graph</label>
                              <input
                                type="checkbox"
                                className="toggle toggle-secondary "
                                defaultChecked={project?.showGraph}
                                onChange={(event) =>
                                  onInputchange(
                                    event.target.checked,
                                    "showGraph",
                                    project.id
                                  )
                                }
                              />
                            </div>
                          ) : null}

                          {openDialog && (
                            <dialog
                              className="modal  bg-black bg-opacity-30"
                              open
                            >
                              <div className="modal-box bg-gray-700 ">
                                <button
                                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 "
                                  onClick={handleCloseModal}
                                >
                                  ✕
                                </button>
                                <textarea
                                  className="textarea textarea-bordered w-full"
                                  placeholder="Write a bit about your project (eg:tech stack, what it's about)"
                                  onChange={(event) =>
                                    setAiInput(event.target.value)
                                  }
                                ></textarea>
                                <div>
                                  <button
                                    className="btn btn-xs btn-primary  sm:btn-sm md:btn-md lg:btn-lg text-center text-white my-4 w-full "
                                    onClick={(event) =>
                                      submitAI(event, project.id)
                                    }
                                    disabled={loading}
                                  >
                                    {loading ? (
                                      <>
                                        <LoaderCircle className="animate-spin" />
                                        Generating from AI
                                      </>
                                    ) : (
                                      "Generate"
                                    )}
                                    <Sparkles className="text-yellow-300" />
                                  </button>
                                </div>
                                {showAiDesc && (
                                  <textarea
                                    className="textarea textarea-bordered w-full mt-3"
                                    value={aiOutput
                                      .map((output, idx) => {
                                        let text = "";
                                        if (output.field) {
                                          text += `${output.field.toUpperCase()}:\n`;
                                        }
                                        if (typeof output.value === "string") {
                                          text += `${output.value}\n\n`;
                                        } else if (
                                          Array.isArray(output.value)
                                        ) {
                                          text += output.value
                                            .map((item) => `- ${item}\n`)
                                            .join("");
                                          text += "\n";
                                        } else if (
                                          typeof output.value === "object"
                                        ) {
                                          text += Object.keys(output.value)
                                            .map(
                                              (key) =>
                                                `${key.toUpperCase()}: ${
                                                  output.value[key]
                                                }\n`
                                            )
                                            .join("");
                                          text += "\n";
                                        }
                                        return text;
                                      })
                                      .join("")}
                                    readOnly
                                  />
                                )}
                              </div>
                            </dialog>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
export default ProjectListEdit;
