import type { Metadata } from "next";
import { ProjectFilter } from "@/components/site/project-filter";
import { CtaBand, PageHero } from "@/components/site/sections";
import { getProjects } from "@/lib/cms";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <>
      <PageHero
        eyebrow="Our work"
        title="Project gallery"
        intro="A selection of homes and businesses we've transformed recently."
      />
      <section className="container-x py-16">
        <ProjectFilter projects={projects} />
      </section>
      <CtaBand />
    </>
  );
}
