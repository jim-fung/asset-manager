import { db } from "@/db";
import { userUiPreferences } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createAuthenticatedGetHandler } from "@/lib/api-utils";

export const GET = createAuthenticatedGetHandler(async (userId) => {
  const preferences = await db
    .select()
    .from(userUiPreferences)
    .where(eq(userUiPreferences.userId, userId));

  const prefMap: Record<string, string> = {};
  for (const pref of preferences) {
    prefMap[pref.preferenceKey] = pref.preferenceValue;
  }
  return prefMap;
}, "Error fetching preferences:");
