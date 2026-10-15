"use client";

import { useState } from "react";
import { ProjectGrid } from "@/components/site/sections";
import { label } from "@/lib/format";
import type { Project } from "@/lib/types";

export function ProjectFilter({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState("all");
  const categories = ["all", ...new Set(projects.map((p) => p.category))];
  const shown = category === "all" ? projects : projects.filter((p) => p.category === category);

  return (
    <>
      {categories.length > 2 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`btn btn-sm ${c === category ? "btn-dark" : "btn-ghost"}`}
            >
              {c === "all" ? "All" : label(c)}
            </button>
          ))}
        </div>
      )}
      <ProjectGrid projects={shown} />
    </>
  );
}
