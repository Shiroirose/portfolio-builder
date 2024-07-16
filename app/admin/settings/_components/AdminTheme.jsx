// "use client"
// import React, { useContext, useState } from 'react'
// import Themes from '../../../_data/Themes'
// import { useUser } from '@clerk/nextjs'
// import { db } from '../../../../utils';
// import { userInfo } from '../../../../utils/schema';
// import { eq } from 'drizzle-orm';
// import { toast } from 'react-toastify';
// import { UserDetailContext } from '../../../_context/UserDetailContext';
// // import { PreviewUpdateContext } from '../../../_context/PreviewUpdateContext';

// function AdminTheme() {

//     const{user}=useUser();
//     const {userDetail}=useContext(UserDetailContext);
//     const [selectedAdminTheme,setSelectedAdminTheme]=useState();
//     // const {updatePreview,setUpdatePreview}=useContext(PreviewUpdateContext);

//     const onThemeSelect=async(themeColor)=>{
//         const result=await db.update(userInfo)
//         .set({admintheme:themeColor})
//         .where(eq(userInfo.email,user?.primaryEmailAddress?.emailAddress))

//         if(result){
//             setSelectedAdminTheme(themeColor)
//             console.log('Theme:',themeColor)
//             toast.success('Theme saved!',{
//                 position:'top-right'
//             })
//             // setUpdatePreview(updatePreview+1);
//         }
//     }


//   return (
//     <div>
//         <h2 className='font-bold text-2xl py-8'>Select the Theme you want to display on your Page !</h2>
//         <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
//             {Themes.map((theme,index)=>(
//                 <div className={`flex p-3 bg-gray-900 rounded-lg  hover:scale-[0.9] duration-300 cursor-pointer tooltip tooltip-top
//                 ${(userDetail.admintheme==theme.theme ||selectedAdminTheme==theme.theme) && 'border rounded-lg'}`}
//                 onClick={()=>onThemeSelect(theme?.theme)} data-tip={theme.theme}>
//                     <div className='w-full h-[40px] rounded-l-lg'
//                     style={{backgroundColor:theme.primary}}>
//                     </div>
//                     <div className='w-full h-[40px]'
//                     style={{backgroundColor:theme.secondary}}>
//                     </div>
//                     <div className='w-full h-[40px]'
//                     style={{backgroundColor:theme['base-100']}}>
//                     </div>
//                     <div className='w-full h-[40px] rounded-r-lg'
//                     style={{backgroundColor:theme.accent}}>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     </div>
//   )
// }

// export default AdminTheme

"use client"
import React, { useContext, useState, useEffect } from 'react'
import Themes from '../../../_data/Themes'
import { useUser } from '@clerk/nextjs'
import { db } from '../../../../utils';
import { userInfo } from '../../../../utils/schema';
import { eq } from 'drizzle-orm';
import { toast } from 'react-toastify';
import { UserDetailContext } from '../../../_context/UserDetailContext';

function AdminTheme() {
    const { user } = useUser();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const [selectedAdminTheme, setSelectedAdminTheme] = useState(userDetail?.admintheme || '');

    const onThemeSelect = async (themeColor) => {
        const result = await db.update(userInfo)
            .set({ admintheme: themeColor })
            .where(eq(userInfo.email, user?.primaryEmailAddress?.emailAddress));

        if (result) {
            setSelectedAdminTheme(themeColor);
            setUserDetail({ ...userDetail, admintheme: themeColor }); // Update context
            toast.success('Theme saved!', {
                position: 'top-right'
            });
        }
    }

    return (
        <div>
            <h2 className='font-bold text-2xl py-8'>Select your theme for the website !</h2>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                {Themes.map((theme, index) => (
                    <div key={index}
                        className={`flex p-3 bg-gray-900 rounded-lg hover:scale-[0.9] duration-300 cursor-pointer tooltip tooltip-top
                        ${(userDetail.admintheme === theme.theme || selectedAdminTheme === theme.theme) && 'border rounded-lg'}`}
                        onClick={() => onThemeSelect(theme.theme)} data-tip={theme.theme}>
                        <div className='w-full h-[40px] rounded-l-lg' style={{ backgroundColor: theme.primary }}></div>
                        <div className='w-full h-[40px]' style={{ backgroundColor: theme.secondary }}></div>
                        <div className='w-full h-[40px]' style={{ backgroundColor: theme['base-100'] }}></div>
                        <div className='w-full h-[40px] rounded-r-lg' style={{ backgroundColor: theme.accent }}></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AdminTheme;
