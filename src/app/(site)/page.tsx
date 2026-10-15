import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  CtaBand,
  FaqList,
  ProjectGrid,
  SectionHeading,
  ServiceGrid,
  TestimonialGrid,
} from "@/components/site/sections";
import { Cover } from "@/components/ui/cover";
import { getFaqs, getProjects, getServices, getSettings, getTestimonials } from "@/lib/cms";

const PROMISES = ["Free, itemised quotes", "Fully insured & guaranteed", "Clean, tidy job sites"];

export default async function HomePage() {
  const [settings, services, projects, testimonials, faqs] = await Promise.all([
    getSettings(),
    getServices(),
    getProjects(),
    getTestimonials(),
    getFaqs(),
  ]);
  const featured = projects.filter((p) => p.is_featured).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="container-x grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="eyebrow">{settings.tagline}</p>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] font-semibold text-balance sm:text-6xl">
              {settings.hero_title}
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted">{settings.hero_subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact#quote" className="btn btn-primary">
                Get a free quote <ArrowRight className="size-4" />
              </Link>
              <Link href="/projects" className="btn btn-ghost">
                See our work
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              {PROMISES.map((p) => (
                <li key={p} className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-accent-500" /> {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <Cover
              src={settings.hero_image}
              alt="Freshly painted interior"
              swatch="cabinets"
              className="aspect-[4/5] w-full rounded-[2rem] shadow-2xl shadow-brand-900/20"
            />
            <div className="card absolute -bottom-6 -left-4 flex gap-6 px-6 py-4 shadow-xl sm:-left-8">
              <div>
                <p className="font-display text-3xl font-semibold text-brand-700">{settings.years_experience}+</p>
                <p className="text-xs text-muted">Years experience</p>
              </div>
              <div>
                <p className="font-display text-3xl font-semibold text-brand-700">{settings.projects_completed}+</p>
                <p className="text-xs text-muted">Projects completed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="What we do" title="Painting services for every surface" />
          <Link href="/services" className="text-sm font-semibold text-brand-600 hover:underline">
            All services →
          </Link>
        </div>
        <div className="mt-10">
          <ServiceGrid services={services.slice(0, 6)} />
        </div>
      </section>

      {featured.length > 0 && (
        <section className="bg-sand/60 py-16">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow="Recent work" title="Projects we're proud of" />
              <Link href="/projects" className="text-sm font-semibold text-brand-600 hover:underline">
                View gallery →
              </Link>
            </div>
            <div className="mt-10">
              <ProjectGrid projects={featured} />
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="container-x py-16">
          <SectionHeading eyebrow="Reviews" title="What our customers say" center />
          <div className="mt-10">
            <TestimonialGrid testimonials={testimonials.slice(0, 3)} />
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="container-x grid gap-10 py-16 md:grid-cols-[1fr_1.5fr]">
          <SectionHeading
            eyebrow="FAQ"
            title="Questions, answered"
            intro="Can't find what you're looking for? Give us a call or send a message."
          />
          <FaqList faqs={faqs} />
        </section>
      )}

      <CtaBand />
    </>
  );
}
