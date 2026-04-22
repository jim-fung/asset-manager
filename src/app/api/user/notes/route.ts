import { NextResponse } from "next/server";
import { db } from "@/db";
import { userImageNotes } from "@/db/schema";
import { requireUserId } from "@/lib/auth-server";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const userId = await requireUserId();
    const notes = await db
      .select()
      .from(userImageNotes)
      .where(eq(userImageNotes.userId, userId));

    const notesMap: Record<string, string> = {};
    for (const note of notes) {
      notesMap[note.imageId] = note.notes;
    }
    return NextResponse.json(notesMap);
  } catch (error) {
    if (error instanceof Error && error.message === "No session found") {
      return NextResponse.json({}, { status: 401 });
    }
    console.error("Error fetching notes:", error);
    return NextResponse.json({}, { status: 500 });
  }
}
