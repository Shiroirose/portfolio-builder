"use client"

import React, { useEffect } from 'react'
import { userInfo } from '../../utils/schema'
import { useUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import {db} from '../../utils/index'
import { useRouter } from 'next/navigation'
import FormContent from './_components/FormContent'
import MobilePreview from './_components/MobilePreview'

function Admin() {

    const {user}=useUser();
    const router=useRouter();

    useEffect(()=>{
        user&&CheckUser();
    },[user])

    const CheckUser= async()=>{
        // const email = user?.primaryEmailAddress?.emailAddress

        const result= await db.select().from(userInfo).where(eq(userInfo.email,user?.primaryEmailAddress?.emailAddress))
        console.log('Result:',result);
        if(result?.length==0)
            {
                router.replace('/create')
            }
    }


  return (
    <div>
      <div className='grid grid-cols-1 lg:grid-cols-3'>
        <div className='col-span-2'>
          <FormContent/>
        </div>
         <div>
          <MobilePreview/>
        </div>
      </div>
    </div>
  )
}

export default Admin

