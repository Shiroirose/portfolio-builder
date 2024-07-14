// "use client"
// import { useUser } from '@clerk/nextjs';
// import React, { useContext, useEffect, useState } from 'react';
// import { userInfo } from '../../utils/schema';
// import { db } from '../../utils';
// import { eq, ilike } from 'drizzle-orm';
// import { UserDetailContext } from '../_context/UserDetailContext';
// import { usePathname } from 'next/navigation';

// function Provider({ children }) {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const USERNAME = usePathname().replace('/','');
//   const { userDetail, setUserDetail } = useContext(UserDetailContext);
  
  

//   const GetUserDetails = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const result = await db.query.userInfo.findMany({
//         with: {
//           project: true,
//         },
//         where: eq(userInfo.name,USERNAME),
//       });
//       console.log('wdg',result)
//       const final=result[0];
//       console.log('final',final)
//       setUserDetail(final);
      
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     console.log(USERNAME)
//     GetUserDetails();
//   },[USERNAME]);

  
//   // useEffect(() => {
//   //   // if (user) {
//   //   console.log('final details',userDetail);
//   // }, [userDetail]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   console.log(userDetail)
//   return (
//     <div data-theme={userDetail?.theme}>
//       {children}
//     </div>
//   );
// }

// export default Provider;


"use client"
import { useUser } from '@clerk/nextjs';
import React, { useContext, useEffect, useState } from 'react';
import { userInfo } from '../../utils/schema';
import { db } from '../../utils';
import { eq } from 'drizzle-orm';
import { UserDetailContext } from '../_context/UserDetailContext';
import { usePathname } from 'next/navigation';

function Provider({ children }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const USERNAME = usePathname().replace('/', '');
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  useEffect(() => {
    if (USERNAME) {
      console.log("Fetching details for USERNAME:", USERNAME);
      GetUserDetails();
    }
  }, [USERNAME]);

  const GetUserDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await db.query.userInfo.findMany({
        with: {
          project: true,
        },
        where: eq(userInfo.username, USERNAME),
      });
      console.log("Query result:", result);
      const final = result[0];
      if (final) {
        setUserDetail(final);
      } else {
        setUserDetail(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  console.log("User details:", userDetail);
  return (
    <div data-theme={userDetail?.theme}>
      {children}
    </div>
  );
}

export default Provider;
