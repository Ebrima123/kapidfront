/** Django base URL used by server code (CMS reads, the admin proxy, auth). */
export const API_URL = (process.env.API_URL ?? "http://localhost:8000").replace(/\/$/, "");

/** Django base URL the browser posts the public quote form to. */
export const PUBLIC_API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

export const ACCESS_COOKIE = "kapid_access";
export const REFRESH_COOKIE = "kapid_refresh";
