import React, { useState } from "react";
// import projectList from "./FormContent";
import { TwicPicture } from "@twicpics/components/react";
import { Layers3, Link2, Sparkle, Trash2 } from "lucide-react";
import { db } from "../../../utils";
import { project } from "../../../utils/schema";
import { eq } from "drizzle-orm";
import { toast } from "react-toastify";
import { uploadBytes, ref } from "firebase/storage";
import { storage } from "../../../utils/firebaseConfig";
import Swal from "sweetalert2";
import axios from 'axios';

function ProjectListEdit({ projectList, refreshData }) {

    const [selected,setSelected]=useState();
    let timeoutId;
    const onInputchange=(value,fieldName,projectId)=>{

        clearTimeout(timeoutId)
        timeoutId=setTimeout(async()=>{
          const result=await db.update(project)
          .set({[fieldName]:value})
          .where(eq(project.id,projectId))
    
          if(result){
            refreshData();
            toast.success('Reload to see saved changes!',{
              position:'top-right'
            })
          }
    
          else if(!result){
            toast.error('Unsuccessful attempt!',{
              position:'top-right'
            })
          }
        },1000); 
    
    
      }
    
      const onFileChange= async(event, projectId)=>{
        const file= event.target.files[0];
        // console.log(file);
    
        const fileName=Date.now().toString()+'.'+file.type.split('/')[1];
        console.log(fileName)
        const storageRef = ref(storage, fileName);
    
    
        try {
          await uploadBytes(storageRef, file);
          console.log('Uploaded a blob or file!', fileName);
    
          // Update database after the file upload is complete
          const result = await db.update(project)
            .set({ logo: fileName+'?alt=media' })
            .where(eq(project.id,projectId));
    
          if (result) {
            refreshData();
            toast.success('Image Saved!', {
              position: 'top-right',
            });
          } else {
            toast.error('Unsuccessful attempt!', {
              position: 'top-right',
            });
          }
        } catch (error) {
          console.error('File upload error:', error);
          toast.error('File upload failed!', {
            position: 'top-right',
          });
        }
      }

      const onProjectDelete=(projectId)=>{
            Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
          }).then(async(result) => {
            if (result.isConfirmed) {
                const result=await db.delete(project).where(eq(project.id,projectId))
              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
              });
              refreshData();
              toast.success('Deleted :)',{
                position:'top-right'
              })
            }
          });
      }

  return (
    <div className="mt-8">
      {projectList.map((project, index) => (
        <div className="my-5 bg-gray-800 p-3 rounded-lg">
          <div className="flex items-center gap-2 ">
            <label htmlFor={'project-file-input'+index} className='cursor-pointer'>
            <TwicPicture src={`${project.logo}`} className='h-[40px] w-[40px] rounded-full'></TwicPicture>
            </label>
            <input type='file'
              id={'project-file-input'+index}
              style={{display: 'none'}}
              onChange={(event)=>onFileChange(event,project.id)}
              accept='image/png , image/gif , image/jpeg'
              /> 
            <input
              type="text"
              placeholder="Project Name"
              defaultValue={project.name}
              className="input input-bordered w-full "
              onChange={(event)=>onInputchange(event.target.value,'name',project.id)}
            />
          </div>
          {/* <input type="text" placeholder="Describe your Project" className="input input-bordered w-full my-3 " /> */}
          <div >
          <textarea
            placeholder="Descrbe your project"
            className="textarea textarea-bordered w-full mt-3 text-sm"
            defaultValue={project.desc}
            onChange={(event)=>onInputchange(event.target.value,'desc',project.id)}
          />
           
          </div>

          <div>
            <div className="flex gap-2 mt-4 items-center justify-between">
              <div className="flex gap-2 mt-4">
                <Link2
                className={` h-11 w-11 p-3 rounded-md hover:bg-gray-700
            text-blue-500 
            ${selected == "url" && `bg-gray-700`}`}
                onClick={() => setSelected("url"+index)}
              />
              <Layers3
                className={` h-12 w-12 p-3 rounded-md hover:bg-gray-700
            text-yellow-500 
            ${selected == "category" && `bg-gray-700`}`}
                onClick={() => setSelected("category"+index)}
              />
              {/* <button 
                className="btn btn-ghost"
                onClick={() => handleSummarize(project.desc,project.id)}
                >
                AI
                <Sparkle/>
             </button> */}
              </div>
              
              <div className="flex gap-3 items-center">
                <button className="btn btn-error btn-sm" onClick={()=>onProjectDelete(project.id)}>
                    <Trash2/>
                </button>
                <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    defaultChecked={project.active}
                    onChange={(event)=>onInputchange(event.target.checked,'active',project.id)}
                />
                </div>
            </div>

            {selected == "url"+index ? (
              <div className="mt-2">
                <label className="input input-bordered flex items-center gap-2">
                  <Link2 />
                  <input
                    type="url"
                    className="grow"
                    placeholder="Link to Project"
                    key={1}
                    defaultValue={project?.url}
                    onChange={(event)=>onInputchange(event.target.value,'url',project.id)}
                  />
                </label>
              </div>
            ) : selected == "category"+index ? (
              <div className="mt-2">
                <label className="input input-bordered flex items-center gap-2">
                  <Layers3 />
                  <input
                    type="text"
                    className="grow"
                    placeholder="Category under which your project falls"
                    key={2}
                    defaultValue={project?.category?project?.category:''}
                    // checked={project.active}
                    onChange={(event)=>onInputchange(event.target.value,'category',project.id)}
                  />
                </label>
              </div>
            ) : null} 
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProjectListEdit;
