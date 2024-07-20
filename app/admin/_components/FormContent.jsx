"use-client"
import React, { useContext, useEffect, useState } from 'react'
import UserDetails from './UserDetails'
import AddProject from './AddProject'
import { db } from '../../../utils'
import { project } from '../../../utils/schema'
import { asc, eq } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'
import ProjectListEdit from './ProjectListEdit'
import GithubContribution from './GithubContribution'
import { useRouter } from 'next/navigation'
import { UserDetailContext } from '../../_context/UserDetailContext'

function FormContent() {
  
  const {user}=useUser();
  const {userDetail}=useContext(UserDetailContext);
  const [projectList,setProjectList]=useState([]);
  const router=useRouter();
  
  useEffect(()=>{
    if(user){
      GetProjectList();
    }
  },[user])

  const GetProjectList=async()=>{
    const result=await db.select().from(project)
    .where(eq(project.emailRef,user?.primaryEmailAddress.emailAddress))
    .orderBy(asc(project.order)) //displaying projects in desccending order

    // console.log(result);
    setProjectList(result)
  }
  console.log('Name',(userDetail.name))
  // const url=  `http://localhost:3000/${encodeURIComponent(userDetail.name)}`
  const url=  `${process.env.NEXT_PUBLIC_BASE_URL}/${encodeURIComponent(userDetail.name)}`
  const linkToPortfolio=()=>{
    router.push(url)
  }

  return (
    <div className='py-10 px-6 h-screen overflow-y-auto '>
      <div className='flex justify-between items-center'>
      <div className='flex gap-2'>
        <h2 className=' text-2xl font-semibold '>Design Your </h2>
        <h2 className=' text-2xl font-semibold text-secondary'>Portfolio</h2>
      </div>
        <button className='btn btn-primary' onClick={linkToPortfolio}>View Portfolio</button>
      </div>
      <UserDetails/>
      <hr className='my-5'></hr>
      <GithubContribution/>
      <hr className='my-5'></hr>
      <AddProject />
      <ProjectListEdit projectList={projectList} refreshData={GetProjectList}/>
    </div>
  )
}

export default FormContent