import type { FieldDef, Option } from "./resource-form";

const opts = (...values: string[]): Option[] =>
  values.map((v) => ({ value: v, label: v.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase()) }));

export const LEAD_STATUSES = opts("new", "contacted", "quoted", "won", "lost");
export const JOB_STATUSES = opts("scheduled", "in_progress", "on_hold", "completed", "cancelled");
export const ESTIMATE_STATUSES = opts("draft", "sent", "accepted", "declined");
export const SOURCES = opts("website", "referral", "phone", "social", "other");

export const CUSTOMER_RELATION = {
  endpoint: "crm/customers",
  label: (r: Record<string, unknown>) =>
    `${r.full_name as string}${r.company ? ` (${r.company as string})` : ""}`,
};

export const LEAD_FIELDS: FieldDef[] = [
  { name: "name", label: "Name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone" },
  { name: "service", label: "Service" },
  { name: "status", label: "Status", type: "select", options: LEAD_STATUSES },
  { name: "source", label: "Source", type: "select", options: SOURCES },
  { name: "property_type", label: "Property", type: "select", options: opts("residential", "commercial") },
  { name: "preferred_date", label: "Preferred start", type: "date" },
  { name: "estimated_value", label: "Estimated value", type: "money" },
  { name: "address", label: "Address", full: true },
  { name: "message", label: "Message", type: "textarea" },
];

export const CUSTOMER_FIELDS: FieldDef[] = [
  { name: "first_name", label: "First name", required: true },
  { name: "last_name", label: "Last name" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone" },
  { name: "company", label: "Company" },
  { name: "source", label: "Source", type: "select", options: SOURCES },
  { name: "address", label: "Address", full: true },
  { name: "city", label: "City" },
  { name: "postcode", label: "Postcode" },
];

export const JOB_FIELDS: FieldDef[] = [
  { name: "title", label: "Job title", required: true, full: true },
  { name: "customer", label: "Customer", type: "relation", relation: CUSTOMER_RELATION, required: true },
  { name: "status", label: "Status", type: "select", options: JOB_STATUSES },
  { name: "start_date", label: "Start date", type: "date" },
  { name: "end_date", label: "End date", type: "date" },
  { name: "price", label: "Price", type: "money" },
  { name: "assigned_to", label: "Assigned to", placeholder: "Painter or crew" },
  { name: "address", label: "Site address", full: true },
  { name: "description", label: "Description", type: "textarea" },
];
