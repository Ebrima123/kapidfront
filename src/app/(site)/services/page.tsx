import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Process } from "@/components/site/home";
import { CtaBand, PageHero, ServiceList } from "@/components/site/sections";
import { getServices, getSettings } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Services",
  description: "Interior and exterior painting and decorative finishes in The Gambia from Kapid Painting Company.",
};

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getServices(), getSettings()]);
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Painting and decorating services"
        intro="Interior and exterior painting and decorative finishes for homes, businesses and new builds across The Gambia."
      >
        <Link href="/contact#quote" className="btn btn-primary btn-lg">
          Get a free quote <ArrowRight className="size-4" aria-hidden />
        </Link>
      </PageHero>

      <section aria-label="All services" className="container-x section">
        <ServiceList services={services} />

        <div className="mt-14 grid gap-6 rounded-md bg-sand p-8 sm:p-10 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="heading-md">Not sure which service you need?</h2>
            <p className="mt-2 leading-relaxed text-muted">
              Choose “Not sure yet” on the quote form and describe the job in your own words.
            </p>
          </div>
          <Link href="/contact#quote" className="btn btn-dark btn-lg self-start md:self-auto">
            Describe your job <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>

      <Process />
      <CtaBand phone={settings.phone} />
    </>
  );
}
