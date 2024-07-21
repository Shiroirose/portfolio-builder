"use-client"
import React, { useContext, useEffect, useState } from 'react'
import UserDetails from './UserDetails'
import AddProject from './AddProject'
import { db } from '../../../utils'
import { project, userInfo } from '../../../utils/schema'
import { asc, eq } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'
import ProjectListEdit from './ProjectListEdit'
import GithubContribution from './GithubContribution'
import { useRouter } from 'next/navigation'
import { UserDetailContext } from '../../_context/UserDetailContext'
import { toast } from 'react-toastify'
function FormContent() {
  
  const {user}=useUser();
  const {userDetail}=useContext(UserDetailContext);
  const [projectList,setProjectList]=useState([]);
  const [show, setShow] = useState(userDetail?.showtour)
  const router=useRouter();
  
  useEffect(()=>{
    if(user){
      GetProjectList();
    }
  },[user])

  const GetProjectList=async()=>{
    const result=await db.select().from(project)
    .where(eq(project.emailRef,user?.primaryEmailAddress?.emailAddress))
    .orderBy(asc(project.order)) //displaying projects in desccending order

    // console.log(result);
    setProjectList(result)
  }
  console.log('Name',(userDetail?.name))
  const siteName=userDetail?.name || "testuser"
  const url=  `https://craftify-pied.vercel.app/${encodeURIComponent(siteName)}`
  // const url=  `${process.env.NEXT_PUBLIC_BASE_URL}/${encodeURIComponent(siteName)}`
  const linkToPortfolio=()=>{
    router.push(url)
  }

  const handlestarttour=async()=>{
    const newshow=!show;
    setShow(newshow);
    try{
      const result=await db.update(userInfo)
      .set({showtour: newshow})
      .where(eq(userInfo.id,userDetail.id))

      if(result){
          toast.success(newshow ? "Let's start the tour!" : "Tour stopped!",{
              position:"top-right"
          })
          // setUpdatePreview(updatePreview + 1);
      }else{
          toast.error(newshow ? "Failed to start tour!" : "Failed to stop tour!",{
              position:"top-right"
          })
      }

  }catch(error){
      toast.error("Error !!",{
          position:"top-right"
      })
      console.log(error)
  }

  }
  return (
    <div className='py-10 px-6 h-screen overflow-y-auto '>
      <div className='flex justify-between items-center'>
      <div className='flex flex-col md:flex-row gap-0 md:gap-2'>
        <h2 className=' md:text-2xl font-semibold '>Design Your </h2>
        <h2 className=' md:text-2xl font-semibold text-secondary'>Portfolio</h2>
      </div>
      <div className='flex gap-2'>
        <button className='btn btn-sm md:btn-md btn-primary' onClick={handlestarttour}>{show ? "Stop Tour" : "Start Tour"}</button>
        <button className='btn btn-sm md:btn-md btn-primary' onClick={linkToPortfolio}>View Portfolio</button>
      </div>
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