import Link from "next/link";
import { ArrowRight, Phone, Star } from "lucide-react";
import { ProjectCard } from "@/components/site/project-card";
import { Cover } from "@/components/ui/cover";
import type { FAQ, Project, Service, Testimonial } from "@/lib/types";

const pad = (n: number) => String(n).padStart(2, "0");

export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  center = false,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  intro?: string;
  center?: boolean;
}) {
  return (
    <div data-reveal="rise" className={`max-w-2xl ${center ? "mx-auto text-center [&>.eyebrow]:justify-center" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="heading-lg mt-5">
        {title}
      </h2>
      {intro && <p className="lede mt-5">{intro}</p>}
    </div>
  );
}

/** Top-of-page header used on every inner page. */
export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  /** Optional actions or breadcrumb rendered under the intro. */
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-limewash-paper">
      <div data-reveal="rise" className="container-x pt-14 pb-14 sm:pt-20 sm:pb-16">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="heading-xl mt-6 max-w-4xl">{title}</h1>
        {intro && <p className="lede mt-6 max-w-2xl">{intro}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
      <div className="swatch-stripe" data-reveal="wipe" style={{ "--reveal-delay": "250ms" } as React.CSSProperties} aria-hidden />
    </section>
  );
}

/** Fan-deck colours for service tiles without a photo, in brand order. */
const TILE_COLOURS = [
  { bg: "#e6dccb", texture: "" },
  { bg: "#2f5d8a", texture: "bg-roller" },
  { bg: "#b8501f", texture: "bg-roller" },
  { bg: "#566170", texture: "bg-roller" },
  { bg: "#122338", texture: "bg-moulding" },
];

/**
 * Visual service tiles: a colour block (or the service photo once uploaded), the
 * title and summary, and two clear actions. 1 column on phones, 2 on tablets, and
 * 4 or 3 across on desktop so rows always come out even.
 */
export function ServiceGrid({ services }: { services: Service[] }) {
  const n = services.length;
  const desktopCols = n % 4 === 0 ? "lg:grid-cols-4" : n === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3";
  return (
    <ul className={`grid gap-5 sm:grid-cols-2 ${desktopCols}`}>
      {services.map((s, i) => {
        const colour = TILE_COLOURS[i % TILE_COLOURS.length];
        const quoteHref = `/contact?service=${encodeURIComponent(s.title)}#quote`;
        return (
          <li
            key={s.id}
            data-reveal="rise"
            style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
            className="group relative flex flex-col overflow-hidden rounded-md border border-line bg-paper transition-colors duration-200 hover:border-brand-900 has-[a:focus-visible]:border-brand-900"
          >
            <div
              data-reveal="wipe"
              className="relative aspect-[2/1] sm:aspect-[4/3]"
              style={{ background: colour.bg, "--reveal-delay": "0ms" } as React.CSSProperties}
            >
              {s.image ? (
                <Cover
                  src={s.image}
                  alt=""
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="h-full w-full"
                  imgClassName="transition duration-700 group-hover:scale-[1.04]"
                  fallback={<div className={`h-full w-full ${colour.texture}`} />}
                />
              ) : (
                <div className={`h-full w-full ${colour.texture}`} aria-hidden />
              )}
              <span
                className="absolute top-4 left-4 rounded-[3px] bg-paper px-2 py-0.5 font-display text-lg font-medium text-brand-900 tabular-nums"
                aria-hidden
              >
                {pad(i + 1)}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-6">
              <h3 className="font-display text-2xl leading-tight font-medium text-brand-900">
                {/* Stretched link: the whole tile opens the service page. */}
                <Link
                  href={`/services/${s.slug}`}
                  className="outline-none after:absolute after:inset-0 focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-4"
                >
                  {s.title}
                </Link>
              </h3>
              <p className="mt-2 flex-1 leading-relaxed text-muted">{s.summary}</p>
              <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-5">
                {/* Sits above the stretched link so it stays separately clickable. */}
                <Link href={quoteHref} className="btn btn-primary relative z-10 px-4">
                  Get a quote<span className="sr-only"> for {s.title.toLowerCase()}</span>
                </Link>
                <span aria-hidden className="inline-flex items-center gap-1 text-sm font-semibold text-accent-700">
                  View
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** Editorial list of services for the services index: one ruled row per service. */
export function ServiceList({ services }: { services: Service[] }) {
  return (
    <ol className="border-t border-brand-900">
      {services.map((s, i) => (
        <li key={s.id} data-reveal="rise" className="grid gap-5 border-b border-line py-10 md:grid-cols-[5rem_1fr_auto] md:items-start md:gap-8 md:py-12">
          <span className="index-no text-lg" aria-hidden>
            {pad(i + 1)}
          </span>
          <div className="max-w-2xl">
            <h2 className="heading-md">
              <Link href={`/services/${s.slug}`} className="hover:text-accent-700">
                {s.title}
              </Link>
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-muted">{s.summary}</p>
            {s.description && <p className="mt-4 leading-relaxed whitespace-pre-line text-ink/85">{s.description}</p>}
          </div>
          <div className="flex flex-wrap gap-3 md:flex-col md:items-stretch">
            <Link href={`/contact?service=${encodeURIComponent(s.title)}#quote`} className="btn btn-primary">
              Get a quote
            </Link>
            <Link href={`/services/${s.slug}`} className="btn btn-outline">
              Details<span className="sr-only"> about {s.title}</span>
            </Link>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return <p className="text-muted">New projects are coming soon.</p>;
  }
  return (
    <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p, i) => (
        <li key={p.id} data-reveal="rise" style={{ "--reveal-delay": `${(i % 3) * 90}ms` } as React.CSSProperties}>
          <ProjectCard project={p} />
        </li>
      ))}
    </ul>
  );
}

export function TestimonialGrid({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-3">
      {testimonials.map((t) => (
        <figure key={t.id} data-reveal="rise" className="flex flex-col bg-paper p-8">
          <div className="flex gap-0.5 text-accent-600" role="img" aria-label={`${t.rating} out of 5 stars`}>
            {Array.from({ length: t.rating }, (_, i) => (
              <Star key={i} className="size-4 fill-current" aria-hidden />
            ))}
          </div>
          <blockquote className="mt-5 flex-1 font-display text-xl leading-snug text-brand-900">“{t.quote}”</blockquote>
          <figcaption className="mt-6 text-sm">
            <span className="font-semibold">{t.name}</span>
            {t.location && <span className="text-muted"> · {t.location}</span>}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function FaqList({ faqs }: { faqs: FAQ[] }) {
  return (
    <div data-reveal="rise" className="divide-y divide-line border-y border-brand-900/80">
      {faqs.map((f) => (
        <details key={f.id} className="group py-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-[5px] font-display text-xl font-medium text-brand-900 [&::-webkit-details-marker]:hidden">
            {f.question}
            <span
              aria-hidden
              className="grid size-9 shrink-0 place-items-center rounded-[5px] border border-line text-xl leading-none text-accent-700 transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 max-w-prose leading-relaxed text-muted">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}

/** Closing call to action used at the foot of every page. */
export function CtaBand({ phone }: { phone?: string }) {
  return (
    <section aria-labelledby="cta-heading" className="bg-roller relative overflow-hidden border-t-4 border-accent-600 bg-brand-900 text-white">
      {/* Paint running down from the rust edge */}
      <div data-reveal="drips" className="paint-drips pointer-events-none absolute inset-x-0 top-0" aria-hidden>
        {[
          { left: "8%", h: 26, d: 0 },
          { left: "17%", h: 44, d: 180 },
          { left: "21%", h: 16, d: 420 },
          { left: "63%", h: 34, d: 260 },
          { left: "88%", h: 52, d: 90 },
          { left: "93%", h: 20, d: 520 },
        ].map((drip) => (
          <span
            key={drip.left}
            style={{ left: drip.left, height: drip.h, "--drip-delay": `${drip.d}ms` } as React.CSSProperties}
          />
        ))}
      </div>
      <div data-reveal="rise" className="container-x flex flex-col items-start justify-between gap-10 py-16 sm:py-20 md:flex-row md:items-center">
        <div className="max-w-xl">
          <h2 id="cta-heading" className="font-display text-3xl leading-tight sm:text-[2.75rem]">
            Ready for a fresh coat?
          </h2>
          <p className="mt-4 text-lg text-white/75">
            Tell us about your project and we&apos;ll send you a free, itemised quote.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/contact#quote" className="btn btn-primary btn-lg">
            Get a free quote <ArrowRight className="size-4" aria-hidden />
          </Link>
          {phone && (
            <a href={`tel:${phone}`} className="btn btn-on-dark btn-lg">
              <Phone className="size-4" aria-hidden /> {phone}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
