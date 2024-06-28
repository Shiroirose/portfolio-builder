"use client"
import { Camera } from 'lucide-react'
import React, { useContext, useEffect } from 'react'
import { db } from '../../../utils';
import { userInfo } from '../../../utils/schema';
import { useUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { toast } from 'react-toastify';
import { UserDetailContext } from '../../_context/UserDetailContext';


function UserDetails() {

  const {user}=useUser();
  let timeoutId;

  const {userDetail,setUserDetail}=useContext(UserDetailContext);

  useEffect(()=>{
    // userDetail&&console.log(userDetail)
    if(userDetail){
      console.log('User Detail:', userDetail);
    }
  },[userDetail])
  const onInputchange=(event,fieldName)=>{

    clearTimeout(timeoutId)
    timeoutId=setTimeout(async()=>{
      const result=await db.update(userInfo)
      .set({[fieldName]:event.target.value})
      .where(eq(userInfo.email,user?.primaryEmailAddress.emailAddress))

      if(result){
        toast.success('Saved and updated!',{
          position:'top-right'
        })
      }

      else if(!result){
        toast.error('Unsuccessful attempt!',{
          position:'top-right'
        })
      }
    },1000); 
    

  }

  if(!userDetail){
    // return <div>Loading...</div>
    return <span className="loading loading-spinner loading-md"></span>
  }

  return (
    <div className='bg-gray-800 rounded-lg p-10 mt-3'>
      <div className='flex gap-2'>
        <Camera className='rounded-full p-2 h-12 w-12 bg-gray-700'/>
        <input
          type='text' placeholder='Your Username?' 
          defaultValue={userDetail?.name}
          onChange={(event)=>onInputchange(event,'name')}
          className='input input-bordered w-full placeholder-opacity-40'
          data-fdprocessedid={null}/>
      </div>
      <textarea
        className="textarea textarea-bordered w-full mt-3" 
        placeholder="Write about yourself"
        defaultValue={userDetail?.bio}
        onChange={(event)=>onInputchange(event,'bio')}
        data-fdprocessedid={null}></textarea>
    </div>
  )
}

export default UserDetails