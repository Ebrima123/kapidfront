import type { Metadata } from "next";
import { Audiences, PaintChips, SocialWork } from "@/components/site/home";
import { CtaBand, PageHero, SectionHeading, ServiceGrid, TestimonialGrid } from "@/components/site/sections";
import { Cover } from "@/components/ui/cover";
import { getServices, getSettings, getTestimonials } from "@/lib/cms";

export const metadata: Metadata = {
  title: "About",
  description: "Kapid Painting Company is a painting and decorating business serving homes, businesses and new builds in The Gambia.",
};

export default async function AboutPage() {
  const [settings, services, testimonials] = await Promise.all([getSettings(), getServices(), getTestimonials()]);
  return (
    <>
      <PageHero eyebrow="About us" title={settings.about_title} />
      <section className="container-x section grid items-center gap-12 md:grid-cols-2">
        <div className="space-y-4 text-lg whitespace-pre-line text-ink/85">{settings.about_body}</div>
        <Cover
          src={settings.about_image}
          alt={`The ${settings.company_name} team at work`}
          className="aspect-[5/4] w-full rounded-[2rem]"
          fallback={<PaintChips />}
        />
      </section>

      <div className="bg-sand/60">
        <Audiences />
      </div>

      <section aria-labelledby="about-services" className="container-x section">
        <SectionHeading id="about-services" eyebrow="What we do" title="Our services" />
        <div className="mt-10">
          <ServiceGrid services={services} />
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="container-x pb-16">
          <TestimonialGrid testimonials={testimonials.slice(0, 3)} />
        </section>
      )}

      <section className="container-x pb-4">
        <SocialWork settings={settings} headingLevel="h2" />
      </section>

      <CtaBand />
    </>
  );
}
