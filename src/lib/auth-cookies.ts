import "server-only";
import type { NextResponse } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "./config";

const base = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

// Lifetimes mirror SIMPLE_JWT in the Django settings.
export function setAccessCookie(res: NextResponse, token: string) {
  res.cookies.set(ACCESS_COOKIE, token, { ...base, maxAge: 60 * 30 });
}

export function setRefreshCookie(res: NextResponse, token: string) {
  res.cookies.set(REFRESH_COOKIE, token, { ...base, maxAge: 60 * 60 * 24 * 7 });
}

export function clearAuthCookies(res: NextResponse) {
  res.cookies.set(ACCESS_COOKIE, "", { ...base, maxAge: 0 });
  res.cookies.set(REFRESH_COOKIE, "", { ...base, maxAge: 0 });
}
