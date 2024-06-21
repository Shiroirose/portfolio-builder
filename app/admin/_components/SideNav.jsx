import { UserButton } from '@clerk/nextjs'
import { BarChart4, Brush, Layers3, Settings } from 'lucide-react'
import React from 'react'

function SideNav() {
    const menuList=[
    {
        id:1,
        name:'Pages',
        icon: Layers3
    },
    {
        id:2,
        name:'Style',
        icon: Brush
    },
    {
        id:3,
        name:'Stats',
        icon: BarChart4
    },
    {
        id:4,
        name:'Settings',
        icon: Settings
    }
]
  return (
    <div className='p-4 bg-black h-screen'>
        <div className=' px-4 py-2'>
            <UserButton/>
        </div>
        {menuList.map((menu,index)=>(
            <div className='p-2 py-4 rounded-lg bg-primary mb-4 flex items-center justify-center hover:scale-[0.9] duration-300 tooltip tooltip-right ' data-tip={menu.name}>
                <menu.icon className='text-white text-center'/>
            </div>
        ))}

    </div>
  )
}

export default SideNav