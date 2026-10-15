import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Images } from "lucide-react";
import { SocialWork } from "@/components/site/home";
import { ProjectFilter } from "@/components/site/project-filter";
import { CtaBand, PageHero, ProjectGrid } from "@/components/site/sections";
import { getProjects, getSettings } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Our work",
  description: "Painting projects by Kapid Painting Company for homes, businesses and new builds in The Gambia.",
};

export default async function ProjectsPage() {
  const [projects, settings] = await Promise.all([getProjects(), getSettings()]);
  return (
    <>
      <PageHero
        eyebrow="Our work"
        title="Projects"
        intro="Browse painting jobs for homes, businesses and new builds. Filter by project type to see the kind of work you're planning."
      />
      <section className="container-x section space-y-12">
        {projects.length > 0 ? (
          // The filter reads ?type= from the URL, so it renders after the static shell.
          <Suspense fallback={<ProjectGrid projects={projects} />}>
            <ProjectFilter projects={projects} />
          </Suspense>
        ) : (
          <div className="card flex flex-col items-center px-6 py-14 text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-accent-50 text-accent-700">
              <Images className="size-6" aria-hidden />
            </span>
            <h2 className="mt-5 font-display text-2xl font-semibold">Our project gallery is being updated</h2>
            <p className="mt-2 max-w-md text-muted">
              Photos of recent jobs will appear here soon. In the meantime, you can see our latest work on social
              media or tell us about your own project.
            </p>
            <Link href="/contact#quote" className="btn btn-primary mt-6">
              Get a free quote <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        )}
        <SocialWork
          settings={settings}
          headingLevel="h2"
          title={projects.length > 0 ? "More of our work" : "See our latest work"}
        />
      </section>
      <CtaBand />
    </>
  );
}
