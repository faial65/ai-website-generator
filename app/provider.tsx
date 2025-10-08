'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { UserDetailContext } from '@/context/UserDetailContext';
import { set } from 'date-fns';

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){

    const {user}=useUser();
    const [userDetail,setUserDetail]=useState<any>();
    useEffect(() => {
        if (user) {
            createNewUser();
        }
    }, [user]);

    const createNewUser = async () => {
            const result = await axios.post('/api/users', {});
            console.log(result.data);
            setUserDetail(result.data?.user );
        
    }

  return (
    <div>
        <UserDetailContext.Provider value={{ userDetail,setUserDetail }}>
            {children}
        </UserDetailContext.Provider>
    </div>
  )
}

export default Provider