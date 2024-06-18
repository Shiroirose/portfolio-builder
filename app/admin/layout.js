//the admin page renders through this layout file
//it contains the side navbar, the main content and the mobile preview

import React from 'react'
import SideNav from './_components/SideNav'

function Adminlayout({children}) {
  return (
    <div>
        <div className='w-24 fixed'>
        <SideNav/>
        </div>

        <div className='ml-24'>
        {children}
        </div>
    </div>
  )
}

export default Adminlayout