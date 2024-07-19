import React, { useContext, useState } from "react";
import { UserDetailContext } from "../../_context/UserDetailContext";
import GitHubCalendar from "react-github-calendar";
import { userInfo } from "../../../utils/schema";
import { db } from "../../../utils";
import { toast } from "react-toastify";
import { eq } from "drizzle-orm";
import { PreviewUpdateContext } from "../../_context/PreviewUpdateContext";

function GithubContribution() {
  const { userDetail } = useContext(UserDetailContext);
  const [showGitActivity, setShowGitActivity] = useState(userDetail?.showcontri || false)
  const { updatePreview, setUpdatePreview } = useContext(PreviewUpdateContext);
  // console.log(userDetail?.github);
  const getGithubUsername = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9-]+)\/?/;
    const match = url?.match(regex);
    return match ? match[1] : null;
  };

  const githubUsername = getGithubUsername(userDetail?.github);

  console.log(githubUsername);

  const toggleGithubActivity = async() => {
    const newshowGitActivity=!showGitActivity
    setShowGitActivity(newshowGitActivity)

    try{
        const result=await db.update(userInfo)
        .set({showcontri: newshowGitActivity})
        .where(eq(userInfo.id,userDetail.id))

        if(result){
            toast.success("updated !",{
                position:"top-right"
            })
            setUpdatePreview(updatePreview + 1);
        }else{
            toast.error("Failed to update !",{
                position:"top-right"
            })
        }

    }catch(error){
        toast.error("Error !!",{
            position:"top-right"
        })
        console.log(error)
    }
  };
      
  return (
    <div>
      <button
        className="btn btn-secondary w-full"
        onClick={toggleGithubActivity}
      >
        {showGitActivity ? "Hide GitHub Activity" : "Show GitHub Activity"}
      </button>
      <div className="my-3">
        {githubUsername ? (
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">GitHub Contributions</h2>
            <GitHubCalendar username={githubUsername}/>
          </div>
        ) : (
          <p>{"No GitHub username found :("}</p>
        )}
      </div>
    </div>
  );
}

export default GithubContribution;
