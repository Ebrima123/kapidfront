import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PaintChips, Process } from "@/components/site/home";
import { CtaBand } from "@/components/site/sections";
import { Cover } from "@/components/ui/cover";
import { getService, getServices, getSettings } from "@/lib/cms";

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
  const [service, all, settings] = await Promise.all([getService(slug), getServices(), getSettings()]);
  if (!service) notFound();
  const others = all.filter((s) => s.id !== service.id);
  const quoteHref = `/contact?service=${encodeURIComponent(service.title)}#quote`;

  return (
    <>
      <section className="bg-limewash-paper">
        <div className="container-x grid gap-12 pt-8 pb-14 sm:pb-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
          <div>
            <nav aria-label="Breadcrumb">
              <Link href="/services" className="inline-flex items-center gap-1.5 py-1.5 text-sm font-medium text-muted hover:text-brand-900">
                <ArrowLeft className="size-4" aria-hidden /> All services
              </Link>
            </nav>
            <p className="eyebrow mt-8">Service</p>
            <h1 className="heading-xl mt-6">{service.title}</h1>
            <p className="lede mt-6 max-w-xl">{service.summary}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={quoteHref} className="btn btn-primary btn-lg">
                Get a free quote <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link href="/projects" className="btn btn-outline btn-lg">
                See our work
              </Link>
            </div>
          </div>
          <Cover
            src={service.image}
            alt={`${service.title} by ${settings.company_name}`}
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="aspect-[5/4] w-full rounded-md"
            fallback={<PaintChips />}
          />
        </div>
        <div className="swatch-stripe" data-reveal="wipe" style={{ "--reveal-delay": "250ms" } as React.CSSProperties} aria-hidden />
      </section>

      <section className="container-x section grid gap-14 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
        <div>
          {/* Only the owner's own description is shown; nothing is filled in when it's missing. */}
          {service.description ? (
            <>
              <h2 className="heading-md">About this service</h2>
              <div className="mt-5 max-w-prose text-lg leading-relaxed whitespace-pre-line text-ink/85">
                {service.description}
              </div>
            </>
          ) : (
            <>
              <h2 className="heading-md">Planning {service.title.toLowerCase()}?</h2>
              <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink/85">
                Tell us about the property and the areas you want painted. We&apos;ll come back to you with a free,
                itemised quote for the work.
              </p>
            </>
          )}
          <Link href={quoteHref} className="link-arrow mt-6">
            Request a quote for {service.title.toLowerCase()} <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        {others.length > 0 && (
          <aside aria-labelledby="other-services">
            <h2 id="other-services" className="font-sans text-xs font-semibold tracking-[0.16em] text-brand-600 uppercase">
              Other services
            </h2>
            <ul className="mt-4 border-t border-brand-900">
              {others.map((o) => (
                <li key={o.id} className="border-b border-line">
                  <Link
                    href={`/services/${o.slug}`}
                    className="group flex items-center justify-between gap-4 py-4 font-display text-xl text-brand-900 hover:text-accent-700"
                  >
                    {o.title}
                    <ArrowRight className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent-700" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </section>

      <Process />
      <CtaBand phone={settings.phone} />
    </>
  );
}
