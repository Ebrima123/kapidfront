import Link from "next/link";
import { ArrowRight, ClipboardCheck, HardHat, Home, MapPin } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import { SectionHeading } from "./sections";
import { PaintRoller } from "./paint-motion";
import { SOCIAL_ICONS } from "./social-links";

const SWATCHES = [
  { label: "Interiors", color: "#e6dccb", ink: "text-ink" },
  { label: "Exteriors", color: "#2f5d8a", ink: "text-white" },
  { label: "New builds", color: "#b8501f", ink: "text-white" },
  { label: "Commercial", color: "#566170", ink: "text-white" },
  { label: "Decorative", color: "#122338", ink: "text-white" },
];

/**
 * Shown wherever a real photo has not been uploaded yet: a flat paint fan-deck of
 * the kinds of work Kapid does. Decorative, so hidden from assistive tech.
 */
export function PaintChips({ className = "aspect-[5/4]" }: { className?: string }) {
  return (
    <div aria-hidden className={`flex w-full flex-col overflow-hidden rounded-md border border-line bg-paper ${className}`}>
      <div data-reveal="drop" className="grid flex-1 grid-cols-5 gap-px overflow-hidden bg-paper">
        {SWATCHES.map((s) => (
          <div key={s.label} className="flex flex-col justify-end p-3 sm:p-4" style={{ background: s.color }}>
            <span className={`rotate-180 text-[10px] font-semibold tracking-[0.16em] uppercase [writing-mode:vertical-rl] sm:text-xs ${s.ink}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-line px-5 py-4">
        <span className="font-display text-base font-semibold tracking-[0.14em] text-brand-900 uppercase">Kapid</span>
        <span className="text-xs text-muted">Painting &amp; decorating</span>
      </div>
    </div>
  );
}

/**
 * Per-cell separators and padding for the facts strip, so every breakpoint is balanced:
 * phones stack with rules between rows; tablets are 2×2 with a centre rule; desktop is
 * 4 equal columns divided by hairlines. Outer cells stay flush with the page container.
 */
const FACT_CELL = [
  "sm:pr-8 lg:pr-8",
  "border-t sm:border-t-0 sm:border-l sm:pl-8 lg:px-8",
  "border-t sm:pr-8 lg:border-t-0 lg:border-l lg:px-8",
  "border-t sm:border-l sm:pl-8 lg:border-t-0 lg:pl-8",
];

/** Plain facts under the hero, set as a navy band with rust icon tiles. */
export function TrustBar({ serviceArea }: { serviceArea: string }) {
  const facts = [
    { icon: Home, title: "Homes & businesses", text: "Residential and commercial painting" },
    { icon: HardHat, title: "New builds", text: "Interior and exterior finishing" },
    { icon: ClipboardCheck, title: "Free, itemised quotes", text: "Each part of the job priced" },
    { icon: MapPin, title: serviceArea, text: "Where we work" },
  ];
  return (
    <section aria-label="At a glance" className="bg-roller border-t-4 border-accent-600 bg-brand-900 text-white">
      <ul className="container-x grid sm:grid-cols-2 lg:grid-cols-4">
        {facts.map(({ icon: Icon, title, text }, i) => (
          <li
            key={title}
            data-reveal="rise"
            style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
            className={`grid grid-cols-[2.5rem_1fr] items-start gap-x-4 border-white/15 py-5 sm:py-7 ${FACT_CELL[i]}`}
          >
            <span className="grid size-10 place-items-center rounded-[5px] bg-accent-600" aria-hidden>
              <Icon className="size-5 text-white" />
            </span>
            <span className="min-w-0">
              <span className="block text-base leading-6 font-semibold text-white">{title}</span>
              <span className="mt-0.5 block text-sm leading-5 text-white/75">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const AUDIENCES = [
  {
    title: "Homes",
    body: "Single rooms, full interiors and the outside of your home, with a finish that suits your style.",
    href: "/contact?type=residential#quote",
  },
  {
    title: "Businesses",
    body: "Offices, shops and other business premises, inside and out.",
    href: "/contact?type=commercial#quote",
  },
  {
    title: "New builds",
    body: "Interior and exterior finishing for new houses and multi-storey buildings.",
    href: `/contact?service=${encodeURIComponent("Exterior & New Builds")}#quote`,
  },
];

export function Audiences({ id = "audiences-heading" }: { id?: string }) {
  return (
    <section aria-labelledby={id} className="container-x section">
      <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <SectionHeading id={id} eyebrow="Who we work with" title="Painting for every kind of property" />
        <ul className="grid gap-10 sm:grid-cols-3 sm:gap-8">
          {AUDIENCES.map(({ title, body, href }, i) => (
            <li key={title} data-reveal="rise" style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties} className="flex flex-col border-t-2 border-brand-900 pt-6">
              <h3 className="font-display text-2xl font-medium text-brand-900">{title}</h3>
              <p className="mt-3 flex-1 leading-relaxed text-muted">{body}</p>
              <Link href={href} className="link-arrow mt-5 self-start">
                Quote for {title.toLowerCase()} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const STEPS = [
  { title: "Tell us about the job", body: "Use the quote form to describe the property, the rooms or areas, and when you'd like to start." },
  { title: "Get a free, itemised quote", body: "We get back to you with a clear quote that lists the work and the price for each part." },
  { title: "Agree a start date", body: "Once you're happy with the quote, we book the job in and get painting." },
];

export function Process({ id = "process-heading" }: { id?: string }) {
  return (
    <section aria-labelledby={id} className="bg-moulding bg-brand-900 text-white">
      <div className="container-x section">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow text-white/70">How it works</p>
            <h2 id={id} className="mt-5 font-display text-[2.1rem] leading-[1.08] sm:text-[2.75rem]">
              Getting a quote is simple
            </h2>
          </div>
          <Link href="/contact#quote" className="btn btn-primary btn-lg self-start md:self-auto">
            Start your free quote <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-10">
          {STEPS.map(({ title, body }, i) => (
            <li key={title} data-reveal="rise" style={{ "--reveal-delay": `${i * 120}ms` } as React.CSSProperties} className="border-t border-white/20 pt-6">
              <span className="font-display text-4xl text-accent-400 tabular-nums" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-xl font-semibold">{title}</h3>
              <p className="mt-2 leading-relaxed text-white/70">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/**
 * The company's own motto as an editorial pull-quote. On scroll, a paint roller rolls
 * across and paints the band behind it, then the motto appears (see RevealObserver).
 */
export function MottoBand({ motto }: { motto: string }) {
  if (!motto) return null;
  return (
    <section aria-label="Our motto" data-reveal="roller" className="relative overflow-hidden border-y border-line bg-cream">
      {/* The freshly painted wall */}
      <div className="roller-band bg-brushstroke absolute inset-0 bg-sand" aria-hidden />
      {/* The roller that paints it */}
      <div className="paint-roller-tool pointer-events-none absolute inset-y-4 left-0 w-[72px]" aria-hidden>
        <PaintRoller className="h-full w-full" />
      </div>
      <figure className="container-x relative grid gap-6 py-16 sm:py-20 lg:grid-cols-[13rem_1fr] lg:items-baseline lg:gap-16">
        <figcaption className="eyebrow">Our motto</figcaption>
        <blockquote className="font-display text-[2.2rem] leading-[1.08] font-medium text-brand-900 italic sm:text-5xl lg:text-[3.75rem]">
          “{motto.replace(/[.!]+$/, "")}.”
        </blockquote>
      </figure>
    </section>
  );
}

/** Points visitors to the work Kapid already publishes on social media. */
export function SocialWork({
  settings,
  title = "See our latest work",
  headingLevel: Heading = "h3",
}: {
  settings: SiteSettings;
  title?: string;
  headingLevel?: "h2" | "h3";
}) {
  const links = [
    { key: "tiktok_url", label: "Watch on TikTok", url: settings.tiktok_url, icon: SOCIAL_ICONS.tiktok },
    { key: "facebook_url", label: "Follow on Facebook", url: settings.facebook_url, icon: SOCIAL_ICONS.facebook },
    { key: "instagram_url", label: "See on Instagram", url: settings.instagram_url, icon: SOCIAL_ICONS.instagram },
  ].filter((l) => l.url);
  if (links.length === 0) return null;

  return (
    <div data-reveal="rise" className="grid gap-6 border-y border-brand-900/80 py-8 md:grid-cols-[1fr_auto] md:items-center md:gap-10">
      <div className="max-w-xl">
        <Heading className="font-display text-2xl font-medium text-brand-900 sm:text-[1.75rem]">{title}</Heading>
        <p className="mt-2 leading-relaxed text-muted">
          We share finished jobs and work in progress on social media. Follow along to see our crews at work.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        {links.map((l) => (
          <a key={l.key} href={l.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
              {l.icon}
            </svg>
            {l.label}
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ))}
      </div>
    </div>
  );
}
