"use client"
import { UserButton } from '@clerk/nextjs'
import { BarChart4, Brush, Layers3, Settings } from 'lucide-react'
import Link from 'next/link'
import React, { useContext } from 'react'
import { UserDetailContext } from '../../_context/UserDetailContext'

function SideNav() {
    const {userDetail}=useContext(UserDetailContext);
    const menuList=[
    {
        id:1,
        name:'Pages',
        icon: Layers3,
        path:'/admin'
    },
    {
        id:2,
        name:'Style',
        icon: Brush,
        path:'/admin/style'
    },
    {
        id:3,
        name:'Stats',
        icon: BarChart4,
        path:'/admin/analytics'
    },
    {
        id:4,
        name:'Settings',
        icon: Settings,
        path:'/admin/settings'
    }
]
  return (
    <div data-theme={userDetail?.admintheme || "dark"} className='p-4 bg-black h-screen'>
        <div className=' px-4 py-2'>
            <UserButton/>
        </div>
        {menuList.map((menu,index)=>(
            <Link href={menu.path} className='p-2 py-4 rounded-lg bg-primary mb-4 flex items-center justify-center hover:scale-[0.9] duration-300 tooltip tooltip-secondary tooltip-right ' data-tip={menu.name}>
                <menu.icon className='text-white text-center'/>
            </Link>
        ))}

    </div>
  )
}

export default SideNav