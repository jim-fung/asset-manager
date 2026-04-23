import { db } from "@/db";
import { userImageStatuses, userImageNotes, userUiPreferences } from "@/db/schema";
import { sql } from "drizzle-orm";
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

export interface MigrationInput {
  statusData?: FormDataEntryValue | null;
  notesData?: FormDataEntryValue | null;
}

export async function performMigration(
  userId: string,
  input: MigrationInput,
): Promise<{ success: boolean; message: string }> {
  const { statusData, notesData } = input;

  if (statusData !== null && statusData !== undefined && typeof statusData !== "string") {
    throw new Error("statusData must be a string");
  }
  if (notesData !== null && notesData !== undefined && typeof notesData !== "string") {
    throw new Error("notesData must be a string");
  }

  if (!statusData && !notesData) {
    return { success: false, message: "No data to migrate" };
  }

  try {
    await db.transaction(async (tx) => {
      if (statusData) {
        const statuses = validateStatusMap(JSON.parse(statusData));
        const now = new Date();
        await tx
          .insert(userImageStatuses)
          .values(
            Object.entries(statuses).map(([imageId, status]) => ({
              userId,
              imageId,
              status,
              updatedAt: now,
            })),
          )
          .onConflictDoUpdate({
            target: [userImageStatuses.userId, userImageStatuses.imageId],
            set: {
              status: sql`excluded.status`,
              updatedAt: now,
            },
          });
      }

      if (notesData) {
        const notes = validateNotesMap(JSON.parse(notesData));
        const nonEmptyNotes = Object.entries(notes).filter(([, v]) => v);
        if (nonEmptyNotes.length > 0) {
          const now = new Date();
          await tx
            .insert(userImageNotes)
            .values(
              nonEmptyNotes.map(([imageId, notesValue]) => ({
                userId,
                imageId,
                notes: notesValue,
                updatedAt: now,
              })),
            )
            .onConflictDoUpdate({
              target: [userImageNotes.userId, userImageNotes.imageId],
              set: {
                notes: sql`excluded.notes`,
                updatedAt: now,
              },
            });
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
