export const maxDuration = 60;

import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const groq = new OpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY
});

export async function POST(req: NextRequest) {
    try {
        // Check if API key is configured
        if (!process.env.GROQ_API_KEY) {
            return NextResponse.json({
                success: false,
                message: "Groq API key not configured"
            }, { status: 500 });
        }

        const user = await currentUser();

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized"
            }, { status: 401 });
        }

        // Extract data from request body
        const { messages, frameId, projectId } = await req.json();

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json({
                success: false,
                message: "Messages array is required"
            }, { status: 400 });
        }

        console.log("Groq API: Processing", messages.length, "messages");

        // System prompt for website design generation
        const systemPrompt = {
            role: "system",
            content: `You are an expert web designer and developer. Your task is to generate clean, modern, and responsive HTML/CSS/JavaScript code based on user requirements.

When the user asks for a website design or component:
- Generate complete, working HTML code with inline CSS and JavaScript if needed
- Use modern design practices and responsive layouts
- Include Tailwind CSS classes if appropriate
- Make it visually appealing and user-friendly
- Wrap the code in a code block with proper formatting

When the user makes casual conversation (like "hi", "hello", "thanks"):
- Respond naturally and helpfully
- Ask how you can help with their website design

Always be concise, helpful, and focused on creating great web designs.`
        };

        // Prepare messages for Groq
        const apiMessages = [
            systemPrompt,
            ...messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }))
        ];

        console.log("Groq API: Calling Groq API with model llama-3.3-70b-versatile...");

        // Call Groq API
        const completion = await groq.chat.completions.create({
            messages: apiMessages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 2048
        });

        const assistantMessage = completion.choices[0].message;
        console.log("Groq API: Received response, length:", assistantMessage.content?.length ?? 0);

        return NextResponse.json({
            success: true,
            message: assistantMessage.content ?? "",
            frameId,
            projectId
        });

    } catch (error) {
        console.error("Groq API Error:", error);
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error"
        }, { status: 500 });
    }
}
