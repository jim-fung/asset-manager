import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth-server";
import { performMigration } from "@/lib/migrationCore";

export async function POST(request: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const statusData = formData.get("statusData");
    const notesData = formData.get("notesData");
    const result = await performMigration(userId, { statusData, notesData });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({ success: false, message: "Migration failed" }, { status: 500 });
  }
}
