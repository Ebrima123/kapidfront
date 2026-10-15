"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ErrorBox } from "@/components/admin/ui";

export function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get("next");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
    });
    if (res.ok) {
      // Only follow same-site dashboard paths to avoid open redirects.
      router.replace(next?.startsWith("/admin") ? next : "/admin");
      router.refresh();
      return;
    }
    const body = await res.json().catch(() => ({}));
    setError(body.detail ?? "Sign in failed.");
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label" htmlFor="username">Username</label>
        <input id="username" name="username" className="input" autoComplete="username" required autoFocus />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" className="input" autoComplete="current-password" required />
      </div>
      {error && <ErrorBox message={error} />}
      <button className="btn btn-dark w-full" disabled={loading}>
        {loading && <Loader2 className="size-4 animate-spin" />}
        Sign in
      </button>
    </form>
  );
}
