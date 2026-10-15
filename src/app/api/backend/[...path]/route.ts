import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { clearAuthCookies, setAccessCookie } from "@/lib/auth-cookies";
import { CMS_TAG } from "@/lib/cms";
import { ACCESS_COOKIE, API_URL, REFRESH_COOKIE } from "@/lib/config";

/**
 * Forwards dashboard requests to Django with the JWT from httpOnly cookies,
 * so tokens never reach browser JavaScript. Refreshes an expired access token once.
 */
async function handler(request: NextRequest, ctx: RouteContext<"/api/backend/[...path]">) {
  const { path } = await ctx.params;
  if (path.some((p) => p === ".." || p === ".")) {
    return NextResponse.json({ detail: "Invalid path." }, { status: 400 });
  }
  const target = `${API_URL}/api/${path.map(encodeURIComponent).join("/")}/${request.nextUrl.search}`;
  const body = ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer();

  const send = (token: string | undefined) => {
    const headers = new Headers();
    const contentType = request.headers.get("content-type");
    if (contentType) headers.set("content-type", contentType);
    headers.set("accept", "application/json");
    if (token) headers.set("authorization", `Bearer ${token}`);
    return fetch(target, { method: request.method, headers, body, cache: "no-store" });
  };

  let newAccess: string | undefined;
  let upstream: Response;
  try {
    upstream = await send(request.cookies.get(ACCESS_COOKIE)?.value);
    const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
    if (upstream.status === 401 && refresh) {
      const r = await fetch(`${API_URL}/api/auth/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
      if (r.ok) {
        newAccess = (await r.json()).access as string;
        upstream = await send(newAccess);
      }
    }
  } catch {
    return NextResponse.json({ detail: "The API server is unavailable." }, { status: 502 });
  }

  if (upstream.ok && request.method !== "GET" && path[0] === "cms") {
    // Content changed: make the public site show it on the next request.
    revalidateTag(CMS_TAG, { expire: 0 });
  }

  const res = new NextResponse(upstream.status === 204 ? null : await upstream.arrayBuffer(), {
    status: upstream.status,
    headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" },
  });
  if (newAccess) setAccessCookie(res, newAccess);
  if (upstream.status === 401) clearAuthCookies(res);
  return res;
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };
