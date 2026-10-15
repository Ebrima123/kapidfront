import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand, PageHero } from "@/components/site/sections";
import { Cover } from "@/components/ui/cover";
import { getService } from "@/lib/cms";

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
      <section className="container-x grid gap-10 py-16 md:grid-cols-2">
        <div className="space-y-4 whitespace-pre-line text-ink/85">
          {service.description || service.summary}
          <div className="pt-4">
            <Link href={`/contact?service=${encodeURIComponent(service.title)}#quote`} className="btn btn-primary">
              Get a quote for {service.title.toLowerCase()}
            </Link>
          </div>
        </div>
        <Cover src={service.image} alt={service.title} swatch="interior" className="aspect-[4/3] w-full rounded-2xl" />
      </section>
      <CtaBand />
    </>
  );
}
