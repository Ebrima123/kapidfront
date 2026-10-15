import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PaintChips } from "@/components/site/home";
import { CtaBand, PageHero } from "@/components/site/sections";
import { Cover } from "@/components/ui/cover";
import { getService } from "@/lib/cms";

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: "Service not found" };
  return {
    title: service.title,
    description: `${service.summary} ${service.title} in The Gambia from Kapid Painting Company.`.slice(0, 160),
    openGraph: service.image ? { images: [{ url: service.image, alt: service.title }] } : undefined,
  };
}

export default function ServicePage({ params }: PageProps<"/services/[slug]">) {
  return (
    <Suspense fallback={<div className="container-x py-24 text-muted">Loading…</div>}>
      <ServiceDetail params={params} />
    </Suspense>
  );
}

async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  return (
    <>
      <PageHero eyebrow="Service" title={service.title} intro={service.summary} />
      <section className="container-x section grid items-center gap-10 md:grid-cols-2">
        <div>
          <Link
            href="/services"
            className="mb-6 inline-flex items-center gap-1 py-1.5 text-sm font-medium text-ink hover:text-accent-700"
          >
            <ArrowLeft className="size-4" aria-hidden /> All services
          </Link>
          {/* The summary is already in the page header, so only show a description when there is one. */}
          {service.description && (
            <div className="mb-6 space-y-4 text-lg whitespace-pre-line text-ink/85">{service.description}</div>
          )}
          <div className="flex flex-wrap gap-3">
            <Link href={`/contact?service=${encodeURIComponent(service.title)}#quote`} className="btn btn-primary btn-lg">
              Get a free quote <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link href="/projects" className="btn btn-outline btn-lg">
              See our work
            </Link>
          </div>
        </div>
        <Cover
          src={service.image}
          alt={`${service.title} by Kapid Painting Company`}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="aspect-[5/4] w-full rounded-[2rem]"
          fallback={<PaintChips />}
        />
      </section>
      <CtaBand />
    </>
  );
}
