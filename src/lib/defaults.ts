import type { FAQ, Service, SiteSettings, Testimonial } from "./types";

/** Fallback copy so the public site still renders when the API is unreachable. */
export const DEFAULT_SETTINGS: SiteSettings = {
  company_name: "Kapid Painting Company",
  tagline: "Excellence isn't built in one coat",
  hero_title: "For all the latest decorations.",
  hero_subtitle: "Painting and decorating for homes, new builds and businesses across The Gambia, inside and out.",
  hero_image: null,
  about_title: "Kapid Company, the only solution",
  about_body:
    "Kapid Painting Company is a Gambian painting and decorating team. From fresh interiors to the exterior finish on new multi-storey buildings, our crews bring careful prep, clean lines and the latest decorative styles to every job.\n\nExcellence isn't built in one coat, so we take the time to do it properly.",
  about_image: null,
  phone: "",
  email: "",
  address: "",
  service_area: "The Gambia",
  opening_hours: "",
  facebook_url: "https://www.facebook.com/kaddijatou.sbah.3",
  instagram_url: "",
  tiktok_url: "https://www.tiktok.com/@kapidpaints",
  years_experience: 0,
  projects_completed: 0,
};

const s = (id: number, title: string, icon: string, summary: string): Service => ({
  id,
  slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  title,
  icon,
  summary,
  description: "",
  image: null,
  order: id,
  is_published: true,
});

export const DEFAULT_SERVICES: Service[] = [
  s(1, "Interior Painting", "brush", "Walls, ceilings, trim and doors with crisp lines and durable finishes."),
  s(2, "Exterior & New Builds", "home", "Weather-resistant finishes for homes and new multi-storey buildings."),
  s(3, "Decorative Finishes", "sparkles", "The latest decorative styles: feature walls, textures and accent colours."),
];

export const DEFAULT_TESTIMONIALS: Testimonial[] = [];
export const DEFAULT_FAQS: FAQ[] = [];
