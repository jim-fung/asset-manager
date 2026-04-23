import { NextResponse } from "next/server";
import { db } from "@/db";
import { userImageStatuses } from "@/db/schema";
import { getUserId } from "@/lib/auth-server";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const statuses = await db
      .select()
      .from(userImageStatuses)
      .where(eq(userImageStatuses.userId, userId));

    const statusMap: Record<string, string> = {};
    for (const status of statuses) {
      statusMap[status.imageId] = status.status;
    }
    return NextResponse.json(statusMap);
  } catch (error) {
    console.error("Error fetching statuses:", error);
    return NextResponse.json({}, { status: 500 });
  }
}
