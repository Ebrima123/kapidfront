import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PaintChips, SocialWork } from "@/components/site/home";
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
        intro="Painting jobs for homes, businesses and new builds. Filter by project type to see work like the job you're planning."
      />
      <section className="container-x section space-y-16">
        {projects.length > 0 ? (
          // The filter reads ?type= from the URL, so it renders after the static shell.
          <Suspense fallback={<ProjectGrid projects={projects} />}>
            <ProjectFilter projects={projects} />
          </Suspense>
        ) : (
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div>
              <h2 className="heading-lg">Our project gallery is being updated</h2>
              <p className="lede mt-5 max-w-lg">
                Photos of recent jobs will appear here soon. In the meantime, see our latest work on social media or
                tell us about your own project.
              </p>
              <Link href="/contact#quote" className="btn btn-primary btn-lg mt-8">
                Get a free quote <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <PaintChips />
          </div>
        )}
        <SocialWork
          settings={settings}
          headingLevel="h2"
          title={projects.length > 0 ? "More of our work" : "See our latest work"}
        />
      </section>
      <CtaBand phone={settings.phone} />
    </>
  );
}
