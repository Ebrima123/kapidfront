"use client";

/* eslint-disable @next/next/no-img-element -- media is served by the API host */
import { useState } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";
import { api } from "@/lib/api-client";
import type { ProjectImage } from "@/lib/types";
import { useApi } from "@/lib/use-api";
import { ErrorBox } from "./ui";

export function ProjectGallery({ projectId }: { projectId: number }) {
  const { data, error, reload } = useApi<ProjectImage[] | { results: ProjectImage[] }>("cms/project-images", {
    project: projectId,
    page_size: 200,
  });
  const images = Array.isArray(data) ? data : (data?.results ?? []);
  const [uploading, setUploading] = useState(false);

  async function upload(files: FileList) {
    setUploading(true);
    try {
      for (const [i, file] of Array.from(files).entries()) {
        const form = new FormData();
        form.append("project", String(projectId));
        form.append("image", file);
        form.append("order", String(images.length + i));
        await api("cms/project-images", { method: "POST", form });
      }
      reload();
    } finally {
      setUploading(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Remove this photo?")) return;
    await api(`cms/project-images/${id}`, { method: "DELETE" });
    reload();
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">Gallery photos</h3>
        <label className="btn btn-ghost btn-sm cursor-pointer">
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          Add photos
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            disabled={uploading}
            onChange={(e) => e.target.files?.length && upload(e.target.files)}
          />
        </label>
      </div>
      {error && <ErrorBox message={error} />}
      {images.length === 0 ? (
        <p className="text-sm text-muted">No gallery photos yet.</p>
      ) : (
        <>
          <p className="mb-2 text-xs text-muted">
            Add a short caption to each photo (e.g. “Living room after painting”). Captions are shown on the site and
            read aloud by screen readers.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((img, i) => (
              <div key={img.id} className="group">
                <div className="relative">
                  <img src={img.image} alt={img.caption} className="aspect-square w-full rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={() => remove(img.id)}
                    className="absolute top-1 right-1 rounded-md bg-white/90 p-1 text-red-600 shadow sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
                    aria-label={`Remove photo ${i + 1}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
                <input
                  className="input mt-1.5 px-2 py-1 text-xs"
                  defaultValue={img.caption}
                  placeholder="Caption"
                  aria-label={`Caption for photo ${i + 1}`}
                  onBlur={(e) => {
                    const caption = e.target.value.trim();
                    if (caption !== img.caption) {
                      api(`cms/project-images/${img.id}`, { method: "PATCH", json: { caption } }).then(reload);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
