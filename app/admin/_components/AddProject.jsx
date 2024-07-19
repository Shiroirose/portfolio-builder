"use-client"
import { useUser } from '@clerk/nextjs';
import { Link2 } from 'lucide-react'
import React, { useState } from 'react'
import { UserDetailContext } from '../../_context/UserDetailContext';
import { useContext } from 'react';
import { db } from '../../../utils';
import { project } from '../../../utils/schema';
import { toast } from 'react-toastify';

function AddProject() {
    const [openUrl,setOpenUrl]=useState(false); 
    const {user}=useUser();
    const {userDetail}=useContext(UserDetailContext);
    const [loading,setLoading]=useState(false);


    const handleSubmit=async(e)=>{
        e.preventDefault();
        console.log(e.target[0].value)
        setLoading(true);
        const result=await db.insert(project)
        .values({
            url:e.target[0].value,
            emailRef:user?.primaryEmailAddress.emailAddress,
            userRef:userDetail?.id
        })

        setOpenUrl(false);
        if(result){
            setLoading(false);
            toast.success(
                <div className="flex items-center">
                    <img src="/images/success.gif" alt="Success GIF" className="w-20 h-14" />
                    <span>Project Added Successfully!</span>
                </div>, 
                { position: 'top-right' }
            );
        }
        else{
            setLoading(false);
        }

    }
  return (
    <div>
        {!openUrl?
        <button className='btn btn-secondary w-full'
        onClick={()=>setOpenUrl(true)}>Add Your Project</button>
        :
        <form onSubmit={handleSubmit} className='p-3 rounded-lg bg-secondary bg-opacity-30' >
            <label className="input input-bordered flex items-center gap-2 my-3">
                <Link2/>
                <input type='url' className='grow' placeholder='Project link' />
            </label>
                <button type='submit' disabled={loading} className='btn btn-secondary w-full mt-2'>Add project</button>
        </form>
        }

    </div>
  )
}

export default AddProject