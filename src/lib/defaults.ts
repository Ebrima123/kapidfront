import type { FAQ, Service, SiteSettings, Testimonial } from "./types";

/** Fallback copy so the public site still renders when the API is unreachable. */
export const DEFAULT_SETTINGS: SiteSettings = {
  company_name: "Kapid Painting Company",
  tagline: "Excellence isn't built in one coat",
  hero_title: "Professional painting for homes, businesses and new builds",
  hero_subtitle:
    "Interior and exterior painting and decorative finishes across The Gambia. Tell us about your project and we'll prepare a free, itemised quote.",
  hero_image: null,
  about_title: "About Kapid Painting Company",
  about_body:
    "Kapid Painting Company is a painting and decorating business in The Gambia. We paint interiors and exteriors for homeowners, businesses and new-build projects, and offer decorative finishes for clients who want more than a plain wall.\n\nOur motto is simple: excellence isn't built in one coat.",
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
  s(2, "Exterior & New Builds", "home", "Exterior painting for homes and finishing work on new buildings."),
  s(3, "Decorative Finishes", "sparkles", "Feature walls, textures and accent colours for a distinctive look."),
];

export const DEFAULT_TESTIMONIALS: Testimonial[] = [];
export const DEFAULT_FAQS: FAQ[] = [];
