import db from "@/config/db";
import { framesTable, projectsTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const user = await currentUser();
        
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { projectName } = await req.json();

        if (!projectName || !projectName.trim()) {
            return NextResponse.json(
                { error: 'Project name is required' },
                { status: 400 }
            );
        }

        // Generate unique IDs
        const projectId = Date.now().toString();
        const frameId = `frame_${Date.now()}`;

        // Create project
        await db.insert(projectsTable).values({
            projectId: projectId,
            projectName: projectName.trim(),
            createdBy: user.primaryEmailAddress?.emailAddress
        });

        // Create initial frame
        await db.insert(framesTable).values({
            frameId: frameId,
            projectId: projectId
        });

        return NextResponse.json({
            success: true,
            projectId,
            frameId,
            projectName: projectName.trim()
        });

    } catch (error) {
        console.error('[API /api/projects/create] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        );
    }
}
