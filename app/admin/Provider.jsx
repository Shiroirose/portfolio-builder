"use client"

import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { userInfo } from '../../utils/schema';
import { eq } from 'drizzle-orm';
import { db } from '../../utils';
import {UserDetailContext} from '../_context/UserDetailContext'

function Provider({children}) {

    const {user}=useUser();
    const [userDetail,setUserDetail]=useState([]);


    useEffect(()=>{
        user && GetUserDetails();
    },[user])

    const GetUserDetails = async()=>{
        const result=await db.select().from(userInfo)
        .where(eq(userInfo.email,user?.primaryEmailAddress?.emailAddress))
        setUserDetail(result[0]);
        // console.log(result[0]);
    }

  return (
    <div>{children}</div>
  )
}

export default Provider