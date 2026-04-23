import { NextResponse } from "next/server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { migrateLocalStorage } from "@/app/actions/migrationActions";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const result = await migrateLocalStorage(formData);
    return NextResponse.json(result);
  } catch (error) {
    if (isRedirectError(error)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Migration error:", error);
    return NextResponse.json({ success: false, message: "Migration failed" }, { status: 500 });
  }
}
