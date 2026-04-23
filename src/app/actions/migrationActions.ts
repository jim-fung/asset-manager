"use server";

import { db } from "@/db";
import { userImageStatuses, userImageNotes, userUiPreferences } from "@/db/schema";
import { requireUserId } from "@/lib/auth-server";
import { eq } from "drizzle-orm";
import type { ImageStatus } from "@/data/imageData";

const VALID_STATUSES: Set<string> = new Set(["approved", "review", "needs-replacement", "unset"]);

function validateStatusMap(raw: unknown): Record<string, ImageStatus> {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new Error("Invalid statusData: expected a JSON object");
  }
  for (const [key, val] of Object.entries(raw)) {
    if (typeof key !== "string" || !VALID_STATUSES.has(val as string)) {
      throw new Error(`Invalid status value for key "${key}": ${val}`);
    }
  }
  return raw as Record<string, ImageStatus>;
}

function validateNotesMap(raw: unknown): Record<string, string> {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new Error("Invalid notesData: expected a JSON object");
  }
  for (const [key, val] of Object.entries(raw)) {
    if (typeof key !== "string" || typeof val !== "string") {
      throw new Error(`Invalid notes value for key "${key}"`);
    }
  }
  return raw as Record<string, string>;
}

export async function migrateLocalStorage(formData: FormData) {
  const userId = await requireUserId();
  const statusData = formData.get("statusData");
  const notesData = formData.get("notesData");

  if (statusData !== null && typeof statusData !== "string") {
    throw new Error("statusData must be a string");
  }
  if (notesData !== null && typeof notesData !== "string") {
    throw new Error("notesData must be a string");
  }

  if (!statusData && !notesData) {
    return { success: false, message: "No data to migrate" };
  }

  try {
    await db.transaction(async (tx) => {
      if (statusData) {
        const statuses = validateStatusMap(JSON.parse(statusData));
        for (const [imageId, status] of Object.entries(statuses)) {
          await tx
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
        const notes = validateNotesMap(JSON.parse(notesData));
        for (const [imageId, notesValue] of Object.entries(notes)) {
          if (notesValue) {
            await tx
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

      await tx
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
