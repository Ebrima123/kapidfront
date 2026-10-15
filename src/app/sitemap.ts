import type { MetadataRoute } from "next";
import { getProjects, getServices } from "@/lib/cms";
import { SITE_URL } from "@/lib/config";

/** Public pages plus every published service and project from the CMS. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, projects] = await Promise.all([getServices(), getProjects()]);
  const page = (path: string, priority: number) => ({ url: `${SITE_URL}${path}`, priority });
  return [
    page("/", 1),
    page("/contact", 0.9),
    page("/services", 0.8),
    page("/projects", 0.8),
    page("/about", 0.6),
    ...services.map((s) => page(`/services/${s.slug}`, 0.7)),
    ...projects.map((p) => page(`/projects/${p.slug}`, 0.6)),
  ];
}
