import { db } from "@/db";
import { userImageNotes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createAuthenticatedGetHandler } from "@/lib/api-utils";

export const GET = createAuthenticatedGetHandler(async (userId) => {
  const notes = await db
    .select()
    .from(userImageNotes)
    .where(eq(userImageNotes.userId, userId));

  const notesMap: Record<string, string> = {};
  for (const note of notes) {
    notesMap[note.imageId] = note.notes;
  }
  return notesMap;
}, "Error fetching notes:");
