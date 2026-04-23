import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth-server";
import { db } from "@/db";
import { userUiPreferences } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const prefs = await db
    .select()
    .from(userUiPreferences)
    .where(eq(userUiPreferences.userId, userId));
  const migrated = prefs.some(
    (p) => p.preferenceKey === "migrated-local-storage" && p.preferenceValue === "true"
  );
  return NextResponse.json({ migrated });
}
