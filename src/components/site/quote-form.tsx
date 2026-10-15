"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, Check, CheckCircle2, Loader2 } from "lucide-react";
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

/** Easiest questions first; contact details last. All fields stay mounted so one POST sends everything. */
const STEPS = [
  { title: "The job", fields: ["service", "preferred_date", "message"] },
  { title: "The property", fields: ["property_type", "address"] },
  { title: "Your details", fields: ["name", "email", "phone"] },
] as const;

const stepOf = (field: string) => STEPS.findIndex((s) => (s.fields as readonly string[]).includes(field));

const today = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local time

/** Client checks for the given step (or every step when omitted). */
function validate(data: Record<string, string>, step?: number): Errors {
  const e: Errors = {};
  const check = (s: number) => step === undefined || step === s;
  if (check(0) && data.preferred_date && data.preferred_date < today()) e.preferred_date = "Choose today or a later date.";
  if (check(2)) {
    if (!data.name?.trim()) e.name = "Enter your name.";
    if (!data.email?.trim()) e.email = "Enter your email address so we can reply.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
      e.email = "Enter an email address in the format name@example.com.";
  }
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

/** First step that has an error, or the current step if only form-level errors exist. */
function firstErrorStep(errors: Errors, current: number) {
  const steps = Object.keys(errors)
    .map(stepOf)
    .filter((s) => s >= 0);
  return steps.length ? Math.min(...steps) : current;
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

/** Step indicator: completed steps can be revisited; later steps unlock as you go. */
function Progress({
  current,
  furthest,
  onSelect,
}: {
  current: number;
  furthest: number;
  onSelect: (step: number) => void;
}) {
  return (
    <nav aria-label="Quote form progress" className="mb-8">
      <p className="text-sm text-muted">
        Step {current + 1} of {STEPS.length}
      </p>
      <ol className="mt-3 grid grid-cols-3 gap-2">
        {STEPS.map((s, i) => {
          const done = i < current;
          const active = i === current;
          const reachable = i <= furthest && !active;
          const bar = active || done ? "bg-accent-600" : "bg-line";
          const content = (
            <>
              <span className={`block h-1 rounded-full ${bar}`} aria-hidden />
              <span className={`mt-2 flex items-center gap-1.5 text-left text-xs font-semibold sm:text-sm ${active ? "text-brand-900" : "text-muted"}`}>
                {done && <Check className="size-3.5 shrink-0 text-accent-600" aria-hidden />}
                <span>{s.title}</span>
                {done && <span className="sr-only">(completed)</span>}
              </span>
            </>
          );
          return (
            <li key={s.title} aria-current={active ? "step" : undefined}>
              {reachable ? (
                <button type="button" onClick={() => onSelect(i)} className="block w-full rounded-[3px] py-1 hover:[&>span:last-child]:text-brand-900">
                  {content}
                </button>
              ) : (
                <div className="py-1">{content}</div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function QuoteForm({ services, phone }: { services: string[]; phone?: string }) {
  const params = useSearchParams();
  const preset = params.get("service") ?? "";
  const presetType = params.get("type") === "commercial" ? "commercial" : "residential";

  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [step, setStep] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [sentTo, setSentTo] = useState<{ name: string; email: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const headingRefs = useRef<(HTMLHeadingElement | null)[]>([]);

  const last = STEPS.length - 1;
  const stepErrors = Object.entries(errors).filter(([k]) => k !== "form" && stepOf(k) === step);
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

  /** Show a step and move focus to its heading so keyboard and screen-reader users land in the right place. */
  function goTo(next: number) {
    setStep(next);
    setFurthest((f) => Math.max(f, next));
    requestAnimationFrame(() => headingRefs.current[next]?.focus());
  }

  function showErrors(next: Errors, current: number) {
    setErrors(next);
    const target = firstErrorStep(next, current);
    setStep(target);
    // Wait for the summary to render, then move focus to it so screen readers announce it.
    requestAnimationFrame(() => summaryRef.current?.focus());
  }

  const readForm = () => Object.fromEntries(new FormData(formRef.current!)) as Record<string, string>;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = readForm();

    // Enter or "Next" on an earlier step: check this step, then move on.
    if (step < last) {
      const problems = validate(data, step);
      if (Object.keys(problems).length) return showErrors(problems, step);
      setErrors({});
      return goTo(step + 1);
    }

    const problems = validate(data);
    if (Object.keys(problems).length) return showErrors(problems, step);

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
        return showErrors(
          { form: `We've received several requests from you recently. Please try again later${callUs}.` },
          step,
        );
      }
      const body = await res.json().catch(() => null);
      const server = fromServer(body);
      showErrors(
        Object.keys(server).length ? server : { form: `Something went wrong on our side. Please try again${callUs}.` },
        step,
      );
    } catch {
      setState("idle");
      showErrors(
        {
          form: `We couldn't send your request. Check your internet connection and try again${callUs}. Your answers are still here.`,
        },
        step,
      );
    }
  }

  if (state === "sent" && sentTo) {
    return (
      <div className="py-6 text-center sm:py-10" role="status">
        <span className="mx-auto grid size-14 place-items-center rounded-md bg-emerald-50 text-emerald-700">
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
              setStep(0);
              setFurthest(0);
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

  /** A step panel: hidden (not unmounted) when inactive so its values are still submitted. */
  const Step = ({ index, children }: { index: number; children: React.ReactNode }) => (
    <section hidden={step !== index} aria-labelledby={`quote-step-${index}`} className="space-y-5">
      <h3
        id={`quote-step-${index}`}
        ref={(el) => {
          headingRefs.current[index] = el;
        }}
        tabIndex={-1}
        className="font-display text-2xl font-medium text-brand-900 outline-none"
      >
        {STEPS[index].title}
      </h3>
      {children}
    </section>
  );

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-busy={sending} aria-describedby="form-intro">
      <p id="form-intro" className="mb-6 text-sm text-muted">
        Three short steps. Only your name and email are required; the more you tell us about the job, the more
        accurate your quote.
      </p>

      <Progress current={step} furthest={furthest} onSelect={goTo} />

      {(errors.form || stepErrors.length > 0) && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800 outline-none focus-visible:ring-2 focus-visible:ring-red-300"
        >
          <p className="flex items-center gap-2 font-semibold">
            <AlertCircle className="size-4 shrink-0" aria-hidden />
            {stepErrors.length > 0
              ? `Please check ${stepErrors.length === 1 ? "1 answer" : `${stepErrors.length} answers`}`
              : "Your request wasn't sent"}
          </p>
          {errors.form && <p className="mt-1">{errors.form}</p>}
          {stepErrors.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {stepErrors.map(([k, msg]) => (
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

      <fieldset disabled={sending}>
        <legend className="sr-only">Quote request</legend>

        {Step({
          index: 0,
          children: (
            <>
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
                        <li key={t} className="rounded-[3px] bg-sand px-2.5 py-1 text-xs text-ink/80">
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
            </>
          ),
        })}

        {Step({
          index: 1,
          children: (
            <>
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
                      className="flex cursor-pointer items-start gap-3 rounded-md border border-line bg-paper p-4 transition-colors has-[:checked]:border-brand-700 has-[:checked]:bg-brand-50 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-500"
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
            </>
          ),
        })}

        {Step({
          index: 2,
          children: (
            <>
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
                    enterKeyHint="send"
                    maxLength={MAX.phone}
                    onChange={() => clearError("phone")}
                    {...a11y("phone", true)}
                  />
                  <Hint id="phone-hint">If you&apos;d also like us to call you.</Hint>
                  <FieldError id="phone-error" message={errors.phone} />
                </div>
              </div>
            </>
          ),
        })}

        {/* Honeypot for bots; hidden from people and screen readers */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      </fieldset>

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        {step > 0 ? (
          <button type="button" className="btn btn-outline btn-lg" onClick={() => goTo(step - 1)} disabled={sending}>
            <ArrowLeft className="size-4" aria-hidden /> Back
          </button>
        ) : (
          <span className="hidden sm:block" />
        )}
        <button
          type="submit"
          className="btn btn-primary btn-lg w-full px-4 whitespace-nowrap sm:w-auto sm:px-6"
          disabled={sending}
        >
          {sending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden /> Sending your request…
            </>
          ) : step < last ? (
            <>
              Next: {STEPS[step + 1].title} <ArrowRight className="size-4" aria-hidden />
            </>
          ) : (
            <>
              Send my quote request <ArrowRight className="size-4" aria-hidden />
            </>
          )}
        </button>
      </div>
      {step === last && (
        <p className="mt-3 text-sm text-muted sm:text-right">
          The quote is free. We&apos;ll review your details and get back to you with an itemised quote.
        </p>
      )}
      <p className="sr-only" aria-live="polite">
        {sending ? "Sending your request" : `Step ${step + 1} of ${STEPS.length}: ${STEPS[step].title}`}
      </p>
    </form>
  );
}
