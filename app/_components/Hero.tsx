'use client'
import { Button } from '@/components/ui/button'
import { SignInButton } from '@clerk/nextjs'
import { ArrowUp, HomeIcon, ImagePlus, Key, LayoutDashboard, User } from 'lucide-react'
import React, { useState } from 'react'

const suggestion = [
    {
        label:'Dashboard',
        prompt:'Create an analytical dashboard to track customers and revenues for a saas product',
        icon: LayoutDashboard
    },
    {
        label:'SignUp Form',
        prompt:'Create a modern sign up form with email/password, Google and GitHub login options, and terms checkbox to increase user sign ups and conversions',
        icon: Key
    },
    {
        label:'Hero',
        prompt:'Create a modern header and centered hero section for a productivity SaaS, Include a badge for feature announcement, a title with a subtle gradient, subtitle, CTA, small social proof and an image',
        icon: HomeIcon
    },
    {
        label:'User Profile Card',
        prompt:'Create a modern user profile card component with profile picture, name, bio, social media links, and follow button to showcase user information in a visually appealing way',
        icon: User
        
    }
]

const Hero = () => {

    const [userInput, setUserInput] = useState<string>('');

  return (
    <div className='flex flex-col items-center h-[80vh] justify-center'>
        {/* Header & description */}
        <h2 className='font-bold text-5xl'>What you want to design</h2>
        <p className='mt-2 text-xl text-gray-500'>Generate,Edit and Export design with AI</p>

        {/* Input Box */}
        <div className='w-full max-w-2xl p-5 border mt-5 rounded-2xl'>
            <textarea placeholder='Describe what you want to design with me'
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className='w-full h-24 focus:outline-none focus:ring-0 resize-none'
            ></textarea>
            <div className='flex justify-between items-center'>
                <Button variant={'ghost'}><ImagePlus /></Button>
                <SignInButton mode='modal' forceRedirectUrl={'/workspace'}>
                <Button disabled={!userInput}><ArrowUp /></Button>
                </SignInButton>
            </div>
        </div>

        {/* Suggestions box */}
        <div className='mt-4 flex gap-3'>
            {suggestion.map((suggestionItem,index) => (
                <Button key={index} variant={'outline'}
                onClick={() => setUserInput(suggestionItem.prompt)}>
                    <suggestionItem.icon />
                    {suggestionItem.label}</Button>
            ))}
        </div>
    </div>
  )
}

export default Hero