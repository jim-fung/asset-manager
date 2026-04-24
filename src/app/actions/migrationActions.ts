"use server";

import { db } from "@/db";
import { userUiPreferences } from "@/db/schema";
import { requireUserId } from "@/lib/auth-server";
import { ensureUserInDb } from "@/lib/user-sync";
import { eq } from "drizzle-orm";
import { performMigration } from "@/lib/migrationCore";

export async function migrateLocalStorage(formData: FormData) {
  const userId = await requireUserId();
  await ensureUserInDb();
  const statusData = formData.get("statusData");
  const notesData = formData.get("notesData");
  return performMigration(userId, { statusData, notesData });
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
