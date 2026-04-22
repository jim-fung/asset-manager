"use server";

import { db } from "@/db";
import { userImageStatuses, userImageNotes } from "@/db/schema";
import { requireUserId } from "@/lib/auth-server";
import type { ImageStatus } from "@/data/imageData";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getUserImageStatuses() {
  const userId = await requireUserId();
  const statuses = await db
    .select()
    .from(userImageStatuses)
    .where(eq(userImageStatuses.userId, userId));

  const statusMap: Record<string, ImageStatus> = {};
  for (const status of statuses) {
    statusMap[status.imageId] = status.status;
  }
  return statusMap;
}

export async function getUserImageNotes() {
  const userId = await requireUserId();
  const notes = await db
    .select()
    .from(userImageNotes)
    .where(eq(userImageNotes.userId, userId));

  const notesMap: Record<string, string> = {};
  for (const note of notes) {
    notesMap[note.imageId] = note.notes;
  }
  return notesMap;
}

export async function updateImageStatus(formData: FormData) {
  const userId = await requireUserId();
  const imageId = formData.get("imageId") as string;
  const status = formData.get("status") as ImageStatus;

  if (!imageId || !status) {
    throw new Error("Missing required fields");
  }

  await db
    .insert(userImageStatuses)
    .values({
      userId,
      imageId,
      status,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [userImageStatuses.userId, userImageStatuses.imageId],
      set: {
        status,
        updatedAt: new Date(),
      },
    });

  revalidatePath("/");
  revalidatePath("/book/[chapterId]");
}

export async function updateImageNotes(formData: FormData) {
  const userId = await requireUserId();
  const imageId = formData.get("imageId") as string;
  const notes = formData.get("notes") as string;

  if (!imageId || notes === null) {
    throw new Error("Missing required fields");
  }

  if (notes === "") {
    await db
      .delete(userImageNotes)
      .where(eq(userImageNotes.userId, userId));
  } else {
    await db
      .insert(userImageNotes)
      .values({
        userId,
        imageId,
        notes,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [userImageNotes.userId, userImageNotes.imageId],
        set: {
          notes,
          updatedAt: new Date(),
        },
      });
  }

  revalidatePath("/");
  revalidatePath("/book/[chapterId]");
}
