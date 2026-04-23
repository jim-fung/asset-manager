"use server";

import { db } from "@/db";
import { userUiPreferences } from "@/db/schema";
import { requireUserId } from "@/lib/auth-server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

function requireString(formData: FormData, key: string): string {
  const val = formData.get(key);
  if (typeof val !== "string") {
    throw new Error(`${key} must be a string`);
  }
  return val;
}

export async function getUserPreferences() {
  const userId = await requireUserId();
  const preferences = await db
    .select()
    .from(userUiPreferences)
    .where(eq(userUiPreferences.userId, userId));

  const prefMap: Record<string, string> = {};
  for (const pref of preferences) {
    prefMap[pref.preferenceKey] = pref.preferenceValue;
  }
  return prefMap;
}

export async function updateUserPreference(formData: FormData) {
  const userId = await requireUserId();
  const key = requireString(formData, "key");
  const value = requireString(formData, "value");

  await db
    .insert(userUiPreferences)
    .values({
      userId,
      preferenceKey: key,
      preferenceValue: value,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [userUiPreferences.userId, userUiPreferences.preferenceKey],
      set: {
        preferenceValue: value,
        updatedAt: new Date(),
      },
    });

  revalidatePath("/");
}
