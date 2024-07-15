import React from 'react'
import Provider from './Provider'


function UserPageLayout({children}) {
  const MemoizedProvider = React.memo(Provider);
  return (
    <div>
        <MemoizedProvider>
            {children}
        </MemoizedProvider>
    </div>
  )
}

export default UserPageLayout