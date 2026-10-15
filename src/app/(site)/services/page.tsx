import type { Metadata } from "next";
import { CtaBand, PageHero, ServiceGrid } from "@/components/site/sections";
import { getServices } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Services",
  description: "Interior and exterior painting and decorative finishes in The Gambia from Kapid Painting Company.",
};

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Painting and decorating services"
        intro="Interior and exterior painting and decorative finishes for homes, businesses and new builds across The Gambia."
      />
      <section className="container-x section">
        <h2 className="sr-only">All services</h2>
        <ServiceGrid services={services} />
      </section>
      <CtaBand />
    </>
  );
}
