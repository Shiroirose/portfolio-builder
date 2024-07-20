"use client";
import { Camera, Link2, Linkedin, MapPin } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import React, { useContext, useEffect, useRef, useState } from "react";
import { db } from "../../../utils";
import { userInfo } from "../../../utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { toast } from "react-toastify";
import { UserDetailContext } from "../../_context/UserDetailContext";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../utils/firebaseConfig";
import { TwicPicture } from "@twicpics/components/react";
import { PreviewUpdateContext } from "../../_context/PreviewUpdateContext";

function UserDetails() {
  const { user } = useUser();
  const [selected, setSelected] = useState();
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const [profileImage, setProfileImage] = useState();
  const { userDetail } = useContext(UserDetailContext);
  const { updatePreview, setUpdatePreview } = useContext(PreviewUpdateContext);

  let timeoutId;

  useEffect(() => {
    if (userDetail) {
      // console.log('User Detail:', userDetail );
      setProfileImage(userDetail?.profileImage);
    }

    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setSelected(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userDetail]);

  const onInputchange = (event, fieldName) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(async () => {
      const result = await db
        .update(userInfo)
        .set({ [fieldName]: event.target.value })
        .where(eq(userInfo.email, user?.primaryEmailAddress.emailAddress));

      if (result) {
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

  if (!userDetail) {
    return <span className="loading loading-spinner loading-md">Reload</span>;
  }

  const onFileChange = async (event) => {
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
        .update(userInfo)
        .set({ profileImage: fileName + "?alt=media" })
        .where(eq(userInfo.email, user?.primaryEmailAddress.emailAddress));

      if (result) {
        setProfileImage(fileName + "?alt=media");
        toast.success("Saved!", {
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

  const onCameraClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      ref={containerRef}
      className="bg-primary bg-opacity-50 rounded-lg p-9 mt-3"
    >
      <div className="flex gap-2">
        {profileImage ? (
          <label htmlFor="file-input" className="cursor-pointer">
            <TwicPicture
              src={`${profileImage}`}
              className="h-[40px] w-[40px] rounded-full"
            ></TwicPicture>
          </label>
        ) : (
          <div>
            <label>
              <Camera
                className="rounded-full p-2 h-12 w-12 bg-gray-700 cursor-pointer"
                onClick={onCameraClick}
              />
            </label>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          id="file-input"
          style={{ display: "none" }}
          onChange={onFileChange}
          accept="image/png , image/gif , image/jpeg"
        />
        <input
          type="text"
          placeholder="Your Full Name ?"
          defaultValue={userDetail?.name}
          onChange={(event) => onInputchange(event, "name")}
          className="input input-bordered w-full placeholder-opacity-40"
          data-fdprocessedid={null}
        />
      </div>
      <textarea
        className="textarea textarea-bordered w-full mt-3"
        placeholder="Write about yourself"
        defaultValue={userDetail?.bio}
        onChange={(event) => onInputchange(event, "bio")}
        data-fdprocessedid={null}
      ></textarea>

      <div>
        <div className="flex gap-2 mt-4">
          <div
            className="tooltip tooltip-top tooltip-secondary"
            data-tip="Location"
          >
            <MapPin
              className={` h-12 w-12 p-3 rounded-md hover:bg-gray-700
            text-blue-500 
            ${selected == "location" && `bg-gray-700`}`}
              onClick={() => setSelected("location")}
            />
          </div>
          <div
            className="tooltip tooltip-top tooltip-secondary"
            data-tip="Link"
          >
            <Link2
              className={` h-12 w-12 p-3 rounded-md hover:bg-gray-700
            text-yellow-500 
            ${selected == "link" && `bg-gray-700`}`}
              onClick={() => setSelected("link")}
            />
          </div>
          <div
            className="tooltip tooltip-top tooltip-secondary"
            data-tip="LinkedIn"
          >
            <Linkedin
              className={` h-12 w-12 p-3 rounded-md hover:bg-gray-700
            text-[#0077B5] 
            ${selected == "linkedin" && `bg-gray-700`}`}
              onClick={() => setSelected("linkedin")}
            />
          </div>
          <div
            className="tooltip tooltip-top tooltip-secondary"
            data-tip="GitHub link to show activity"
          >
            <FaGithub
              className={` h-12 w-12 p-3 rounded-md hover:bg-gray-700 
            ${selected == "github" && `bg-gray-700`}`}
              onClick={() => setSelected("github")}
            />
          </div>
        </div>

        {selected == "location" ? (
          <div className="mt-2">
            <label className="input input-bordered flex items-center gap-2">
              <MapPin />
              <input
                type="text"
                className="grow"
                placeholder="Your location"
                key={1}
                defaultValue={userDetail?.location}
                onChange={(event) => onInputchange(event, "location")}
              />
            </label>
          </div>
        ) : selected == "link" ? (
          <div className="mt-2">
            <label className="input input-bordered flex items-center gap-2">
              <Link2 />
              <input
                type="url"
                className="grow"
                placeholder="Link to portfolio/account"
                key={2}
                defaultValue={userDetail?.link}
                onChange={(event) => onInputchange(event, "link")}
              />
            </label>
          </div>
        ) : selected == "linkedin" ? (
          <div className="mt-2">
            <label className="input input-bordered flex items-center gap-2">
              <Linkedin />
              <input
                type="url"
                className="grow"
                placeholder="Link to LinkedIn profile"
                key={3}
                defaultValue={userDetail?.linkedin}
                onChange={(event) => onInputchange(event, "linkedin")}
              />
            </label>
          </div>
        ) : selected == "github" ? (
          <div className="mt-2">
            <label className="input input-bordered flex items-center gap-2">
              <FaGithub />
              <input
                type="url"
                className="grow"
                placeholder="Link to GitHub account"
                key={4}
                defaultValue={userDetail?.github}
                onChange={(event) => onInputchange(event, "github")}
              />
            </label>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default UserDetails;
