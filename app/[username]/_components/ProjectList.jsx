// "use client"
// import { TwicPicture } from '@twicpics/components/react'
// import Link from 'next/link';
// import React, { useEffect, useState } from 'react'
// import { db } from '../../../utils';
// import { project, ProjectClicks, userInfo } from '../../../utils/schema';
// import moment, { months } from 'moment';
// import AnalyticChart from './AnalyticChart'
// import { sql } from 'drizzle-orm';
// import { useUser } from '@clerk/nextjs';
// import { eq } from 'drizzle-orm';

// function ProjectList({projectList}) {
    
//     console.log('Props',projectList);
//     const {user}=useUser();
//     const [projectClickData,setProjectClickData]=useState([]);

//     useEffect(()=>{
//         user && ProjectAnalyticsData();
//     },[user])

//   const OnProjectClick=async(project)=>{
//     const result=await db.insert(ProjectClicks)
//     .values({
//         month:moment().format('MMM'),
//         projectRef:project.id
//     })
//     window.open(project.url,'_blank')
//   }
//   const ProjectAnalyticsData=async()=>{
//     const result=await db.select({
//         totalClick:sql`count(${ProjectClicks.id})`.mapWith(Number),
//         month:ProjectClicks.month,
//         projectId:ProjectClicks.projectRef
//     }).from(ProjectClicks)
//     .rightJoin(project,eq(ProjectClicks.projectRef,project.id))
//     .innerJoin(userInfo,eq(project.userRef,userInfo.id))
//     .where(eq(userInfo.email,user?.primaryEmailAddress.emailAddress))
//     .groupBy(ProjectClicks.projectRef,ProjectClicks.month)

//     setProjectClickData(result);
//     console.log('visits',result);
//   }

//   const GetProjectwiseAnalyticData=(projectId)=>{
//     let resp=projectClickData?.filter((project)=>project.projectId==projectId)
//     let result=[];

//     result.push({
//         month:'June',
//         totalClick:0,
//         projectId:0
//     },{
//         month:'July',
//         totalClick:0,
//         projectId:0
//     })

//     const finalResult=[...result,...resp]
//     return finalResult;
//   }
//   return (
//     <div className='grid grid-cols-1 md:grid-cols-2 gap-7 my-8'>
//         {projectList?.map((project,index)=>(
//             <div onClick={()=>OnProjectClick(project)} key={project.id} className='border shadow-sm rounded-lg p-7 hover:scale-[0.9] duration-300 cursor-pointer  hover:shadow-md'>
//                 <div className='flex gap-2 items-center'>
//                     <TwicPicture src={project?.logo}className='h-[40px] w-[40px] rounded-full'/>
//                     <h2 className='font-bold  w-full flex justify-between items-center mt-2'>{project?.name}
//                         {/* <span className='hidden lg:block text-xs font-normal bg-info text-info-content p-2 rounded-full'>{project.category}</span> */}
//                         <div className='hidden md:block badge badge-accent text-xs font-normal'>{project.category}</div>
//                     </h2>
//                 </div>
//                 <h2 className='text-base-content/80 text-xs lg:text-sm my-2'>{project.desc}</h2>
//                 {project?.showGraph &&user &&<AnalyticChart
//                 data={GetProjectwiseAnalyticData(project.id)}/>}
//             </div>
//         ))}
//     </div>
//   )
// }

// export default ProjectList


"use client"
import { TwicPicture } from '@twicpics/components/react'
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../../../utils';
import { project, ProjectClicks, userInfo } from '../../../utils/schema';
import moment, { months } from 'moment';
import AnalyticChart from './AnalyticChart'
import { sql } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { UserDetailContext } from '../../_context/UserDetailContext';

function ProjectList({projectList}) {
    
    console.log('Props',projectList);
    const {user}=useUser();
    const {userDetail}=useContext(UserDetailContext);
    const [projectClickData,setProjectClickData]=useState([]);

    useEffect(()=>{
        userDetail && ProjectAnalyticsData();
    },[userDetail])

  const OnProjectClick=async(project)=>{
    const result=await db.insert(ProjectClicks)
    .values({
        month:moment().format('MMM'),
        projectRef:project.id
    })
    window.open(project.url,'_blank')
  }
  const ProjectAnalyticsData=async()=>{
    const result=await db.select({
        totalClick:sql`count(${ProjectClicks.id})`.mapWith(Number),
        month:ProjectClicks.month,
        projectId:ProjectClicks.projectRef
    }).from(ProjectClicks)
    .rightJoin(project, eq(ProjectClicks.projectRef, project.id))
        .innerJoin(userInfo, eq(project.userRef, userDetail.id))
        .where(eq(project.emailRef, userDetail.email))
        .groupBy(ProjectClicks.projectRef, ProjectClicks.month);

    setProjectClickData(result);
    console.log('visits',result);
  }

  const GetProjectwiseAnalyticData=(projectId)=>{
    let resp=projectClickData?.filter((project)=>project.projectId==projectId)
    let result=[];

    result.push({
        month:'June',
        totalClick:0,
        projectId:0
    },{
        month:'July',
        totalClick:0,
        projectId:0
    })

    const finalResult=[...result,...resp]
    return finalResult;
  }
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-7 my-8'>
        {projectList?.filter(project => project.active)?.map((project,index)=>(
            <div onClick={()=>OnProjectClick(project)} key={project.id} className='border shadow-sm rounded-lg p-7 hover:scale-[0.9] duration-300 cursor-pointer  hover:shadow-md'>
                <div className='flex gap-2 items-center'>
                    <TwicPicture src={project?.logo}className='h-[40px] w-[40px] rounded-full'/>
                    <h2 className='font-bold  w-full flex justify-between items-center mt-2'>{project?.name}
                        {/* <span className='hidden lg:block text-xs font-normal bg-info text-info-content p-2 rounded-full'>{project.category}</span> */}
                        <div className='hidden md:block badge badge-accent text-xs font-normal'>{project.category}</div>
                    </h2>
                </div>
                <h2 className='text-base-content/80 text-xs lg:text-sm my-2'>{project.desc}</h2>
                {project?.showGraph &&<AnalyticChart
                data={GetProjectwiseAnalyticData(project.id)}/>}
            </div>
        ))}
    </div>
  )
}

export default ProjectList