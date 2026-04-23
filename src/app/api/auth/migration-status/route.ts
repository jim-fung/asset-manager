import { NextResponse } from "next/server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hasMigratedLocalStorage } from "@/app/actions/migrationActions";

export async function GET() {
  try {
    const migrated = await hasMigratedLocalStorage();
    return NextResponse.json({ migrated });
  } catch (error) {
    if (isRedirectError(error)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error checking migration status:", error);
    return NextResponse.json({ migrated: false });
  }
}
