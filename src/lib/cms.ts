import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { API_URL } from "./config";
import { DEFAULT_FAQS, DEFAULT_SERVICES, DEFAULT_SETTINGS, DEFAULT_TESTIMONIALS } from "./defaults";
import type { FAQ, Project, Service, SiteSettings, Testimonial } from "./types";

/** Tag on every CMS read; the admin proxy invalidates it after content edits. */
export const CMS_TAG = "cms";

async function getPublic<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}/api/public/${path}`);
    if (res.status === 404) return fallback;
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[cms] ${path} failed:`, err);
    return fallback;
  }
}

export async function getSettings(): Promise<SiteSettings> {
  "use cache";
  cacheTag(CMS_TAG);
  cacheLife("minutes");
  return { ...DEFAULT_SETTINGS, ...(await getPublic<Partial<SiteSettings>>("settings/", {})) };
}

export async function getServices(): Promise<Service[]> {
  "use cache";
  cacheTag(CMS_TAG);
  cacheLife("minutes");
  return getPublic("services/", DEFAULT_SERVICES);
}

export async function getService(slug: string): Promise<Service | null> {
  "use cache";
  cacheTag(CMS_TAG);
  cacheLife("minutes");
  return getPublic<Service | null>(`services/${encodeURIComponent(slug)}/`, null);
}

export async function getProjects(): Promise<Project[]> {
  "use cache";
  cacheTag(CMS_TAG);
  cacheLife("minutes");
  return getPublic<Project[]>("projects/", []);
}

export async function getProject(slug: string): Promise<Project | null> {
  "use cache";
  cacheTag(CMS_TAG);
  cacheLife("minutes");
  return getPublic<Project | null>(`projects/${encodeURIComponent(slug)}/`, null);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  "use cache";
  cacheTag(CMS_TAG);
  cacheLife("minutes");
  return getPublic("testimonials/", DEFAULT_TESTIMONIALS);
}

export async function getFaqs(): Promise<FAQ[]> {
  "use cache";
  cacheTag(CMS_TAG);
  cacheLife("minutes");
  return getPublic("faqs/", DEFAULT_FAQS);
}
