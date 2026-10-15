import Link from "next/link";
import { ArrowRight, Building2, ClipboardList, Home, HardHat, MessageSquareText, PaintRoller } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import { SectionHeading } from "./sections";
import { SOCIAL_ICONS } from "./social-links";

/**
 * Hero artwork used until a real photo is uploaded: a fan of paint-colour chips.
 * Decorative only, so it is hidden from assistive tech.
 */
export function PaintChips() {
  const chips = [
    { label: "Interiors", color: "#e9dfd0", ink: "#1b2430", rotate: "-rotate-6", offset: "translate-y-6" },
    { label: "Exteriors", color: "#2f5d8a", ink: "#ffffff", rotate: "rotate-0", offset: "" },
    { label: "New builds", color: "#b8501f", ink: "#ffffff", rotate: "rotate-6", offset: "translate-y-6" },
  ];
  return (
    <div aria-hidden className="relative grid aspect-[5/4] place-items-center overflow-hidden rounded-[2rem] bg-sand">
      <div className="absolute -top-20 -right-20 size-72 rounded-full bg-accent-100" />
      <div className="absolute -bottom-24 -left-16 size-72 rounded-full bg-brand-100/70" />
      <div className="relative flex items-end gap-3 sm:gap-5">
        {chips.map((c) => (
          <div
            key={c.label}
            className={`${c.rotate} ${c.offset} w-24 rounded-2xl bg-white p-2 shadow-xl shadow-brand-900/10 sm:w-32`}
          >
            <div className="aspect-[3/4] rounded-xl" style={{ background: c.color }}>
              <PaintRoller className="m-3 size-5" style={{ color: c.ink }} />
            </div>
            <p className="px-1 pt-2 pb-1 text-xs font-semibold text-ink sm:text-sm">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const AUDIENCES = [
  {
    icon: Home,
    title: "Homes",
    body: "Single rooms, full interiors and the outside of your home, with a finish that suits your style.",
    href: "/contact?type=residential#quote",
  },
  {
    icon: Building2,
    title: "Businesses",
    body: "Offices, shops and other business premises, inside and out.",
    href: "/contact?type=commercial#quote",
  },
  {
    icon: HardHat,
    title: "New builds",
    body: "Interior and exterior finishing for new houses and multi-storey buildings.",
    href: `/contact?service=${encodeURIComponent("Exterior & New Builds")}#quote`,
  },
];

export function Audiences() {
  return (
    <section aria-labelledby="audiences-heading" className="container-x section">
      <SectionHeading id="audiences-heading" eyebrow="Who we work with" title="Painting for every kind of property" />
      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {AUDIENCES.map(({ icon: Icon, title, body, href }) => (
          <li key={title} className="card flex flex-col p-6">
            <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-700">
              <Icon className="size-5" aria-hidden />
            </span>
            <h3 className="mt-5 text-lg font-semibold">{title}</h3>
            <p className="mt-2 flex-1 text-sm text-muted">{body}</p>
            <Link href={href} className="mt-4 inline-flex items-center gap-1 py-1.5 text-sm font-semibold text-accent-700 hover:underline">
              Quote for {title.toLowerCase()} <ArrowRight className="size-4" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

const STEPS = [
  { icon: MessageSquareText, title: "Tell us about the job", body: "Use the quote form to describe the property, the rooms or areas, and when you'd like to start." },
  { icon: ClipboardList, title: "Get a free, itemised quote", body: "We get back to you with a clear quote that lists the work and the price for each part." },
  { icon: PaintRoller, title: "Agree a start date", body: "Once you're happy with the quote, we book the job in and get painting." },
];

export function Process() {
  return (
    <section aria-labelledby="process-heading" className="bg-brand-900 text-white">
      <div className="container-x section">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-accent-400 uppercase">How it works</p>
          <h2 id="process-heading" className="mt-3 font-display text-3xl font-semibold text-balance sm:text-4xl">
            Getting a quote is simple
          </h2>
        </div>
        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className="relative">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-accent-600 font-semibold">{i + 1}</span>
                <Icon className="size-5 text-white/60" aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-white/75">{body}</p>
            </li>
          ))}
        </ol>
        <Link href="/contact#quote" className="btn btn-primary btn-lg mt-10">
          Start your free quote <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
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
    <div className="card flex flex-col items-start gap-6 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
      <div className="max-w-xl">
        <Heading className="font-display text-2xl font-semibold">{title}</Heading>
        <p className="mt-2 text-muted">
          We share finished jobs and work in progress on social media. Follow along to see our crews at work.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        {links.map((l) => (
          <a key={l.key} href={l.url} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
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
