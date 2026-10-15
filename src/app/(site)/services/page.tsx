import type { Metadata } from "next";
import { CtaBand, PageHero, ServiceGrid } from "@/components/site/sections";
import { getServices } from "@/lib/cms";

export const metadata: Metadata = { title: "Services" };

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Everything you need for a perfect finish"
        intro="From a single feature wall to a full commercial repaint, we handle prep, painting and clean-up."
      />
      <section className="container-x py-16">
        <ServiceGrid services={services} />
      </section>
      <CtaBand />
    </>
  );
}
