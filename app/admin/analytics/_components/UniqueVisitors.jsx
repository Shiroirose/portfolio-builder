"use client";
import React, { useEffect, useState } from "react";
import { eq, sql } from "drizzle-orm";
import { db } from "../../../../utils";
import { ProjectClicks } from "../../../../utils/schema";
import { userInfo } from "../../../../utils/schema";
import { useUser } from "@clerk/nextjs";
import { project } from "../../../../utils/schema";
import AnalyticChart from "../../../[username]/_components/AnalyticChart";
import { AreaChart, Tooltip, XAxis, YAxis, Area, ResponsiveContainer} from "recharts";
import UniqueCustomTooltip from "./UniqueCustomTooltip";

function UniqueVisitors() {
  const { user } = useUser();
  const [data, setData] = useState();
  const GetUniqueVisitors = async () => {
    const result = await db
      .select({
        totalClick: sql`count(${ProjectClicks.id})`.mapWith(Number),
        month: ProjectClicks.month,
      })
      .from(ProjectClicks)
      .rightJoin(project, eq(ProjectClicks.projectRef, project.id))
      .innerJoin(userInfo, eq(project.userRef, userInfo.id))
      .where(eq(userInfo.email, user?.primaryEmailAddress.emailAddress))
      .groupBy(ProjectClicks.month);

    console.log("Res:", result);
    let res = [];
    res.push(
      {
        month: "May",
        totalClick: 0,
        // projectId: 0,
      },
      {
        month: "June",
        totalClick: 0,
        // projectId: 0,
      }
    );
    const finalResult = [...res, ...result];
    setData(finalResult);
    console.log("Unique Visitors", finalResult);
  };
  useEffect(() => {
    user && GetUniqueVisitors();
  }, [user]);

  return (
    <div className="border rounded-lg p-7">
        <h2 className="font-bold text-lg m-3">Number of Visitors per month</h2>
      <ResponsiveContainer width={"100%"} height={250}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" style={{ fontSize: 10 }} />
          <YAxis style={{ fontSize: 10 }} />
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <Tooltip content={<UniqueCustomTooltip/>}/>
          <Area
            type="monotone"
            dataKey="totalClick"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default UniqueVisitors;
