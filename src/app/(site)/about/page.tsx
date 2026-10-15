import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Audiences, MottoBand, PaintChips, SocialWork } from "@/components/site/home";
import { CtaBand, PageHero, SectionHeading, ServiceGrid, TestimonialGrid } from "@/components/site/sections";
import { Cover } from "@/components/ui/cover";
import { getServices, getSettings, getTestimonials } from "@/lib/cms";

export const metadata: Metadata = {
  title: "About",
  description:
    "Kapid Painting Company is a painting and decorating business serving homes, businesses and new builds in The Gambia.",
};

export default async function AboutPage() {
  const [settings, services, testimonials] = await Promise.all([getSettings(), getServices(), getTestimonials()]);
  const area = settings.service_area || "The Gambia";
  const [lead, ...rest] = settings.about_body.split(/\n\s*\n/);

  // Only facts already stated on the site; each row is omitted if its source is empty.
  const facts: [string, React.ReactNode][] = [
    ["Where we work", area],
    ["Who we work with", "Homeowners, businesses and new-build projects"],
    services.length > 0 && ["What we do", services.map((s) => s.title).join(", ")],
    ["Quotes", "Free and itemised"],
    settings.tagline && ["Our motto", `“${settings.tagline.replace(/[.!]+$/, "")}.”`],
  ].filter(Boolean) as [string, React.ReactNode][];

  return (
    <>
      <PageHero eyebrow="About us" title={settings.about_title} />

      <section className="container-x section grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <div>
          <p className="font-display text-2xl leading-snug text-brand-900 sm:text-[1.9rem]">{lead}</p>
          {rest.map((para) => (
            <p key={para} className="mt-6 max-w-prose text-lg leading-relaxed text-ink/80">
              {para}
            </p>
          ))}
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/contact#quote" className="btn btn-primary btn-lg">
              Get a free quote <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link href="/projects" className="btn btn-outline btn-lg">
              See our work
            </Link>
          </div>
        </div>
        <div className="space-y-10">
          <Cover
            src={settings.about_image}
            alt={`The ${settings.company_name} team at work`}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="aspect-[5/4] w-full rounded-md"
            fallback={<PaintChips />}
          />
          <section aria-labelledby="facts-heading">
            <h2 id="facts-heading" className="font-sans text-xs font-semibold tracking-[0.16em] text-brand-600 uppercase">
              At a glance
            </h2>
            <dl className="mt-4 border-t border-brand-900">
              {facts.map(([term, value]) => (
                <div key={term} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
                  <dt className="text-sm text-muted">{term}</dt>
                  <dd className="font-medium text-brand-900">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </section>

      <MottoBand motto={settings.tagline} />

      <section aria-labelledby="about-services" className="bg-paper">
        <div className="container-x section">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading id="about-services" eyebrow="What we do" title="Our services" />
            <Link href="/services" className="link-arrow">
              All services <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-12">
            <ServiceGrid services={services} />
          </div>
        </div>
      </section>

      <Audiences id="about-audiences" />

      {testimonials.length > 0 && (
        <section className="container-x pb-20">
          <TestimonialGrid testimonials={testimonials.slice(0, 3)} />
        </section>
      )}

      <section className="container-x pb-20 sm:pb-24">
        <SocialWork settings={settings} headingLevel="h2" />
      </section>

      <CtaBand phone={settings.phone} />
    </>
  );
}
