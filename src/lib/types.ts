export type SiteSettings = {
  company_name: string;
  tagline: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string | null;
  about_title: string;
  about_body: string;
  about_image: string | null;
  phone: string;
  whatsapp_number: string;
  email: string;
  address: string;
  service_area: string;
  opening_hours: string;
  facebook_url: string;
  instagram_url: string;
  tiktok_url: string;
  years_experience: number;
  projects_completed: number;
};

export type Service = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string;
  icon: string;
  image: string | null;
  order: number;
  is_published: boolean;
};

export type ProjectCategory = "interior" | "exterior" | "commercial" | "new_build" | "cabinets" | "other";

export type ProjectImage = { id: number; project: number; image: string; caption: string; order: number };

export type Project = {
  id: number;
  slug: string;
  title: string;
  category: ProjectCategory;
  location: string;
  description: string;
  scope_of_work: string;
  cover_image: string | null;
  completed_on: string | null;
  is_featured: boolean;
  is_published: boolean;
  order: number;
  images: ProjectImage[];
};

export type Testimonial = {
  id: number;
  name: string;
  location: string;
  quote: string;
  rating: number;
  is_published: boolean;
  order: number;
};

export type FAQ = { id: number; question: string; answer: string; is_published: boolean; order: number };

export type LeadStatus = "new" | "contacted" | "quoted" | "won" | "lost";
export type JobStatus = "scheduled" | "in_progress" | "on_hold" | "completed" | "cancelled";
export type EstimateStatus = "draft" | "sent" | "accepted" | "declined";

export type Customer = {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  source: string;
  job_count?: number;
  created_at: string;
};

export type Lead = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  service: string;
  property_type: "residential" | "commercial";
  message: string;
  preferred_date: string | null;
  status: LeadStatus;
  source: string;
  estimated_value: string | null;
  customer: number | null;
  customer_name: string;
  created_at: string;
};

export type Job = {
  id: number;
  customer: number;
  customer_name: string;
  lead: number | null;
  title: string;
  description: string;
  address: string;
  status: JobStatus;
  start_date: string | null;
  end_date: string | null;
  price: string;
  assigned_to: string;
  created_at: string;
};

export type EstimateItem = {
  id?: number;
  description: string;
  quantity: string;
  unit_price: string;
  order?: number;
  line_total?: string;
};

export type Estimate = {
  id: number;
  number: string;
  customer: number | null;
  customer_name: string;
  lead: number | null;
  lead_name: string;
  job: number | null;
  title: string;
  status: EstimateStatus;
  issue_date: string | null;
  valid_until: string | null;
  tax_rate: string;
  notes: string;
  items: EstimateItem[];
  subtotal: string;
  tax: string;
  total: string;
  created_at: string;
};

export type Note = {
  id: number;
  customer: number | null;
  lead: number | null;
  job: number | null;
  body: string;
  author_name: string;
  created_at: string;
};

export type Paginated<T> = { count: number; next: string | null; previous: string | null; results: T[] };

export type Dashboard = {
  leads_by_status: Record<LeadStatus, number>;
  jobs_by_status: Record<JobStatus, number>;
  new_leads_this_month: number;
  customers: number;
  revenue_this_month: string;
  open_job_value: string;
  win_rate: number | null;
  recent_leads: Lead[];
  upcoming_jobs: Job[];
};
