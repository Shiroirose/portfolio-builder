"use client"
import React, { useContext } from 'react'
import { PreviewUpdateContext } from '../../_context/PreviewUpdateContext'

function MobilePreview() {

  const {updatePreview,setUpdatePreview}=useContext(PreviewUpdateContext);

  return (
    <div className='p-2 md:p-5 md:fixed'>
        <div className='border-[13px] min-w-[340px] max-w-[400px] max-h-[650px] rounded-[40px]  border-black h-screen m-1 shadow-md shadow-primary'>
          <iframe
            title='Profile'
            key={updatePreview}
            src={process.env.NEXT_PUBLIC_BASE_URL+"sebonti"}
            width='100%'
            height='100%'
            className='rounded-[25px]'
          />  
        </div>
    </div>
  )
}

export default MobilePreview