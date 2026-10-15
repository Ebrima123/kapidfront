import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { Audiences, PaintChips, Process, SocialWork } from "@/components/site/home";
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

export const metadata: Metadata = {
  title: { absolute: "Kapid Painting Company | Painting & decorating in The Gambia" },
};

const HIGHLIGHTS = ["Free, itemised quotes", "Interior & exterior", "Homes, businesses & new builds"];

export default async function HomePage() {
  const [settings, services, projects, testimonials, faqs] = await Promise.all([
    getSettings(),
    getServices(),
    getProjects(),
    getTestimonials(),
    getFaqs(),
  ]);
  const featured = projects.filter((p) => p.is_featured).slice(0, 3);
  const work = featured.length > 0 ? featured : projects.slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="container-x grid items-center gap-10 pt-8 pb-14 md:grid-cols-[1.1fr_1fr] md:pt-12 md:pb-20">
          <div>
            <p className="eyebrow flex items-center gap-1.5">
              <MapPin className="size-3.5" aria-hidden />
              Painting &amp; decorating · {settings.service_area || "The Gambia"}
            </p>
            <h1 className="mt-4 font-display text-4xl leading-[1.08] font-semibold text-balance sm:text-5xl lg:text-[3.5rem]">
              {settings.hero_title}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">{settings.hero_subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact#quote" className="btn btn-primary btn-lg">
                Get a free quote <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link href="/projects" className="btn btn-outline btn-lg">
                See our work
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink/80">
              {HIGHLIGHTS.map((h) => (
                <li key={h} className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-accent-600" aria-hidden /> {h}
                </li>
              ))}
            </ul>
          </div>
          <Cover
            src={settings.hero_image}
            alt={`${settings.company_name} at work`}
            priority
            className="aspect-[5/4] w-full rounded-[2rem] shadow-xl shadow-brand-900/15"
            fallback={<PaintChips />}
          />
        </div>
        {settings.tagline && (
          <div className="border-y border-line bg-white/60">
            <p className="container-x py-4 text-center font-display text-lg text-brand-700 italic">
              “{settings.tagline}”
            </p>
          </div>
        )}
      </section>

      <Audiences />

      <section aria-labelledby="services-heading" className="bg-sand/60">
        <div className="container-x section">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading id="services-heading" eyebrow="What we do" title="Our painting services" />
            <Link href="/services" className="inline-block py-1.5 text-sm font-semibold text-accent-700 hover:underline">
              All services <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="mt-10">
            <ServiceGrid services={services.slice(0, 6)} />
          </div>
        </div>
      </section>

      <section aria-labelledby="work-heading" className="container-x section">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading id="work-heading" eyebrow="Our work" title="Recent projects" />
          {work.length > 0 && (
            <Link href="/projects" className="inline-block py-1.5 text-sm font-semibold text-accent-700 hover:underline">
              View all projects <span aria-hidden>→</span>
            </Link>
          )}
        </div>
        <div className="mt-10 space-y-8">
          {work.length > 0 && <ProjectGrid projects={work} />}
          <SocialWork settings={settings} title={work.length > 0 ? "More on social media" : "See our latest work"} />
        </div>
      </section>

      <Process />

      {testimonials.length > 0 && (
        <section aria-labelledby="reviews-heading" className="container-x section">
          <SectionHeading id="reviews-heading" eyebrow="Reviews" title="What our customers say" center />
          <div className="mt-10">
            <TestimonialGrid testimonials={testimonials.slice(0, 3)} />
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section aria-labelledby="faq-heading" className="container-x section grid gap-10 md:grid-cols-[1fr_1.5fr]">
          <SectionHeading
            id="faq-heading"
            eyebrow="FAQ"
            title="Questions, answered"
            intro="Can't find what you're looking for? Send us a message through the quote form."
          />
          <FaqList faqs={faqs} />
        </section>
      )}

      <CtaBand />
    </>
  );
}
