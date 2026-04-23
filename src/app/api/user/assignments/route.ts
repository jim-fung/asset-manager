import { NextResponse } from "next/server";
import { db } from "@/db";
import { userDigiAssignments } from "@/db/schema";
import { getUserId } from "@/lib/auth-server";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({}, { status: 401 });
    }
    const assignments = await db
      .select()
      .from(userDigiAssignments)
      .where(eq(userDigiAssignments.userId, userId));

    const assignmentMap: Record<string, string> = {};
    for (const assignment of assignments) {
      assignmentMap[assignment.digiFileId] = assignment.chapterId;
    }
    return NextResponse.json(assignmentMap);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return NextResponse.json({}, { status: 500 });
  }
}
