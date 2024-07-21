"use client"
import React, { useContext } from 'react'
import { PreviewUpdateContext } from '../../_context/PreviewUpdateContext'
import { useUser } from '@clerk/nextjs';
import { UserDetailContext } from '../../_context/UserDetailContext';

function MobilePreview() {

  const {updatePreview,setUpdatePreview}=useContext(PreviewUpdateContext);
  const {user}=useUser();
  const {userDetail}=useContext(UserDetailContext);
  console.log('user name',userDetail.name)

  return (
    <div className='p-2 md:p-5 '>
        <div className='border-[13px] min-w-[320px] max-w-[360px] max-h-[650px] rounded-[40px]  border-black h-screen m-1 shadow-md shadow-primary'>
          <iframe
            title='Profile'
            key={updatePreview}
            src={process.env.NEXT_PUBLIC_BASE_URL+`/${userDetail.name}`}
            width='100%'
            height='100%'
            className='rounded-[25px]'
          />  
        </div>
    </div>
  )
}

export default MobilePreview