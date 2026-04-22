"use server";

import { db } from "@/db";
import { userDigiAssignments } from "@/db/schema";
import { requireUserId } from "@/lib/auth-server";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getUserDigiAssignments() {
  const userId = await requireUserId();
  const assignments = await db
    .select()
    .from(userDigiAssignments)
    .where(eq(userDigiAssignments.userId, userId));

  const assignmentMap: Record<string, string> = {};
  for (const assignment of assignments) {
    assignmentMap[assignment.digiFileId] = assignment.chapterId;
  }
  return assignmentMap;
}

export async function assignDigiFileToChapter(formData: FormData) {
  const userId = await requireUserId();
  const digiFileId = formData.get("digiFileId") as string;
  const chapterId = formData.get("chapterId") as string;

  if (!digiFileId || !chapterId) {
    throw new Error("Missing required fields");
  }

  await db
    .insert(userDigiAssignments)
    .values({
      userId,
      digiFileId,
      chapterId,
      assignedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [userDigiAssignments.userId, userDigiAssignments.digiFileId],
      set: {
        chapterId,
        assignedAt: new Date(),
      },
    });

  revalidatePath("/");
  revalidatePath("/book/[chapterId]");
  revalidatePath("/digi-files");
  revalidatePath("/digi-files/[collectionId]");
}

export async function unassignDigiFile(formData: FormData) {
  const userId = await requireUserId();
  const digiFileId = formData.get("digiFileId") as string;

  if (!digiFileId) {
    throw new Error("Missing digiFileId");
  }

  await db
    .delete(userDigiAssignments)
    .where(
      and(
        eq(userDigiAssignments.userId, userId),
        eq(userDigiAssignments.digiFileId, digiFileId)
      )
    );

  revalidatePath("/");
  revalidatePath("/book/[chapterId]");
  revalidatePath("/digi-files");
  revalidatePath("/digi-files/[collectionId]");
}
