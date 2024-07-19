"use-client"
import React, { useEffect, useState } from 'react'
import UserDetails from './UserDetails'
import AddProject from './AddProject'
import { db } from '../../../utils'
import { project } from '../../../utils/schema'
import { asc, eq } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'
import ProjectListEdit from './ProjectListEdit'
import GithubContribution from './GithubContribution'

function FormContent() {
  
  const {user}=useUser();
  const [projectList,setProjectList]=useState([]);
  
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


  return (
    <div className='py-10 px-6 overflow-auto '>
      <h2 className=' text-2xl font-semibold '>Design Your Portfolio !</h2>
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