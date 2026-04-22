import { NextResponse } from "next/server";
import { db } from "@/db";
import { userDigiAssignments } from "@/db/schema";
import { requireUserId } from "@/lib/auth-server";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const userId = await requireUserId();
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
    if (error instanceof Error && error.message === "No session found") {
      return NextResponse.json({}, { status: 401 });
    }
    console.error("Error fetching assignments:", error);
    return NextResponse.json({}, { status: 500 });
  }
}
