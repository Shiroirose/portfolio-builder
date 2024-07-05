import React from 'react'
import projectList from './FormContent'
import { TwicPicture } from '@twicpics/components/react'

function ProjectListEdit({projectList}) {
  return (
    <div className='mt-8'>
        {projectList.map((project,index)=>(
            <div className='my-5 bg-gray-800 p-3 rounded-lg'>
                <div className='flex items-center gap-2 '>
                <TwicPicture src={`${project.logo}`} className='h-[40px] w-[40px] rounded-full'></TwicPicture>
                <input type="text" placeholder="Project Name" className="input input-bordered w-full " />
                </div>
                {/* <input type="text" placeholder="Describe your Project" className="input input-bordered w-full my-3 " /> */}
                <textarea placeholder='Descrbe your project' className='textarea textarea-bordered w-full mt-3 text-sm'/> 
            </div>
        ))}
    </div>
  )
}

export default ProjectListEdit