"use client"
import React, { useEffect, useState } from 'react'
import PlaygroundHeader from '../_components/PlaygroundHeader'
import ChatSection from '../_components/ChatSection'
import Design from '../_components/Design'
import Settings from '../_components/Settings'
import { useParams, useSearchParams } from 'next/navigation'
import axios from 'axios'
import { set } from 'date-fns'
import { preconnect } from 'react-dom'

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


const Prompt=`userInput: {userInput}

Instructions:

1. If the user input is explicitly asking to generate code, design, or HTML/CSS/JS output (e.g., "Create a landing page", "Build a dashboard", "Generate HTML Tailwind CSS code"), then:

   - Generate a complete HTML Tailwind CSS code using Flowbite UI components.  
   - Use a modern design with **blue as the primary color theme**.  
   - Only include the <body> content (do not add <head> or <title>).  
   - Make it fully responsive for all screen sizes.  
   - All primary components must match the theme color.  
   - Add proper padding and margin for each element.  
   - Components should be independent; do not connect them.  
   - Use placeholders for all images:  
       - Light mode: https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg
       - Dark mode: https://www.cibaky.com/wp-content/uploads/2015/12/placeholder-3.jpg
       - Add alt tag describing the image prompt.  
   - Use the following libraries/components where appropriate:  
       - FontAwesome icons (fa fa-)  
       - Flowbite UI components: buttons, modals, forms, tables, tabs, alerts, cards, dialogs, dropdowns, accordions, etc.  
       - Chart.js for charts & graphs  
       - Swiper.js for sliders/carousels  
       - Tippy.js for tooltips & popovers  
   - Include interactive components like modals, dropdowns, and accordions.  
   - Ensure proper spacing, alignment, hierarchy, and theme consistency.  
   - Ensure charts are visually appealing and match the theme color.  
   - Header menu options should be spread out and not connected.  
   - Do not include broken links.  
   - Do not add any extra text before or after the HTML code.  

2. If the user input is **general text or greetings** (e.g., "Hi", "Hello", "How are you?") **or does not explicitly ask to generate code**, then:

   - Respond with a simple, friendly text message instead of generating any code.  

Example:

- User: "Hi" → Response: "Hello! How can I help you today?"  
- User: "Build a responsive landing page with Tailwind CSS" → Response: [Generate full HTML code as per instructions above]`


const playground = () => {
    const { projectId } = useParams();
    const params = useSearchParams();
    const frameId = params.get('frameId');
    const [frameDetails, setFrameDetails] = useState<Frame>();
    const [loading, setLoading] = useState<boolean>(false);
    const [messages,setMessages]=useState<Messages[]>([]);
    const [generatedCode,setGeneratedCode]=useState<any>();

    useEffect(() => {
        frameId && GetFrameDetails();
    }, [frameId]);

    const GetFrameDetails = async () => {
        try {
            // fetch frame details from database using projectId and frameId
            const result = await axios.get('/api/frames?frameId=' + frameId + '&projectId=' + projectId);
            console.log('Frame Details:', result.data);
            setFrameDetails(result.data);
            
            // Load existing messages from database
            if (result.data?.chatMessages && result.data.chatMessages.length > 0) {
                setMessages(result.data.chatMessages);
            }
            
            // Load existing code if available
            if (result.data?.designCode) {
                setGeneratedCode(result.data.designCode);
            }
            
            // Only send message if this is a new frame with exactly 1 user message and no AI response yet
            if (result.data?.chatMessages?.length === 1 && result.data.chatMessages[0].role === 'user') {
                const userMsg = result.data.chatMessages[0].content;
                // Pass true to skip adding user message again since it's already in the state
                SendMessage(userMsg, true);
            }
        } catch (error) {
            console.error('Error fetching frame details:', error);
        }
    }

    const SendMessage = async (userInput: string, skipAddingUserMessage: boolean = false) => {
        // Prevent multiple simultaneous calls
        if (loading) {
            console.log('Already processing a message, skipping...');
            return;
        }
        
        setLoading(true);
        
        // Add user message to messages only if not already added
        if (!skipAddingUserMessage) {
            setMessages((prevMessages: any) => [...prevMessages, {
                role: 'user',
                content: userInput
            }]);
        }

        try {
            console.log('Sending message to AI...');
            const result = await axios.post('/api/ai-chat', {
                messages: [{ role: 'user', content: Prompt?.replace('{userInput}', userInput) }],
                frameId: frameId,
                projectId: projectId
            });

            const aiResponse = result.data.message;
            console.log('AI Response received, length:', aiResponse.length);

            let updatedMessages: Messages[] = [];

            // Check if AI is sending code block
            if (aiResponse.includes('```html')) {
                const startIndex = aiResponse.indexOf('```html') + 7;
                const endIndex = aiResponse.indexOf('```', startIndex);
                const codeContent = aiResponse.slice(startIndex, endIndex).trim();
                
                console.log('Code extracted, setting generated code...');
                setGeneratedCode(codeContent);
                
                updatedMessages = [
                    ...messages,
                    { role: 'user', content: userInput },
                    { role: 'assistant', content: '[Code Generated]' }
                ];
                
                setMessages(updatedMessages);
            } else {
                console.log('Text response, adding to messages...');
                
                updatedMessages = [
                    ...messages,
                    { role: 'user', content: userInput },
                    { role: 'assistant', content: aiResponse }
                ];
                
                setMessages(updatedMessages);
            }

            // Save messages to database
            await axios.put('/api/chats', {
                frameId: frameId,
                projectId: projectId,
                messages: updatedMessages
            });
            console.log('Messages saved to database');

        } catch (error) {
            console.error('Error sending message:', error);
            setMessages((prevMessages: any) => [
                ...prevMessages, {
                    role: 'assistant',
                    content: 'Error: Failed to get response from AI'
                }
            ]);
        }

        setLoading(false);
    }

    useEffect(() => {
        console.log(generatedCode); 
    }, [generatedCode]);

  return (
    <div>
        <PlaygroundHeader />
        <div className='flex'>
            {/* chatSection */}
            <ChatSection messages={messages??[]}
            onSend={(input:string) => SendMessage(input)}
            loading={loading}
            />

            {/* WebsiteDesignSection */}
            <Design generatedCode={generatedCode} />

            {/* Settings Section */}
            {/* <Settings   /> */}
        </div>
        
    </div>
  )
}

export default playground