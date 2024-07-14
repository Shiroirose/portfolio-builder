import React from 'react'
import Provider from './Provider'


function UserPageLayout({children}) {
  return (
    <div>
        <Provider>
            {children}
        </Provider>
    </div>
  )
}

export default UserPageLayout