import db from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// Add a simple GET endpoint to verify the route exists
export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'API route is working' });
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const userEmail = user?.primaryEmailAddress?.emailAddress ?? '';
    
    // Check if user already exists
    const userResult = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, userEmail));

    // If not, create new user
    if (userResult?.length === 0) {
      const data = {
        name: user?.fullName ?? 'NA',
        email: userEmail,
        credits: 5
      };
      
      const newUser = await db
        .insert(usersTable)
        .values(data)
        .returning();
        
      return NextResponse.json({ user: newUser[0] });
    }
    
    return NextResponse.json({ user: userResult[0] });
    
  } catch (error) {
    console.error('[API /api/users] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}