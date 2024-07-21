"use client"
import { TwicPicture } from "@twicpics/components/react";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../../../utils";
import { project, ProjectClicks, userInfo } from "../../../utils/schema";
import moment from "moment";
import AnalyticChart from "./AnalyticChart";
import { sql } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { UserDetailContext } from "../../_context/UserDetailContext";
import { ExternalLink } from "lucide-react";

function ProjectList({ projectList }) {
  console.log("Props", projectList);
  const { user } = useUser();
  const { userDetail } = useContext(UserDetailContext);
  const [projectClickData, setProjectClickData] = useState([]);

  useEffect(() => {
    userDetail && ProjectAnalyticsData();
  }, [userDetail]);

  const OnProjectClick = async (project) => {
    await db.insert(ProjectClicks).values({
      month: moment().format("MMM"),
      projectRef: project.id,
    });
  };

  const ProjectAnalyticsData = async () => {
    const result = await db
      .select({
        totalClick: sql`count(${ProjectClicks.id})`.mapWith(Number),
        month: ProjectClicks.month,
        projectId: ProjectClicks.projectRef,
      })
      .from(ProjectClicks)
      .rightJoin(project, eq(ProjectClicks.projectRef, project.id))
      .innerJoin(userInfo, eq(project.userRef, userDetail.id))
      .where(eq(project.emailRef, userDetail.email))
      .groupBy(ProjectClicks.projectRef, ProjectClicks.month);

    setProjectClickData(result);
    console.log("visits", result);
  };

  const GetProjectwiseAnalyticData = (projectId) => {
    let resp = projectClickData?.filter(
      (project) => project.projectId == projectId
    );
    let result = [];

    result.push(
      {
        month: "June",
        totalClick: 0,
        projectId: 0,
      },
      {
        month: "July",
        totalClick: 0,
        projectId: 0,
      }
    );

    const finalResult = [...result, ...resp];
    return finalResult;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-7 my-8 ">
      {projectList
        ?.filter((project) => project.active)
        ?.map((project, index) => {
          const [isExpanded, setIsExpanded] = useState(false);
          const MAX_LENGTH = 50;

          const toggleExpanded = () => {
            setIsExpanded(!isExpanded);
          };

          const renderDescription = (desc) => {
            if (desc?.length <= MAX_LENGTH) {
              return desc;
            }
            if (desc) {
                return isExpanded ? desc : desc.substring(0, MAX_LENGTH) + "...";
              }
              return "";
            // return desc?.substring(0, MAX_LENGTH) + "...";
          };

          return (
            <div
            //   onClick={() => OnProjectClick(project)}
              key={project.id}
              className="relative border border-primary shadow-sm rounded-lg p-7 hover:scale-[0.95] duration-300 cursor-pointer hover:shadow-md"
            >
              <div className="absolute top-2 right-2">
                <button
                  className="btn btn-ghost "
                  onClick={() => {window.open(project.url, "_blank"),OnProjectClick(project)}}
                >
                  <ExternalLink className="w-4 h-4"  />
                </button>
              </div>
              <div className="flex gap-2 items-center my-2">
                <TwicPicture
                  src={project?.logo}
                  className="h-[40px] w-[40px] rounded-full"
                />
                <h2 className="font-bold w-full flex justify-between items-center mt-2">
                  {project?.name}
                  <div className="hidden md:block badge badge-accent text-xs font-normal">
                    {project.category}
                  </div>
                </h2>
              </div>
              <h2 className="text-base-content/80 text-xs lg:text-sm my-2  " style={{
                  maxHeight: isExpanded ? "none" : "3.7em", 
                  overflow: "hidden",
                }}>
                <span className="whitespace-pre-wrap" style={{overflowWrap:"break word",flex:"1 1 auto"}}>
                    {renderDescription(project.desc)}
                </span>
                {project.desc?.length > MAX_LENGTH && (
                  <button
                    className="ml-2 text-blue-500 hover:underline"
                    onClick={toggleExpanded}
                  >
                    {isExpanded ? "Show less" : "Read more"}
                  </button>
                )}
              </h2>
              <div className="">
              {project?.showGraph && (
                <AnalyticChart data={GetProjectwiseAnalyticData(project.id)} />
              )}
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default ProjectList;
