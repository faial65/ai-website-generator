import db from "@/config/db";
import { chatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const user = await currentUser();
        
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const body = await req.json();
        const { frameId, projectId, messages } = body;

        if (!frameId || !projectId || !messages) {
            return NextResponse.json(
                { error: 'frameId, projectId, and messages are required' },
                { status: 400 }
            );
        }

        console.log('[API /api/chats] Updating chat messages for frameId:', frameId);

        // Check if chat entry exists for this frame
        const existingChat = await db
            .select()
            .from(chatTable)
            .where(eq(chatTable.frameId, frameId));

        if (existingChat && existingChat.length > 0) {
            // Update existing chat
            await db
                .update(chatTable)
                .set({
                    chatMessage: messages
                })
                .where(eq(chatTable.frameId, frameId));
                
            console.log('[API /api/chats] Updated existing chat');
        } else {
            // Insert new chat entry
            await db
                .insert(chatTable)
                .values({
                    frameId,
                    projectId,
                    chatMessage: messages
                });
                
            console.log('[API /api/chats] Created new chat entry');
        }

        return NextResponse.json({
            success: true,
            message: 'Chat messages updated successfully'
        });

    } catch (error) {
        console.error('[API /api/chats] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        );
    }
}
