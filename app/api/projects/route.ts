import db from "@/config/db";
import { chatTable, framesTable, projectsTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const user = await currentUser();
        
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const userEmail = user.primaryEmailAddress?.emailAddress;
        
        if (!userEmail) {
            return NextResponse.json({ error: 'User email not found' }, { status: 400 });
        }

        console.log('[API /api/projects GET] Fetching projects for:', userEmail);

        // Get all projects for the current user
        const projects = await db
            .select()
            .from(projectsTable)
            .where(eq(projectsTable.createdBy, userEmail));

        console.log('[API /api/projects GET] Found projects:', projects.length);

        // For each project, get all its frames
        const projectsWithFrames = await Promise.all(
            projects.map(async (project) => {
                if (!project.projectId) {
                    console.log('[API /api/projects GET] Skipping project with null projectId');
                    return {
                        ...project,
                        frames: []
                    };
                }

                const frames = await db
                    .select()
                    .from(framesTable)
                    .where(eq(framesTable.projectId, project.projectId));

                return {
                    ...project,
                    frames: frames
                };
            })
        );

        return NextResponse.json({
            success: true,
            projects: projectsWithFrames
        });

    } catch (error) {
        console.error('[API /api/projects GET] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        );
    }
}

export async function POST(req:NextRequest){
    const {projectId,frameId,message}=await req.json();
    const user=await currentUser();
    //create project
    const projectResult=await db.insert(projectsTable).values({
        projectId:projectId,
        createdBy:user?.primaryEmailAddress?.emailAddress
    });
    //create frame
    const frameResult=await db.insert(framesTable).values({
        frameId:frameId,
        projectId:projectId
    });
    //save user message
    const chatResult=await db.insert(chatTable).values({
        chatMessage:message,
        projectId:projectId,
        frameId:frameId
    });

    return NextResponse.json({
        projectId,frameId,message
    })
}