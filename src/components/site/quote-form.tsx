"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { PUBLIC_API_URL } from "@/lib/config";

type Errors = Record<string, string[]>;

export function QuoteForm({ services }: { services: string[] }) {
  const preset = useSearchParams().get("service") ?? "";
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<Errors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setErrors({});
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (!data.preferred_date) delete data.preferred_date;
    try {
      const res = await fetch(`${PUBLIC_API_URL}/api/public/quote-request/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setState("sent");
        return;
      }
      const body = await res.json().catch(() => ({}));
      setErrors(
        res.status === 429
          ? { form: ["Too many requests. Please try again later or give us a call."] }
          : (body as Errors),
      );
    } catch {
      setErrors({ form: ["We couldn't send your request. Please try again or call us."] });
    }
    setState("idle");
  }

  if (state === "sent") {
    return (
      <div className="py-10 text-center">
        <CheckCircle2 className="mx-auto size-12 text-accent-500" />
        <h2 className="mt-4 font-display text-2xl font-semibold">Thanks, we&apos;ve got it!</h2>
        <p className="mt-2 text-muted">We&apos;ll be in touch shortly to arrange your free quote.</p>
      </div>
    );
  }

  const err = (name: string) =>
    errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name].join(" ")}</p>;

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <div>
        <label className="label" htmlFor="name">Name *</label>
        <input id="name" name="name" required className="input" autoComplete="name" />
        {err("name")}
      </div>
      <div>
        <label className="label" htmlFor="email">Email *</label>
        <input id="email" name="email" type="email" required className="input" autoComplete="email" />
        {err("email")}
      </div>
      <div>
        <label className="label" htmlFor="phone">Phone</label>
        <input id="phone" name="phone" className="input" autoComplete="tel" />
      </div>
      <div>
        <label className="label" htmlFor="property_type">Property</label>
        <select id="property_type" name="property_type" className="input" defaultValue="residential">
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
        </select>
      </div>
      <div>
        <label className="label" htmlFor="service">Service</label>
        <select id="service" name="service" className="input" defaultValue={preset}>
          <option value="">Not sure yet</option>
          {services.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="preferred_date">Preferred start</label>
        <input id="preferred_date" name="preferred_date" type="date" className="input" />
        {err("preferred_date")}
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="address">Property address</label>
        <input id="address" name="address" className="input" autoComplete="street-address" />
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="message">About the job</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className="input"
          placeholder="Rooms or areas, current condition, colours you have in mind…"
        />
      </div>
      {/* Honeypot for bots; hidden from people and screen readers */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {errors.form && <p className="text-sm text-red-600 sm:col-span-2">{errors.form.join(" ")}</p>}
      <div className="sm:col-span-2">
        <button className="btn btn-primary w-full sm:w-auto" disabled={state === "sending"}>
          {state === "sending" && <Loader2 className="size-4 animate-spin" />}
          Request my free quote
        </button>
      </div>
    </form>
  );
}
