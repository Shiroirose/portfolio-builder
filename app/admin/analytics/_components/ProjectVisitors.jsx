"use client";
import React, { useEffect, useState } from "react";
import { userInfo, project, ProjectClicks } from "../../../../utils/schema";
import { eq, sql } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { db } from "../../../../utils";
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
} from "recharts";
import ProjectCustomTooltip from './ProjectCustomTooltip'

function ProjectVisitors() {
  const { user } = useUser();
  const [projectVisData, setProjectVisData] = useState([]);

  useEffect(() => {
    user && ProjectVisitorsData();
  }, [user]);

  const ProjectVisitorsData = async () => {
    const result = await db
      .select({
        totalClick: sql`count(${ProjectClicks.id})`.mapWith(Number),
        name: project.name,
        projectId: ProjectClicks.projectRef,
      })
      .from(ProjectClicks)
      .rightJoin(project, eq(ProjectClicks.projectRef, project.id))
      .innerJoin(userInfo, eq(project.userRef, userInfo.id))
      .where(eq(userInfo.email, user?.primaryEmailAddress.emailAddress))
      .groupBy(ProjectClicks.projectRef, project.name);

    setProjectVisData(result);
    console.log("Project visits", result);
  };
  return (
      <div className="border rounded-lg p-7">
      <h2 className="font-bold text-lg m-3">Number of Visitors per Project</h2>
        <ResponsiveContainer width={"100%"} height={250}>
      <BarChart width={730} height={250} data={projectVisData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<ProjectCustomTooltip />} />
        <Legend />
        <Bar dataKey="totalClick" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
    </div>
  );
}

export default ProjectVisitors;
