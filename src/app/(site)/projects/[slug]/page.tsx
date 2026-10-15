import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand, PageHero } from "@/components/site/sections";
import { Cover } from "@/components/ui/cover";
import { getProject } from "@/lib/cms";
import { date, label } from "@/lib/format";

export default function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  return (
    <Suspense fallback={<div className="container-x py-24 text-muted">Loading…</div>}>
      <ProjectDetail params={params} />
    </Suspense>
  );
}

async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <>
      <PageHero
        eyebrow={`${label(project.category)}${project.location ? ` · ${project.location}` : ""}`}
        title={project.title}
      />
      <section className="container-x py-12">
        <Cover
          src={project.cover_image}
          alt={project.title}
          swatch={project.category}
          className="aspect-[16/8] w-full rounded-3xl"
        />
        <div className="mt-10 grid gap-10 md:grid-cols-[2fr_1fr]">
          <p className="whitespace-pre-line text-ink/85">{project.description}</p>
          <dl className="card h-fit space-y-3 p-6 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Category</dt>
              <dd className="font-medium">{label(project.category)}</dd>
            </div>
            {project.location && (
              <div className="flex justify-between">
                <dt className="text-muted">Location</dt>
                <dd className="font-medium">{project.location}</dd>
              </div>
            )}
            {project.completed_on && (
              <div className="flex justify-between">
                <dt className="text-muted">Completed</dt>
                <dd className="font-medium">{date(project.completed_on)}</dd>
              </div>
            )}
          </dl>
        </div>
        {project.images.length > 0 && (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.images.map((img) => (
              <figure key={img.id}>
                <Cover src={img.image} alt={img.caption || project.title} className="aspect-square w-full rounded-2xl" />
                {img.caption && <figcaption className="mt-2 text-sm text-muted">{img.caption}</figcaption>}
              </figure>
            ))}
          </div>
        )}
        <Link href="/projects" className="mt-12 inline-block text-sm font-semibold text-brand-600 hover:underline">
          ← Back to all projects
        </Link>
      </section>
      <CtaBand />
    </>
  );
}
