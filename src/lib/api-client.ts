"use client";

export class ApiError extends Error {
  constructor(
    public status: number,
    public data: Record<string, unknown>,
  ) {
    super(ApiError.describe(data) || `Request failed (${status})`);
  }

  static describe(data: Record<string, unknown>): string {
    if (typeof data.detail === "string") return data.detail;
    return Object.entries(data)
      .map(([k, v]) => `${k === "non_field_errors" ? "" : `${k}: `}${Array.isArray(v) ? v.join(" ") : String(v)}`)
      .join(" · ");
  }

  /** Per-field messages from a DRF validation error. */
  get fields(): Record<string, string> {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(this.data)) out[k] = Array.isArray(v) ? v.join(" ") : String(v);
    return out;
  }
}

type Options = { method?: string; json?: unknown; form?: FormData; query?: Record<string, string | number | undefined> };

/** Calls Django through the Next.js proxy at /api/backend. Paths look like "crm/leads" or "crm/leads/3". */
export async function api<T = unknown>(path: string, { method = "GET", json, form, query }: Options = {}): Promise<T> {
  const qs = query
    ? "?" +
      new URLSearchParams(
        Object.entries(query).filter(([, v]) => v !== undefined && v !== "") as [string, string][],
      ).toString()
    : "";
  const res = await fetch(`/api/backend/${path.replace(/^\/|\/$/g, "")}${qs}`, {
    method,
    headers: json !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: form ?? (json !== undefined ? JSON.stringify(json) : undefined),
  });
  if (res.status === 401) {
    // Full reload on purpose: drops all in-memory dashboard state with the dead session.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname)}`;
    throw new ApiError(401, { detail: "Session expired." });
  }
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data);
  return data as T;
}
