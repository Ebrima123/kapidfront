/** Django base URL used by server code (CMS reads, the admin proxy, auth). */
export const API_URL = (process.env.API_URL ?? "http://localhost:8000").replace(/\/$/, "");

/** Django base URL the browser posts the public quote form to. */
export const PUBLIC_API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

/**
 * Public address of this site, for sitemaps and absolute share-preview links.
 * Set NEXT_PUBLIC_SITE_URL once there is a custom domain; Vercel's production URL is used until then.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "");

export const ACCESS_COOKIE = "kapid_access";
export const REFRESH_COOKIE = "kapid_refresh";
