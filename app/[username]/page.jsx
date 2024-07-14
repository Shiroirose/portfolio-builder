// "use client"
// import React, { useContext,useState,useEffect } from 'react'
// import UserInfo from './_components/UserInfo'
// import ProjectList from './_components/ProjectList'
// import { UserDetailContext } from '../_context/UserDetailContext'

// function UserPage() {

//   const {userDetail}=useContext(UserDetailContext)

//   // console.log("userpage details", userDetail)
//   //project section is there in this part
//   return (
//     <div className='p-3 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-5'>
//       <div>
//         {userDetail? <UserInfo userDetail={userDetail}/>: 
//         <div>
//           Loading user info
//         </div>}
//       </div>
//       <div className='md:col-span-2'>
//        {userDetail && userDetail?.project?(
//         <ProjectList projectList={userDetail?.project} />
//        ):(
//         <div>No projects</div>
//        )} 
//       </div>
//     </div>
//   )
// }

// export default UserPage

"use client"
import React, { useContext } from 'react';
import UserInfo from './_components/UserInfo';
import ProjectList from './_components/ProjectList';
import { UserDetailContext } from '../_context/UserDetailContext';

function UserPage() {
  const { userDetail } = useContext(UserDetailContext);

  return (
    <div className='p-3 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-5'>
      <div>
        {userDetail ? <UserInfo userDetail={userDetail} /> :
          <div>
            Loading user info
          </div>}
      </div>
      <div className='md:col-span-2'>
        {userDetail && userDetail?.project ? (
          <ProjectList projectList={userDetail?.project} />
        ) : (
          <div>No projects</div>
        )}
      </div>
    </div>
  );
}

export default UserPage;

