"use client";

import { ProjectGallery } from "@/components/admin/project-gallery";
import { ResourceManager } from "@/components/admin/resource-manager";
import { Cover } from "@/components/ui/cover";
import { label } from "@/lib/format";

const CATEGORIES = ["interior", "exterior", "commercial", "cabinets", "other"].map((v) => ({ value: v, label: label(v) }));

export default function ProjectsAdminPage() {
  return (
    <ResourceManager
      title="Projects"
      singular="Project"
      description="Your portfolio. Featured projects appear on the homepage."
      endpoint="cms/projects"
      defaults={{ is_published: true, is_featured: false, order: 0, category: "interior" }}
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "category", label: "Category", type: "select", options: CATEGORIES },
        { name: "location", label: "Location" },
        { name: "completed_on", label: "Completed on", type: "date" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "cover_image", label: "Cover image", type: "image", full: true },
        { name: "order", label: "Order", type: "number" },
        { name: "is_featured", label: "Featured", type: "checkbox", help: "Show on homepage" },
        { name: "is_published", label: "Visibility", type: "checkbox", help: "Published on the website" },
      ]}
      renderExtra={(row) => <ProjectGallery projectId={row.id} />}
      columns={[
        {
          key: "title",
          label: "Project",
          render: (r) => (
            <span className="flex items-center gap-3">
              <Cover src={r.cover_image as string | null} alt="" swatch={r.category as string} className="size-10 shrink-0 rounded-lg" />
              <span className="font-medium">{r.title as string}</span>
            </span>
          ),
        },
        { key: "category", label: "Category", render: (r) => label(r.category as string), className: "hidden sm:table-cell" },
        { key: "is_featured", label: "Featured", render: (r) => (r.is_featured ? "★" : ""), className: "hidden sm:table-cell" },
        { key: "is_published", label: "Status", render: (r) => (r.is_published ? "Published" : "Hidden") },
      ]}
    />
  );
}
