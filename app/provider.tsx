'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { UserDetailContext } from '@/context/UserDetailContext';

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
        try {
            const result = await axios.post('/api/users', {});
            console.log('[Provider] User created/fetched:', result.data);
            setUserDetail(result.data?.user);
        } catch (error) {
            console.error('[Provider] Error creating/fetching user:', error);
        }
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