"use server";

import { db } from "@/db";
import { userImageStatuses, userImageNotes, userUiPreferences } from "@/db/schema";
import { requireUserId } from "@/lib/auth-server";
import { eq } from "drizzle-orm";
import type { ImageStatus } from "@/data/imageData";

export async function migrateLocalStorage(formData: FormData) {
  const userId = await requireUserId();
  const statusData = formData.get("statusData") as string;
  const notesData = formData.get("notesData") as string;

  if (!statusData && !notesData) {
    return { success: false, message: "No data to migrate" };
  }

  try {
    if (statusData) {
      const statuses: Record<string, ImageStatus> = JSON.parse(statusData);
      for (const [imageId, status] of Object.entries(statuses)) {
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
      }
    }

    if (notesData) {
      const notes: Record<string, string> = JSON.parse(notesData);
      for (const [imageId, notesValue] of Object.entries(notes)) {
        if (notesValue) {
          await db
            .insert(userImageNotes)
            .values({
              userId,
              imageId,
              notes: notesValue,
              updatedAt: new Date(),
            })
            .onConflictDoUpdate({
              target: [userImageNotes.userId, userImageNotes.imageId],
              set: {
                notes: notesValue,
                updatedAt: new Date(),
              },
            });
        }
      }
    }

    await db
      .insert(userUiPreferences)
      .values({
        userId,
        preferenceKey: "migrated-local-storage",
        preferenceValue: "true",
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [userUiPreferences.userId, userUiPreferences.preferenceKey],
        set: {
          preferenceValue: "true",
          updatedAt: new Date(),
        },
      });

    return { success: true, message: "Migration successful" };
  } catch (error) {
    console.error("Migration failed:", error);
    return { success: false, message: "Migration failed" };
  }
}

export async function hasMigratedLocalStorage() {
  try {
    const userId = await requireUserId();
    const prefs = await db
      .select()
      .from(userUiPreferences)
      .where(eq(userUiPreferences.userId, userId));

    return prefs.some((p) => p.preferenceKey === "migrated-local-storage" && p.preferenceValue === "true");
  } catch (error) {
    console.error("Failed to check migration status:", error);
    return false;
  }
}
