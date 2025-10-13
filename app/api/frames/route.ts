import db from "@/config/db";
import { chatTable, framesTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const user = await currentUser();
        
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const frameId = searchParams.get('frameId');
        const projectId = searchParams.get('projectId');

        if (!frameId || !projectId) {
            return NextResponse.json(
                { error: 'frameId and projectId are required' },
                { status: 400 }
            );
        }

        const frameResult = await db
            .select()
            .from(framesTable)
            .where(eq(framesTable.frameId, frameId));

        if (!frameResult || frameResult.length === 0) {
            return NextResponse.json(
                { error: 'Frame not found' },
                { status: 404 }
            );
        }

        const chatResult = await db
            .select()
            .from(chatTable)
            .where(eq(chatTable.frameId, frameId));

        const finalResult = {
            ...frameResult[0],
            chatMessages: chatResult[0]?.chatMessage || []
        };

        return NextResponse.json(finalResult);

    } catch (error) {
        console.error('[API /api/frames] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        );
    }
}