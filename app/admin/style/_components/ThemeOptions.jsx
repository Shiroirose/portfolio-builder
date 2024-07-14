"use client"
import React, { useContext, useState } from 'react'
import Themes from '../../../_data/Themes'
import { useUser } from '@clerk/nextjs'
import { db } from '../../../../utils';
import { userInfo } from '../../../../utils/schema';
import { eq } from 'drizzle-orm';
import { toast } from 'react-toastify';
import { UserDetailContext } from '../../../_context/UserDetailContext';

function ThemeOptions() {

    const{user}=useUser();
    const {userDetail,setUserDetail}=useContext(UserDetailContext);
    const [selectedTheme,setSelectedTheme]=useState();


    const onThemeSelect=async(themeColor)=>{
        const result=await db.update(userInfo)
        .set({theme:themeColor})
        .where(eq(userInfo.email,user?.primaryEmailAddress?.emailAddress))

        if(result){
            setSelectedTheme(themeColor)
            console.log('Theme:',themeColor)
            toast.success('Theme saved!',{
                position:'top-right'
            })
        }
    }


  return (
    <div>
        <h2 className='font-bold text-2xl text-blue-50 py-8'>Select the Theme you want to display !</h2>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
            {Themes.map((theme,index)=>(
                <div className={`flex p-3 bg-gray-900 rounded-lg  hover:scale-[0.9] duration-300 cursor-pointer
                ${(userDetail.theme==theme.theme ||selectedTheme==theme.theme) && 'border rounded-lg'}`}
                onClick={()=>onThemeSelect(theme?.theme)}>
                    <div className='w-full h-[40px] rounded-l-lg'
                    style={{backgroundColor:theme.primary}}>
                    </div>
                    <div className='w-full h-[40px]'
                    style={{backgroundColor:theme.secondary}}>
                    </div>
                    <div className='w-full h-[40px]'
                    style={{backgroundColor:theme['base-100']}}>
                    </div>
                    <div className='w-full h-[40px] rounded-r-lg'
                    style={{backgroundColor:theme.accent}}>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default ThemeOptions