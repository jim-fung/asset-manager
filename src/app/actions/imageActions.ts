"use server";

import { db } from "@/db";
import { userImageStatuses, userImageNotes } from "@/db/schema";
import { requireUserId } from "@/lib/auth-server";
import type { ImageStatus } from "@/data/imageData";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const VALID_STATUSES: Set<string> = new Set(["approved", "review", "needs-replacement", "unset"]);

function requireString(formData: FormData, key: string): string {
  const val = formData.get(key);
  if (typeof val !== "string") {
    throw new Error(`${key} must be a string`);
  }
  return val;
}

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
  const imageId = requireString(formData, "imageId");
  const status = requireString(formData, "status");

  if (!VALID_STATUSES.has(status)) {
    throw new Error(`Invalid status value: ${status}`);
  }

  const typedStatus = status as ImageStatus;

  await db
    .insert(userImageStatuses)
    .values({
      userId,
      imageId,
      status: typedStatus,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [userImageStatuses.userId, userImageStatuses.imageId],
      set: {
        status: typedStatus,
        updatedAt: new Date(),
      },
    });

  revalidatePath("/");
  revalidatePath("/book/[chapterId]");
}

export async function updateImageNotes(formData: FormData) {
  const userId = await requireUserId();
  const imageId = requireString(formData, "imageId");
  const notes = formData.get("notes");

  if (typeof notes !== "string") {
    throw new Error("notes must be a string");
  }

  if (notes === "") {
    await db
      .delete(userImageNotes)
      .where(and(eq(userImageNotes.userId, userId), eq(userImageNotes.imageId, imageId)));
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
