"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProjectCard } from "@/components/site/project-card";
import { CATEGORY_ORDER, categoryLabel } from "@/lib/projects";
import type { Project } from "@/lib/types";

/** Gallery grid with project-type filters. The filter lives in `?type=` so it can be shared. */
export function ProjectFilter({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const counts = new Map<string, number>();
  for (const p of projects) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  const categories = CATEGORY_ORDER.filter((c) => counts.has(c));

  const requested = params.get("type") ?? "all";
  const active = requested === "all" || counts.has(requested) ? requested : "all";
  const shown = active === "all" ? projects : projects.filter((p) => p.category === active);

  function select(type: string) {
    const next = new URLSearchParams(params);
    if (type === "all") next.delete("type");
    else next.set("type", type);
    const qs = next.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }

  const options = [{ value: "all", label: "All projects", count: projects.length }].concat(
    categories.map((c) => ({ value: c, label: categoryLabel(c), count: counts.get(c)! })),
  );

  return (
    <div>
      {categories.length > 1 && (
        <div
          role="group"
          aria-label="Filter projects by type"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              aria-pressed={active === o.value}
              onClick={() => select(o.value)}
              className={`btn btn-sm shrink-0 ${active === o.value ? "btn-dark" : "btn-ghost"}`}
            >
              {o.label}
              <span
                className={`rounded-[3px] px-1.5 text-[11px] ${active === o.value ? "bg-white/20" : "bg-sand text-muted"}`}
              >
                {o.count}
              </span>
            </button>
          ))}
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        Showing {shown.length} {shown.length === 1 ? "project" : "projects"}
        {active !== "all" ? ` of type ${categoryLabel(active)}` : ""}
      </p>

      <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <li key={p.id}>
            <ProjectCard project={p} headingLevel="h2" />
          </li>
        ))}
      </ul>
    </div>
  );
}
