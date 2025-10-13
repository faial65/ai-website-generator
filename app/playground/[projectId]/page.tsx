"use client"
import React, { useEffect, useState } from 'react'
import PlaygroundHeader from '../_components/PlaygroundHeader'
import ChatSection from '../_components/ChatSection'
import Design from '../_components/Design'
import Settings from '../_components/Settings'
import { useParams, useSearchParams } from 'next/navigation'
import axios from 'axios'

export type Frame={
    projectId:string,
    frameId:string,
    designCode:string,
    chatMessages:Messages[]
}
export type Messages={
    role:string,
    content:string
}

const playground = () => {
    const { projectId } = useParams();
    const params = useSearchParams();
    const frameId = params.get('frameId');
    const [frameDetails, setFrameDetails] = useState<Frame>();

    useEffect(() => {
        frameId && GetFrameDetails();
    }, [frameId]);

    const GetFrameDetails = async () => {
        try {
            // fetch frame details from database using projectId and frameId
            const result = await axios.get('/api/frames?frameId=' + frameId + '&projectId=' + projectId);
            console.log('Frame Details:', result.data);
            setFrameDetails(result.data);
        } catch (error) {
            console.error('Error fetching frame details:', error);
        }
    }

    const SendMessage=(userInput:string)=>{

    }

  return (
    <div>
        <PlaygroundHeader />
        <div className='flex'>
            {/* chatSection */}
            <ChatSection messages={frameDetails?.chatMessages??[]}
            onSend={(input:string) => SendMessage(input)}
            />

            {/* WebsiteDesignSection */}
            <Design />

            {/* Settings Section */}
            <Settings   />
        </div>
        
    </div>
  )
}

export default playground