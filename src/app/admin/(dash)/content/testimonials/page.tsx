"use client";

import { ResourceManager } from "@/components/admin/resource-manager";

export default function TestimonialsAdminPage() {
  return (
    <ResourceManager
      title="Testimonials"
      singular="Testimonial"
      description="Customer reviews shown on the homepage and about page."
      endpoint="cms/testimonials"
      defaults={{ is_published: true, order: 0, rating: 5 }}
      fields={[
        { name: "name", label: "Customer name", required: true },
        { name: "location", label: "Location" },
        { name: "quote", label: "Review", type: "textarea", required: true },
        {
          name: "rating",
          label: "Rating",
          type: "select",
          options: [5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: "★".repeat(n) })),
        },
        { name: "order", label: "Order", type: "number" },
        { name: "is_published", label: "Visibility", type: "checkbox", help: "Published on the website" },
      ]}
      columns={[
        { key: "name", label: "Name", render: (r) => <span className="font-medium">{r.name as string}</span> },
        {
          key: "quote",
          label: "Review",
          className: "hidden md:table-cell text-muted",
          render: (r) => <span className="line-clamp-1">{r.quote as string}</span>,
        },
        { key: "rating", label: "Rating", render: (r) => "★".repeat(Number(r.rating)) },
        { key: "is_published", label: "Status", render: (r) => (r.is_published ? "Published" : "Hidden") },
      ]}
    />
  );
}
