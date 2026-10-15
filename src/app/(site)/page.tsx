import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Audiences, MottoBand, PaintChips, Process, SocialWork, TrustBar } from "@/components/site/home";
import {
  CtaBand,
  FaqList,
  ProjectGrid,
  SectionHeading,
  ServiceGrid,
  TestimonialGrid,
} from "@/components/site/sections";
import { BrushPaint } from "@/components/site/paint-motion";
import { Cover } from "@/components/ui/cover";
import { getFaqs, getProjects, getServices, getSettings, getTestimonials } from "@/lib/cms";

export const metadata: Metadata = {
  title: { absolute: "Kapid Painting Company | Painting & decorating in The Gambia" },
};

export default async function HomePage() {
  const [settings, services, projects, testimonials, faqs] = await Promise.all([
    getSettings(),
    getServices(),
    getProjects(),
    getTestimonials(),
    getFaqs(),
  ]);
  const area = settings.service_area || "The Gambia";
  const featured = projects.filter((p) => p.is_featured).slice(0, 3);
  const work = featured.length > 0 ? featured : projects.slice(0, 3);

  return (
    <>
      {/* 1. What Kapid does, who it serves, and how to get a quote */}
      <section className="bg-limewash">
        <div className="container-x grid items-center gap-12 pt-12 pb-16 md:pt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-20">
          <div data-reveal="rise">
            <h1 className="heading-xl">{settings.hero_title}</h1>
            {/* A paintbrush paints a rust stroke under the headline */}
            <BrushPaint className="mt-3 h-auto w-full max-w-md" />
            <p className="lede mt-4 max-w-xl">{settings.hero_subtitle}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/contact#quote" className="btn btn-primary btn-lg">
                Get a free quote <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link href="/projects" className="btn btn-outline btn-lg">
                See our work
              </Link>
            </div>
          </div>
          {/* Roller-wipe reveal for the hero photo (or the fan-deck placeholder) */}
          <div data-reveal="wipe" style={{ "--reveal-delay": "200ms" } as React.CSSProperties}>
            <Cover
              src={settings.hero_image}
              alt={`${settings.company_name} at work`}
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="aspect-[5/4] w-full rounded-md"
              fallback={<PaintChips />}
            />
          </div>
        </div>
      </section>

      <TrustBar serviceArea={area} />

      {/* 2. Services */}
      <section aria-labelledby="services-heading" className="bg-cream">
        <div className="container-x section">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              id="services-heading"
              eyebrow="What we do"
              title="Our painting services"
              intro="Choose a service to see what's involved, or go straight to a free quote."
            />
            <Link href="/services" className="link-arrow">
              All services <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-12">
            <ServiceGrid services={services.slice(0, 8)} />
          </div>
          <div className="mt-8 flex flex-col gap-4 rounded-md border border-line bg-paper p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-brand-900">
              <span className="font-semibold">Not sure which service you need?</span>{" "}
              <span className="text-muted">Describe the job in your own words and we&apos;ll take it from there.</span>
            </p>
            <Link href="/contact#quote" className="btn btn-dark shrink-0 self-start sm:self-auto">
              Describe your job <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Who we work with */}
      <Audiences />

      <MottoBand motto={settings.tagline} />

      {/* 4. Proof of work */}
      <section aria-labelledby="work-heading" className="container-x section">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading id="work-heading" eyebrow="Our work" title="Recent projects" />
          {work.length > 0 && (
            <Link href="/projects" className="link-arrow">
              View all projects <ArrowRight className="size-4" aria-hidden />
            </Link>
          )}
        </div>
        <div className="mt-12 space-y-12">
          {work.length > 0 && <ProjectGrid projects={work} />}
          <SocialWork settings={settings} title={work.length > 0 ? "More on social media" : "See our latest work"} />
        </div>
      </section>

      {/* 5. How to get a quote */}
      <Process />

      {testimonials.length > 0 && (
        <section aria-labelledby="reviews-heading" className="container-x section">
          <SectionHeading id="reviews-heading" eyebrow="Reviews" title="What our customers say" />
          <div className="mt-12">
            <TestimonialGrid testimonials={testimonials.slice(0, 3)} />
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section aria-labelledby="faq-heading" className="container-x section grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <SectionHeading
            id="faq-heading"
            eyebrow="FAQ"
            title="Questions, answered"
            intro="Can't find what you're looking for? Send us a message through the quote form."
          />
          <FaqList faqs={faqs} />
        </section>
      )}

      <CtaBand phone={settings.phone} />
    </>
  );
}
