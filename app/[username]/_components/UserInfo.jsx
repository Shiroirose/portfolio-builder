"use client"
import { TwicPicture } from '@twicpics/components/react'
import { Link, Link2, MapPin, Share } from 'lucide-react'
import React from 'react'

function UserInfo({userDetail}) {
  return (
    <div className='mt-2 flex flex-col md:justify-center md:h-screen'>
        <div className='w-full flex items-center justify-between'>
            <div className='flex md:flex-col items-center md:items-start gap-4'>
                <TwicPicture src={userDetail?.profileImage}
                    className='w-[90px] h-[90px] md:w-[130px] md:h-[130px] rounded-full'
                />
                <div className='flex flex-col'>
                    <h2 className='font-bold text-lg md:text-2xl'>{userDetail?.name}</h2>
                    <h2 className='flex gap-2 items-center text-gray-500'><MapPin className='h-[15px] w-[15px]'/>{userDetail?.location}</h2>
                    <h2 className='flex gap-2 text-gray-500 items-center'><Link className='h-[12px] w-[12px]'/>{userDetail?.link}</h2>
                </div>
                <div>
                    <button className='md:hidden  btn btn-primary btn-xs md:btn-sm'>
                        <Share className='h-4 w-4'/></button>
                </div>
            </div>
        </div>
            <h2 className='my-7 ml-2 text-gray-600'>{userDetail?.bio}</h2>
            <label className="input input-bordered flex items-center gap-2">
                Email
                <input type="text" className="grow" placeholder="u@site.com" />
            </label>
    </div>
  )
}

export default UserInfo