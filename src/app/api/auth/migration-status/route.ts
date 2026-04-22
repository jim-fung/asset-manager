import { NextResponse } from "next/server";
import { hasMigratedLocalStorage } from "@/app/actions/migrationActions";

export async function GET() {
  try {
    const migrated = await hasMigratedLocalStorage();
    return NextResponse.json({ migrated });
  } catch (error) {
    console.error("Error checking migration status:", error);
    return NextResponse.json({ migrated: false });
  }
}
