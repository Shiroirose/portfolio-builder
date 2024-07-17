"use client"

import React, { useContext, useState } from 'react'
import {PreviewUpdateContext} from '../_context/PreviewUpdateContext'
import { UserDetailContext } from '../_context/UserDetailContext';


function Provider({children}) {

    const {userDetail}=useContext(UserDetailContext)
    const [updatePreview,setUpdatePreview]=useState(0);
    const [pageTheme,setPageTheme]=useState();
  return (
    <PreviewUpdateContext.Provider value={{updatePreview,setUpdatePreview}}>
      <div data-theme={userDetail?.admintheme}>{children}</div>
    </PreviewUpdateContext.Provider>
  )
}

export default Provider