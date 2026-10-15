import type { Metadata } from "next";
import { CtaBand, PageHero, SectionHeading, TestimonialGrid } from "@/components/site/sections";
import { Cover } from "@/components/ui/cover";
import { getSettings, getTestimonials } from "@/lib/cms";

export const metadata: Metadata = { title: "About" };

const VALUES = [
  { title: "Preparation first", body: "Most of a great finish happens before the first coat: filling, sanding and priming." },
  { title: "Respect for your home", body: "Floors and furniture covered, daily tidy-ups and a full clean when we finish." },
  { title: "Clear pricing", body: "Itemised quotes with no surprises. What we quote is what you pay." },
];

export default async function AboutPage() {
  const [settings, testimonials] = await Promise.all([getSettings(), getTestimonials()]);
  return (
    <>
      <PageHero eyebrow="About us" title={settings.about_title} />
      <section className="container-x grid items-center gap-12 py-16 md:grid-cols-2">
        <div className="space-y-4 text-lg whitespace-pre-line text-ink/85">{settings.about_body}</div>
        <Cover src={settings.about_image} alt="Our team at work" swatch="exterior" className="aspect-[4/3] w-full rounded-3xl" />
      </section>
      <section className="bg-sand/60 py-16">
        <div className="container-x">
          <SectionHeading eyebrow="How we work" title="The Kapid standard" />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <div key={v.title} className="card p-6">
                <span className="font-display text-3xl text-accent-500">0{i + 1}</span>
                <h3 className="mt-3 font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {testimonials.length > 0 && (
        <section className="container-x py-16">
          <TestimonialGrid testimonials={testimonials.slice(0, 3)} />
        </section>
      )}
      <CtaBand />
    </>
  );
}
