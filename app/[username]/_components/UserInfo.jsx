"use client";
import { TwicPicture } from "@twicpics/components/react";
import { Link, Link2, Linkedin, MapPin, Share } from "lucide-react";
import React from "react";
import { FaGithub } from "react-icons/fa";

function UserInfo({ userDetail }) {
  const handleShare = () => {
    const shareableLink = `http://localhost:3000/${userDetail.name}`;
    navigator.clipboard.writeText(shareableLink).then(
      () => {
        alert("Link copied to clipboard: " + shareableLink);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  return (
    <div className="mt-2 flex flex-col md:justify-center md:h-screen">
      <div className="w-full flex items-center justify-between">
        <div className="flex md:flex-col items-center md:items-start gap-4">
          <TwicPicture
            src={userDetail?.profileImage}
            className="w-[90px] h-[90px] md:w-[130px] md:h-[130px] rounded-full"
          />
          <div className="flex flex-col">
            <h2 className="font-bold text-lg md:text-2xl">
              {userDetail?.name}
            </h2>
            <h2 className="flex gap-2 items-center text-gray-500">
              <MapPin className="h-[15px] w-[15px]" />
              {userDetail?.location}
            </h2>
            <h2 className="flex gap-2 text-gray-500 text-xs md:text-sm items-center">
              <Link className="h-[12px] w-[12px]" />
              {userDetail?.link}
            </h2>
            <div className="flex my-2 gap-3 items-center">
                {userDetail.linkedin && (
                  <a
                    href={userDetail.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="h-[18px] w-[18px] text-[#0077B5]" />
                  </a>
                )}

                {userDetail?.github && (
                  <a
                    href={userDetail.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub className="h-[18px] w-[18px]" />
                  </a>
                )}
            </div>
          </div>
        </div>
      </div>
      <div>
        <button
          className="btn btn-primary btn-xs md:btn-sm flex justify-center w-full my-5"
          onClick={handleShare}
        >
          <Share className="h-4 w-4" />
        </button>
      </div>
      <h2 className="my-7 ml-2 text-gray-600">{userDetail?.bio}</h2>
      <label className="input input-bordered flex items-center gap-2">
        Email
        <input
          type="text"
          className="grow"
          placeholder="u@site.com"
          defaultValue={userDetail.email}
        />
      </label>
    </div>
  );
}

export default UserInfo;
