import type { FAQ, Service, SiteSettings, Testimonial } from "./types";

/** Fallback copy so the public site still renders when the API is unreachable. */
export const DEFAULT_SETTINGS: SiteSettings = {
  company_name: "Kapid Painting",
  tagline: "Professional painting & decorating",
  hero_title: "Fresh paint. Flawless finish.",
  hero_subtitle: "Interior, exterior and commercial painting done right, on time and on budget.",
  hero_image: null,
  about_title: "About Kapid",
  about_body:
    "We are a team of experienced painters who care about the details: careful prep, clean lines and a tidy site when we leave.",
  about_image: null,
  phone: "",
  email: "",
  address: "",
  service_area: "",
  opening_hours: "",
  facebook_url: "",
  instagram_url: "",
  years_experience: 10,
  projects_completed: 500,
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
  s(2, "Exterior Painting", "home", "Weather-resistant coatings that protect and refresh your home."),
  s(3, "Commercial Painting", "building", "Offices, shops and rentals painted with minimal disruption."),
];

export const DEFAULT_TESTIMONIALS: Testimonial[] = [];
export const DEFAULT_FAQS: FAQ[] = [];
