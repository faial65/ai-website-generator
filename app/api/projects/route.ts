import db from "@/config/db";
import { chatTable, framesTable, projectsTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

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