import { NextResponse } from "next/server";
import { db } from "@/db";
import { userUiPreferences } from "@/db/schema";
import { getUserId } from "@/lib/auth-server";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const preferences = await db
      .select()
      .from(userUiPreferences)
      .where(eq(userUiPreferences.userId, userId));

    const prefMap: Record<string, string> = {};
    for (const pref of preferences) {
      prefMap[pref.preferenceKey] = pref.preferenceValue;
    }
    return NextResponse.json(prefMap);
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return NextResponse.json({}, { status: 500 });
  }
}
