"use client";
import { useUser } from "@clerk/nextjs";
import React, { useContext, useEffect, useState, useRef } from "react";
import { userInfo, project } from "../../utils/schema";
import { db } from "../../utils";
import { eq } from "drizzle-orm";
import { UserDetailContext } from "../_context/UserDetailContext";
import { usePathname } from "next/navigation";

function Provider({ children }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fullName = decodeURIComponent(usePathname().replace("/", ""));

  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const hasFetched = useRef(false);

  const GetUserDetails = async (email,fullName) => {
    try {
      setLoading(true);
      setError(null);
      let result;
      if (email) {
        result = await db.query.userInfo.findMany({
          with: {
            project: true,
          },
          where: eq(userInfo.email, email),
        });
      } 
      else if (fullName) {
        result = await db.query.userInfo.findMany({
          with: {
            project: true,
          },
          where: eq(userInfo.name, fullName),
        });
      }
      console.log("Fetched :", result);
      const final = result[0];
      console.log("final", final);
      setUserDetail(final);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      if(user){
        GetUserDetails(user.primaryEmailAddress.emailAddress,null);
      }
      else
       if (fullName) {
        console.log("Fetching details for fullName:", fullName);
        GetUserDetails(null,fullName);
      }
    }
  }, [user,fullName]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  console.log("Rendered", userDetail);

  return <div data-theme={userDetail?.theme}>{children}</div>;
}

export default Provider;
