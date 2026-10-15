"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { ProjectGallery } from "@/components/admin/project-gallery";
import { ResourceManager } from "@/components/admin/resource-manager";
import { Cover } from "@/components/ui/cover";
import { label } from "@/lib/format";
import { CATEGORY_ORDER } from "@/lib/projects";

const CATEGORIES = CATEGORY_ORDER.map((v) => ({ value: v, label: label(v) }));

type Row = Record<string, unknown>;

/** What a project page needs to look complete; shown to the owner while editing. */
function checklist(r: Row) {
  const images = (r.images as unknown[] | undefined)?.length ?? 0;
  return [
    { done: Boolean(r.cover_image) || images > 0, text: "Cover photo", required: true },
    { done: images >= 2, text: "At least 2 gallery photos (with captions)", required: true },
    { done: Boolean(r.description), text: "Description of the job", required: true },
    { done: Boolean(r.scope_of_work), text: "Work carried out", required: true },
    { done: Boolean(r.location), text: "Location (town or area only)", required: false },
    { done: Boolean(r.completed_on), text: "Completion date", required: false },
  ];
}

function Checklist({ row }: { row: Row }) {
  const items = checklist(row);
  const missing = items.filter((i) => i.required && !i.done).length;
  return (
    <div className="mb-6 rounded-xl border border-line bg-cream p-4">
      <p className="text-sm font-semibold">
        {missing === 0 ? "This project page is complete." : `Project page checklist: ${missing} recommended item${missing === 1 ? "" : "s"} missing`}
      </p>
      <p className="mt-0.5 text-xs text-muted">Based on the last save. Only add real details from the job.</p>
      <ul className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
        {items.map((i) => (
          <li key={i.text} className={`flex items-center gap-2 ${i.done ? "text-ink" : "text-muted"}`}>
            {i.done ? (
              <CheckCircle2 className="size-4 text-emerald-600" aria-hidden />
            ) : (
              <Circle className="size-4" aria-hidden />
            )}
            {i.text}
            {!i.required && <span className="text-xs">(optional)</span>}
            <span className="sr-only">{i.done ? "done" : "missing"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProjectsAdminPage() {
  return (
    <ResourceManager
      title="Projects"
      singular="Project"
      description="Your portfolio. Featured projects appear on the homepage. Use real photos and details from each job."
      endpoint="cms/projects"
      defaults={{ is_published: true, is_featured: false, order: 0, category: "interior" }}
      fields={[
        { name: "title", label: "Title", required: true, help: "e.g. “Three-bedroom house interior”" },
        { name: "category", label: "Project type", type: "select", options: CATEGORIES },
        { name: "location", label: "Location", help: "Town or area only; no street addresses" },
        { name: "completed_on", label: "Completed on", type: "date" },
        { name: "description", label: "Description", type: "textarea", help: "What the job was and what the client wanted" },
        {
          name: "scope_of_work",
          label: "Work carried out",
          type: "textarea",
          help: "One item per line, e.g. “Exterior walls, two coats” or “Feature wall in living room”",
        },
        { name: "cover_image", label: "Cover photo", type: "image", full: true, help: "Shown on the gallery card and at the top of the page" },
        { name: "order", label: "Order", type: "number" },
        { name: "is_featured", label: "Featured", type: "checkbox", help: "Show on homepage" },
        { name: "is_published", label: "Visibility", type: "checkbox", help: "Published on the website" },
      ]}
      renderExtra={(row) => (
        <>
          <Checklist row={row} />
          <ProjectGallery projectId={row.id} />
        </>
      )}
      columns={[
        {
          key: "title",
          label: "Project",
          render: (r) => (
            <span className="flex items-center gap-3">
              <Cover src={r.cover_image as string | null} alt="" swatch={r.category as string} className="size-10 shrink-0 rounded-lg" sizes="40px" />
              <span className="font-medium">{r.title as string}</span>
            </span>
          ),
        },
        { key: "category", label: "Type", render: (r) => label(r.category as string), className: "hidden sm:table-cell" },
        {
          key: "complete",
          label: "Page",
          className: "hidden md:table-cell",
          render: (r) => {
            const missing = checklist(r).filter((i) => i.required && !i.done).length;
            return missing === 0 ? (
              <span className="text-emerald-700">Complete</span>
            ) : (
              <span className="text-muted">{missing} to add</span>
            );
          },
        },
        { key: "is_featured", label: "Featured", render: (r) => (r.is_featured ? "★" : ""), className: "hidden sm:table-cell" },
        { key: "is_published", label: "Status", render: (r) => (r.is_published ? "Published" : "Hidden") },
      ]}
    />
  );
}
