"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { PUBLIC_API_URL } from "@/lib/config";

type Errors = Record<string, string>;

// Mirrors the Lead model limits in kapidback so problems show before submitting.
const MAX = { name: 120, email: 254, phone: 40, address: 255 } as const;

const FIELD_LABELS: Record<string, string> = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  property_type: "Property type",
  address: "Property location",
  service: "Service",
  preferred_date: "Preferred start date",
  message: "About the job",
};

const today = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local time

function validate(data: Record<string, string>): Errors {
  const e: Errors = {};
  if (!data.name?.trim()) e.name = "Enter your name.";
  if (!data.email?.trim()) e.email = "Enter your email address so we can reply.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
    e.email = "Enter an email address in the format name@example.com.";
  if (data.preferred_date && data.preferred_date < today()) e.preferred_date = "Choose today or a later date.";
  return e;
}

/** Turn a DRF error body ({field: [msg]}) into one message per field. */
function fromServer(body: unknown): Errors {
  const out: Errors = {};
  if (body && typeof body === "object") {
    for (const [k, v] of Object.entries(body)) {
      const msg = Array.isArray(v) ? v.join(" ") : String(v);
      if (k === "website") out.form = "We couldn't send your request. Please try again.";
      else if (k in FIELD_LABELS) out[k] = msg;
      else out.form = msg;
    }
  }
  return out;
}

function Label({ htmlFor, children, optional = false }: { htmlFor: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-semibold text-ink">
      <span>{children}</span>
      {optional ? (
        <span className="text-xs font-normal text-muted">Optional</span>
      ) : (
        <span className="text-xs font-normal text-accent-700">Required</span>
      )}
    </label>
  );
}

function Hint({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-1.5 text-sm text-muted">
      {children}
    </p>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-red-700">
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
      {message}
    </p>
  );
}

function Section({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-5 border-t border-line pt-6 first:border-0 first:pt-0">
      <legend className="float-left mb-5 flex w-full items-center gap-2.5 font-display text-lg font-semibold">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-700 font-sans text-sm text-white">
          {step}
        </span>
        {title}
      </legend>
      <div className="clear-both space-y-5">{children}</div>
    </fieldset>
  );
}

export function QuoteForm({ services, phone }: { services: string[]; phone?: string }) {
  const params = useSearchParams();
  const preset = params.get("service") ?? "";
  const presetType = params.get("type") === "commercial" ? "commercial" : "residential";

  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [sentTo, setSentTo] = useState<{ name: string; email: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const fieldErrors = Object.entries(errors).filter(([k]) => k !== "form");
  const callUs = phone ? ` or call us on ${phone}` : "";

  /** ARIA wiring for an input: invalid state plus hint and error descriptions. */
  const a11y = (name: string, hint = false) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": [hint && `${name}-hint`, errors[name] && `${name}-error`].filter(Boolean).join(" ") || undefined,
  });

  const clearError = (name: string) =>
    setErrors((e) => {
      if (!e[name]) return e;
      const next = { ...e };
      delete next[name];
      return next;
    });

  function showErrors(next: Errors) {
    setErrors(next);
    // Wait for the summary to render, then move focus to it so screen readers announce it.
    requestAnimationFrame(() => summaryRef.current?.focus());
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;

    const problems = validate(data);
    if (Object.keys(problems).length) return showErrors(problems);

    // Same payload as before: trimmed text, and no preferred_date when left blank.
    for (const k of ["name", "email", "phone", "address", "message"]) if (data[k]) data[k] = data[k].trim();
    if (!data.preferred_date) delete data.preferred_date;

    setState("sending");
    setErrors({});
    try {
      const res = await fetch(`${PUBLIC_API_URL}/api/public/quote-request/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSentTo({ name: data.name.split(" ")[0], email: data.email });
        setState("sent");
        requestAnimationFrame(() => document.getElementById("quote-success")?.focus());
        return;
      }
      setState("idle");
      if (res.status === 429) {
        return showErrors({ form: `We've received several requests from you recently. Please try again later${callUs}.` });
      }
      const body = await res.json().catch(() => null);
      const server = fromServer(body);
      showErrors(Object.keys(server).length ? server : { form: `Something went wrong on our side. Please try again${callUs}.` });
    } catch {
      setState("idle");
      showErrors({
        form: `We couldn't send your request. Check your internet connection and try again${callUs}. Your answers are still here.`,
      });
    }
  }

  if (state === "sent" && sentTo) {
    return (
      <div className="py-6 text-center sm:py-10" role="status">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-700">
          <CheckCircle2 className="size-8" aria-hidden />
        </span>
        <h2 id="quote-success" tabIndex={-1} className="mt-5 font-display text-2xl font-semibold outline-none">
          Thanks, {sentTo.name}. Your request has been sent.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted">
          We&apos;ll review the details and get back to you with a free, itemised quote. We&apos;ll reply to{" "}
          <span className="font-semibold text-ink">{sentTo.email}</span>
          {phone ? <> or you can call us on {phone}</> : null}.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/projects" className="btn btn-outline">
            See our work <ArrowRight className="size-4" aria-hidden />
          </Link>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setSentTo(null);
              setState("idle");
            }}
          >
            Send another request
          </button>
        </div>
      </div>
    );
  }

  const sending = state === "sending";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-busy={sending} aria-describedby="form-intro">
      <p id="form-intro" className="mb-6 text-sm text-muted">
        It takes about two minutes. Only your name and email are required; the more you tell us about the job, the
        more accurate your quote.
      </p>

      {(errors.form || fieldErrors.length > 0) && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 outline-none focus-visible:ring-2 focus-visible:ring-red-300"
        >
          <p className="flex items-center gap-2 font-semibold">
            <AlertCircle className="size-4 shrink-0" aria-hidden />
            {fieldErrors.length > 0
              ? `Please check ${fieldErrors.length === 1 ? "1 answer" : `${fieldErrors.length} answers`}`
              : "Your request wasn't sent"}
          </p>
          {errors.form && <p className="mt-1">{errors.form}</p>}
          {fieldErrors.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {fieldErrors.map(([k, msg]) => (
                <li key={k}>
                  <a href={`#${k === "property_type" ? "property_type-residential" : k}`} className="underline underline-offset-2">
                    {FIELD_LABELS[k]}: {msg}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <fieldset disabled={sending} className="space-y-8">
        <Section step={1} title="Your contact details">
          <div>
            <Label htmlFor="name">Name</Label>
            <input
              id="name"
              name="name"
              className="input"
              autoComplete="name"
              autoCapitalize="words"
              enterKeyHint="next"
              maxLength={MAX.name}
              aria-required
              onChange={() => clearError("name")}
              {...a11y("name")}
            />
            <FieldError id="name-error" message={errors.name} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="email">Email</Label>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                className="input"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                enterKeyHint="next"
                maxLength={MAX.email}
                aria-required
                onChange={() => clearError("email")}
                {...a11y("email", true)}
              />
              <Hint id="email-hint">So we can reply to your request.</Hint>
              <FieldError id="email-error" message={errors.email} />
            </div>
            <div>
              <Label htmlFor="phone" optional>
                Phone
              </Label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                className="input"
                autoComplete="tel"
                enterKeyHint="next"
                maxLength={MAX.phone}
                onChange={() => clearError("phone")}
                {...a11y("phone", true)}
              />
              <Hint id="phone-hint">If you&apos;d also like us to call you.</Hint>
              <FieldError id="phone-error" message={errors.phone} />
            </div>
          </div>
        </Section>

        <Section step={2} title="The property">
          <div role="radiogroup" aria-labelledby="property_type-label" {...a11y("property_type")}>
            <p id="property_type-label" className="mb-1.5 flex items-baseline justify-between text-sm font-semibold">
              <span>Type of property</span>
              <span className="text-xs font-normal text-accent-700">Required</span>
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "residential", label: "Home", hint: "House or apartment" },
                { value: "commercial", label: "Business", hint: "Office, shop or premises" },
              ].map((o) => (
                <label
                  key={o.value}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-white p-3.5 transition-colors has-[:checked]:border-brand-700 has-[:checked]:bg-brand-50 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-500"
                >
                  <input
                    type="radio"
                    id={`property_type-${o.value}`}
                    name="property_type"
                    value={o.value}
                    defaultChecked={presetType === o.value}
                    className="mt-1 size-4 accent-brand-700 focus:outline-none"
                    onChange={() => clearError("property_type")}
                  />
                  <span>
                    <span className="block font-semibold">{o.label}</span>
                    <span className="block text-xs text-muted">{o.hint}</span>
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-1.5 text-sm text-muted">New build? Choose the type it will be used as.</p>
            <FieldError id="property_type-error" message={errors.property_type} />
          </div>
          <div>
            <Label htmlFor="address" optional>
              Location
            </Label>
            <input
              id="address"
              name="address"
              className="input"
              autoComplete="street-address"
              enterKeyHint="next"
              maxLength={MAX.address}
              onChange={() => clearError("address")}
              {...a11y("address", true)}
            />
            <Hint id="address-hint">Town or area is enough for now.</Hint>
            <FieldError id="address-error" message={errors.address} />
          </div>
        </Section>

        <Section step={3} title="The job">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="service" optional>
                Service
              </Label>
              <select
                id="service"
                name="service"
                className="input"
                defaultValue={preset}
                onChange={() => clearError("service")}
                {...a11y("service")}
              >
                <option value="">Not sure yet</option>
                {services.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <FieldError id="service-error" message={errors.service} />
            </div>
            <div>
              <Label htmlFor="preferred_date" optional>
                Preferred start date
              </Label>
              <input
                id="preferred_date"
                name="preferred_date"
                type="date"
                min={today()}
                className="input"
                onChange={() => clearError("preferred_date")}
                {...a11y("preferred_date", true)}
              />
              <Hint id="preferred_date-hint">Leave blank if you&apos;re flexible.</Hint>
              <FieldError id="preferred_date-error" message={errors.preferred_date} />
            </div>
          </div>
          <div>
            <Label htmlFor="message" optional>
              About the job
            </Label>
            <div id="message-hint" className="mb-2 text-sm text-muted">
              <p>Helpful things to mention:</p>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {["Rooms or areas", "Inside, outside or both", "Rough size", "Current condition", "Colours or finish"].map(
                  (t) => (
                    <li key={t} className="rounded-full bg-sand px-2.5 py-0.5 text-xs text-ink/80">
                      {t}
                    </li>
                  ),
                )}
              </ul>
            </div>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="input"
              placeholder="e.g. 3-bedroom house: living room, kitchen and 2 bedrooms, walls and ceilings. A few cracks to fill. Thinking of light grey."
              onChange={() => clearError("message")}
              {...a11y("message", true)}
            />
            <FieldError id="message-error" message={errors.message} />
          </div>
        </Section>

        {/* Honeypot for bots; hidden from people and screen readers */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      </fieldset>

      <div className="mt-8 border-t border-line pt-6">
        <button type="submit" className="btn btn-primary btn-lg w-full px-4 whitespace-nowrap sm:w-auto sm:px-6" disabled={sending}>
          {sending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden /> Sending your request…
            </>
          ) : (
            <>
              Send my quote request <ArrowRight className="size-4" aria-hidden />
            </>
          )}
        </button>
        <p className="mt-3 text-sm text-muted">
          The quote is free. We&apos;ll review your details and get back to you with an itemised quote.
        </p>
        <p className="sr-only" aria-live="polite">
          {sending ? "Sending your request" : ""}
        </p>
      </div>
    </form>
  );
}
