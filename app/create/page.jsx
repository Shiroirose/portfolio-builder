"use client"

import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import {db} from '../../utils/index'
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { userInfo } from '../../utils/schema';
import { eq } from 'drizzle-orm';

function CreateUserName() {
    const [username,setUsername]=useState('');
    const {user} = useUser();
    const router=useRouter();

    useEffect(()=>{
        user&&CheckUser();
    },[user])
    const CheckUser= async()=>{
       
        const result= await db.select().from(userInfo).where(eq(userInfo.email,user?.primaryEmailAddress?.emailAddress))
        // console.log('Result:',result);
        if(result?.length>0)
            {
                router.replace('/admin')
            }
    }


    const handleInputChange = (e) => {
            setUsername(e.target.value);
          };

    const OnCreateBtnClick=async()=>{
        if(username.length>10){
            toast.error("Username must be less than 10 characters !", {
                position: "top-right"
              });
              return;
        }

        const result= await db.insert(userInfo)
        .values({
            name:user?.fullName,
            email:user?.primaryEmailAddress?.emailAddress,
            username: username.replace(' ','')

        })
        if(result){
            toast.success("Username created successfully !", {
                position: "top-right"
              });
              router.replace('/admin')
        }
    }
  return (
    <div className='flex items-center justify-center h-screen' >
        <div className=' p-5 md:p-10 border rounded-lg flex flex-col'>
            <h2 className='font-bold text-xl md:text-2xl py-5 text-center'>Create username for portfolio</h2>
            <input type="text" placeholder="Type username here" value={username} onChange={handleInputChange} className="input input-bordered py-2 w-full" />
            <button disabled={!username} onClick={()=>OnCreateBtnClick()} className='btn btn-primary mt-3'>Create</button>
        </div>
    </div>
  )
}

export default CreateUserName