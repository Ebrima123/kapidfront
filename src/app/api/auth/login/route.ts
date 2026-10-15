import { NextResponse } from "next/server";
import { setAccessCookie, setRefreshCookie } from "@/lib/auth-cookies";
import { API_URL } from "@/lib/config";

export async function POST(request: Request) {
  const { username, password } = await request.json().catch(() => ({}));
  if (!username || !password) {
    return NextResponse.json({ detail: "Username and password are required." }, { status: 400 });
  }

  let tokenRes: Response;
  try {
    tokenRes = await fetch(`${API_URL}/api/auth/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  } catch {
    return NextResponse.json({ detail: "The server is unavailable. Try again shortly." }, { status: 502 });
  }
  if (!tokenRes.ok) {
    return NextResponse.json({ detail: "Invalid username or password." }, { status: 401 });
  }
  const { access, refresh } = await tokenRes.json();

  // Only staff may use the dashboard; Django enforces this on every endpoint too.
  const me = await fetch(`${API_URL}/api/auth/me/`, { headers: { Authorization: `Bearer ${access}` } });
  if (!me.ok) {
    return NextResponse.json({ detail: "This account does not have dashboard access." }, { status: 403 });
  }

  const res = NextResponse.json(await me.json());
  setAccessCookie(res, access);
  setRefreshCookie(res, refresh);
  return res;
}
