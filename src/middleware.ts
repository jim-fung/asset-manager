import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server';

const authPaths = ["/login", "/signup"];
const apiPaths = ["/api/auth", "/api/user", "/api/actions"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".") ||
    pathname.startsWith("/previews")
  ) {
    return NextResponse.next();
  }

  if (authPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    const sessionToken =
      request.cookies.get("better-auth.session_token")?.value ??
      request.cookies.get("authjs.session-token")?.value;
    if (sessionToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (apiPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
