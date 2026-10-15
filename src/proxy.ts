import { NextResponse, type NextRequest } from "next/server";
import { REFRESH_COOKIE } from "@/lib/config";

/**
 * Optimistic gate for the dashboard: bounce visitors without a session cookie
 * to the login page. Real authorization happens in Django on every API call.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(REFRESH_COOKIE);
  const isLogin = pathname === "/admin/login";

  if (!hasSession && !isLogin) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  if (hasSession && isLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
