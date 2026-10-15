"use client";

import { ResourceManager } from "@/components/admin/resource-manager";
import { ServiceIcon, SERVICE_ICONS } from "@/components/ui/icon";

export default function ServicesAdminPage() {
  return (
    <ResourceManager
      title="Services"
      singular="Service"
      description="The services listed on the website. Lower order numbers show first."
      endpoint="cms/services"
      paginated={false}
      defaults={{ is_published: true, order: 0, icon: "brush" }}
      fields={[
        { name: "title", label: "Title", required: true },
        {
          name: "icon",
          label: "Icon",
          type: "select",
          options: Object.keys(SERVICE_ICONS).map((k) => ({ value: k, label: k })),
        },
        { name: "summary", label: "Short summary", required: true, full: true },
        { name: "description", label: "Full description", type: "textarea" },
        { name: "image", label: "Image", type: "image", full: true },
        { name: "order", label: "Order", type: "number" },
        { name: "is_published", label: "Visibility", type: "checkbox", help: "Published on the website" },
      ]}
      columns={[
        {
          key: "title",
          label: "Service",
          render: (r) => (
            <span className="flex items-center gap-2 font-medium">
              <ServiceIcon name={r.icon as string} className="size-4 text-accent-600" /> {r.title as string}
            </span>
          ),
        },
        { key: "summary", label: "Summary", className: "hidden md:table-cell text-muted" },
        { key: "order", label: "Order", className: "hidden sm:table-cell" },
        { key: "is_published", label: "Status", render: (r) => (r.is_published ? "Published" : "Hidden") },
      ]}
    />
  );
}
