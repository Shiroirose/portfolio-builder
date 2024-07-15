import React from 'react'
import ProjectVisitors from './_components/ProjectVisitors'
import UniqueVisitors from './_components/UniqueVisitors'


function Analytics() {
  return (
    <div className='h-full md:h-screen p-10'> 
        <h2 className='font-bold text-2xl '>Analytics</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 mt-10'>
            <div><UniqueVisitors/></div>
            <div><ProjectVisitors/></div>
        </div>
    </div>
  )
}

export default Analytics