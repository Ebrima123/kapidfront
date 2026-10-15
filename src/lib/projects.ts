import { label } from "./format";
import type { Project, ProjectCategory } from "./types";

/** Display order for filters; categories without projects are hidden. */
export const CATEGORY_ORDER: ProjectCategory[] = ["interior", "exterior", "new_build", "commercial", "cabinets", "other"];

export const categoryLabel = (c: string) => label(c);

/** Cover photo, or the first gallery photo when no cover was chosen. */
export const coverOf = (p: Project) => p.cover_image || p.images[0]?.image || null;

export const photosOf = (p: Project) => [
  ...(p.cover_image ? [{ id: 0, image: p.cover_image, caption: "" }] : []),
  ...p.images.map((i) => ({ id: i.id, image: i.image, caption: i.caption })),
];

export const scopeItems = (p: Project) =>
  p.scope_of_work
    .split(/\r?\n/)
    .map((s) => s.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);

/** Alt text built only from what the owner entered; never describes what isn't known. */
export const coverAlt = (p: Project) =>
  `${p.title}, ${categoryLabel(p.category).toLowerCase()} painting project${p.location ? ` in ${p.location}` : ""}`;

const SERVICE_FOR: Partial<Record<ProjectCategory, string>> = {
  interior: "Interior Painting",
  exterior: "Exterior & New Builds",
  new_build: "Exterior & New Builds",
  commercial: "Commercial Painting",
};

/** Quote link pre-filled to match the project type. */
export function quoteHrefFor(p: Project) {
  const params = new URLSearchParams();
  if (p.category === "commercial") params.set("type", "commercial");
  const service = SERVICE_FOR[p.category];
  if (service) params.set("service", service);
  const qs = params.toString();
  return `/contact${qs ? `?${qs}` : ""}#quote`;
}
