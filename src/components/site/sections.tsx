import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { ProjectCard } from "@/components/site/project-card";
import { ServiceIcon } from "@/components/ui/icon";
import type { FAQ, Project, Service, Testimonial } from "@/lib/types";

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
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="mt-3 font-display text-3xl font-semibold text-balance sm:text-4xl">
        {title}
      </h2>
      {intro && <p className="mt-4 text-muted">{intro}</p>}
    </div>
  );
}

export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="border-b border-line bg-sand/60">
      <div className="container-x py-12 sm:py-16">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold text-balance sm:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-lg text-muted">{intro}</p>}
      </div>
    </section>
  );
}

export function ServiceGrid({ services }: { services: Service[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s) => (
        <Link
          key={s.id}
          href={`/services/${s.slug}`}
          className="group card p-6 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/5"
        >
          <span className="grid size-11 place-items-center rounded-xl bg-accent-100 text-accent-600">
            <ServiceIcon name={s.icon} className="size-5" />
          </span>
          <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
          <p className="mt-2 text-sm text-muted">{s.summary}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
            Learn more <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
          </span>
        </Link>
      ))}
    </div>
  );
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return <p className="text-muted">New projects are coming soon.</p>;
  }
  return (
    <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <li key={p.id}>
          <ProjectCard project={p} />
        </li>
      ))}
    </ul>
  );
}

export function TestimonialGrid({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {testimonials.map((t) => (
        <figure key={t.id} className="card flex flex-col p-6">
          <div className="flex gap-0.5 text-accent-500" aria-label={`${t.rating} out of 5 stars`}>
            {Array.from({ length: t.rating }, (_, i) => (
              <Star key={i} className="size-4 fill-current" />
            ))}
          </div>
          <blockquote className="mt-4 flex-1 text-ink/90">“{t.quote}”</blockquote>
          <figcaption className="mt-5 text-sm">
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
    <div className="divide-y divide-line rounded-2xl border border-line bg-white">
      {faqs.map((f) => (
        <details key={f.id} className="group p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
            {f.question}
            <span aria-hidden className="text-xl leading-none text-accent-700 transition group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 text-muted">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function CtaBand() {
  return (
    <section className="container-x py-16">
      <div className="relative overflow-hidden rounded-3xl bg-brand-700 px-6 py-12 text-white sm:px-12">
        <div aria-hidden className="absolute -top-16 -right-16 size-64 rounded-full bg-accent-500/30 blur-2xl" />
        <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold">Ready for a fresh coat?</h2>
            <p className="mt-2 text-white/80">Tell us about your project and we&apos;ll send you a free, itemised quote.</p>
          </div>
          <Link href="/contact#quote" className="btn btn-primary btn-lg shrink-0">
            Get a free quote <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
