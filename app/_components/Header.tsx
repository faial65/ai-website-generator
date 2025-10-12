"use client"
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { SignInButton, useUser, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

const MenuOptions = [
  {
    name: "Pricing",
    path: "/pricing"
  },
  {
    name: "Contact us",
    path: "/contact"
  }
];

const Header = () => {
  const { user, isLoaded } = useUser();
  return (
    <div className='flex items-center justify-between p-4 shadow-md'>
        {/* Logo */}
        <div className='flex gap-2 items-center'>
          <Image src="/logo.svg" alt="Logo" width={35} height={35} />
          <h2 className='font-bold text-xl'>AI Website Generator</h2>
        </div>

        {/* Menu Options */}
        <div className='flex gap-3'>
            {MenuOptions.map((menu,index) => (
                <Button variant={'ghost'} key={index}>
                  {menu.name}
                </Button>
            ))}
        </div>
        {/* Get Started Button */}
        <div className='flex items-center gap-3'>
          {!isLoaded ? (
            <Button disabled>Loading... <ArrowRight /></Button>
          ) : !user ? (
            <SignInButton mode='modal' forceRedirectUrl={'/workspace'}>
              <Button>Get Started <ArrowRight /></Button>
            </SignInButton>
          ) : (
            <>
              <Link href={'/workspace'}>
                <Button>Go to Workspace <ArrowRight /></Button>
              </Link>
            </>
          )}
        </div>
    </div>
  )
}

export default Header