"use client";
import React, { useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import UserInfo from "./_components/UserInfo";
import ProjectList from "./_components/ProjectList";
import { UserDetailContext } from "../_context/UserDetailContext";
import { db } from "../../utils";
import { eq, asc } from "drizzle-orm";
import { project } from "../../utils/schema";
import GithubContribution from "../admin/_components/GithubContribution";
import GitHubCalendar from "react-github-calendar";

function UserPage() {
  // const { user } = useUser();
  const { userDetail } = useContext(UserDetailContext);
  const [projectList, setProjectList] = useState([]);

  useEffect(() => {
    if (userDetail) {
      console.log("USer details", userDetail);
      GetProjectList();
    }
  }, [userDetail]);

  const GetProjectList = async () => {
    try {
      const result = await db
        .select()
        .from(project)
        .where(eq(project.emailRef, userDetail.email))
        .orderBy(asc(project.order));
      console.log(result);
      setProjectList(result);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };
  return (
    <div>
      <div className='p-3 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-5 bg-[url("/images/stars.gif")]'>
        <div>
          {userDetail ? (
            <UserInfo userDetail={userDetail} />
          ) : (
            <div>Loading user info</div>
          )}
        </div>
        <div className="md:col-span-2">
          {projectList.length > 0 ? (
            <ProjectList projectList={projectList} />
          ) : (
            <div>No projects</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserPage;
