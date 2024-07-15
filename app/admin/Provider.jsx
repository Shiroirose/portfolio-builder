"use client"

import React, { useState } from 'react'
import {PreviewUpdateContext} from '../_context/PreviewUpdateContext'


function Provider({children}) {

    const [updatePreview,setUpdatePreview]=useState(0);

  return (
    <PreviewUpdateContext.Provider value={{updatePreview,setUpdatePreview}}>
      <div>{children}</div>
    </PreviewUpdateContext.Provider>
  )
}

export default Provider