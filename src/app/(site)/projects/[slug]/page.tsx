import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Camera, Check, ChevronRight, MapPin, Tag } from "lucide-react";
import { PhotoGallery } from "@/components/site/photo-gallery";
import { ProjectCard } from "@/components/site/project-card";
import { Cover } from "@/components/ui/cover";
import { CtaBand } from "@/components/site/sections";
import { getProject, getProjects, getSettings } from "@/lib/cms";
import { date } from "@/lib/format";
import { categoryLabel, coverAlt, coverOf, photosOf, quoteHrefFor, scopeItems } from "@/lib/projects";

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) return { title: "Project not found" };
  const cover = coverOf(p);
  const description =
    p.description.split("\n")[0].slice(0, 160) ||
    `${categoryLabel(p.category)} painting project by Kapid Painting Company${p.location ? ` in ${p.location}` : ""}.`;
  return {
    title: p.title,
    description,
    openGraph: { title: p.title, description, images: cover ? [{ url: cover, alt: coverAlt(p) }] : undefined },
  };
}

export default function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  return (
    <Suspense fallback={<div className="container-x py-24 text-muted">Loading project…</div>}>
      <ProjectDetail params={params} />
    </Suspense>
  );
}

async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, all, settings] = await Promise.all([getProject(slug), getProjects(), getSettings()]);
  if (!project) notFound();

  const p = project;
  const cover = coverOf(p);
  const photos = photosOf(p);
  const scope = scopeItems(p);
  const type = categoryLabel(p.category);

  const position = all.findIndex((x) => x.id === p.id);
  const prev = position > 0 ? all[position - 1] : null;
  const next = position >= 0 && position < all.length - 1 ? all[position + 1] : null;
  const sameType = all.filter((x) => x.id !== p.id && x.category === p.category);
  const related = (sameType.length > 0 ? sameType : all.filter((x) => x.id !== p.id)).slice(0, 3);

  const facts = [
    { icon: Tag, term: "Project type", value: type },
    p.location && { icon: MapPin, term: "Location", value: p.location },
    p.completed_on && { icon: Calendar, term: "Completed", value: date(p.completed_on) },
    photos.length > 0 && { icon: Camera, term: "Photos", value: String(photos.length) },
  ].filter(Boolean) as { icon: typeof Tag; term: string; value: string }[];

  return (
    <article>
      <div className="bg-limewash-paper">
        <div className="container-x pt-6 pb-10 sm:pb-12">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link href="/projects" className="inline-flex items-center gap-1 py-1.5 font-medium text-ink hover:text-accent-700">
                  <ArrowLeft className="size-4" aria-hidden /> All projects
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-3.5" />
              </li>
              <li>
                <Link href={`/projects?type=${p.category}`} className="inline-block py-1.5 hover:text-accent-700">
                  {type}
                </Link>
              </li>
            </ol>
          </nav>
          <h1 className="heading-xl mt-6 max-w-4xl">{p.title}</h1>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/80">
            {facts.map(({ icon: Icon, term, value }) => (
              <li key={term} className="flex items-center gap-1.5">
                <Icon className="size-4 text-accent-700" aria-hidden />
                <span className="sr-only">{term}:</span> {value}
              </li>
            ))}
          </ul>
        </div>
        <div className="swatch-stripe" data-reveal="wipe" style={{ "--reveal-delay": "250ms" } as React.CSSProperties} aria-hidden />
      </div>

      <div className="container-x pt-8 sm:pt-10">
        <Cover
          src={cover}
          alt={coverAlt(p)}
          priority
          sizes="(min-width: 1152px) 1104px, 100vw"
          className="aspect-[4/3] w-full rounded-md sm:aspect-[16/8]"
          fallback={
            <div className={`swatch-${p.category} grid aspect-[4/3] w-full place-items-center rounded-md sm:aspect-[16/8]`}>
              <p className="rounded-[3px] bg-paper/90 px-4 py-2 text-sm font-medium text-ink">
                Photos of this project will be added soon.
              </p>
            </div>
          }
        />
      </div>

      <div className="container-x section grid gap-12 pt-10 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0 space-y-12">
          {p.description && (
            <section aria-labelledby="about-project">
              <h2 id="about-project" className="heading-md">About this project</h2>
              <div className="mt-4 max-w-prose text-lg whitespace-pre-line text-ink/85">{p.description}</div>
            </section>
          )}

          {scope.length > 0 && (
            <section aria-labelledby="work-done">
              <h2 id="work-done" className="heading-md">Work carried out</h2>
              <ul className="mt-5 grid border-t border-brand-900 sm:grid-cols-2 sm:gap-x-8">
                {scope.map((item) => (
                  <li key={item} className="flex items-start gap-3 border-b border-line py-4">
                    <Check className="mt-1 size-4 shrink-0 text-accent-600" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {!p.description && scope.length === 0 && (
            <p className="border-l-2 border-accent-600 py-1 pl-5 text-lg text-muted">
              A full write-up of this {type.toLowerCase()} project is on its way. Ask us about it when you request your
              quote.
            </p>
          )}

          {photos.length > 1 && (
            <section aria-labelledby="project-photos">
              <h2 id="project-photos" className="heading-md">
                Photos <span className="text-base font-normal text-muted">({photos.length})</span>
              </h2>
              <div className="mt-4">
                <PhotoGallery photos={photos} title={p.title} />
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-md bg-brand-900 p-7 text-white">
            <h2 className="font-display text-2xl">Planning a similar project?</h2>
            <p className="mt-2 text-sm text-white/80">
              Tell us about your {type.toLowerCase()} job and we&apos;ll send you a free, itemised quote.
            </p>
            <Link href={quoteHrefFor(p)} className="btn btn-primary mt-5 w-full">
              Get a free quote <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          {/* Facts already sit under the title; repeat them beside the content only on wide screens */}
          <dl className="hidden border-t border-brand-900 text-sm lg:block">
            {facts.map(({ term, value }) => (
              <div key={term} className="flex justify-between gap-4 border-b border-line py-3">
                <dt className="text-muted">{term}</dt>
                <dd className="text-right font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      {(prev || next) && (
        <nav aria-label="More projects" className="container-x">
          <div className="grid gap-3 border-y border-line py-6 sm:grid-cols-2">
            {prev ? (
              <Link href={`/projects/${prev.slug}`} className="group rounded-md p-3 hover:bg-paper">
                <span className="flex items-center gap-1 text-xs font-semibold tracking-wide text-muted uppercase">
                  <ArrowLeft className="size-3.5" aria-hidden /> Previous project
                </span>
                <span className="mt-1 block font-display text-xl text-brand-900 group-hover:text-accent-700">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={`/projects/${next.slug}`} className="group rounded-md p-3 text-right hover:bg-paper">
                <span className="flex items-center justify-end gap-1 text-xs font-semibold tracking-wide text-muted uppercase">
                  Next project <ArrowRight className="size-3.5" aria-hidden />
                </span>
                <span className="mt-1 block font-display text-xl text-brand-900 group-hover:text-accent-700">{next.title}</span>
              </Link>
            )}
          </div>
        </nav>
      )}

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="container-x section">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="related-heading" className="heading-md">
              {sameType.length > 0 ? `More ${type.toLowerCase()} projects` : "More of our work"}
            </h2>
            <Link href="/projects" className="inline-block py-1.5 text-sm font-semibold text-accent-700 hover:underline">
              View all projects <span aria-hidden>→</span>
            </Link>
          </div>
          <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <li key={r.id}>
                <ProjectCard project={r} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <CtaBand phone={settings.phone} />
    </article>
  );
}
