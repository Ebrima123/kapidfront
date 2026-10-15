"use client";

/* eslint-disable @next/next/no-img-element -- previews of local files and Cloudinary media */
import { useState } from "react";
import { AlertCircle, ImagePlus, Loader2, Trash2, Upload, X } from "lucide-react";
import { api } from "@/lib/api-client";
import { compressImage } from "@/lib/compress-image";
import type { ProjectImage } from "@/lib/types";
import { useApi } from "@/lib/use-api";
import { ErrorBox } from "./ui";

/** A photo picked for upload, previewed straight away while it uploads. */
type Pending = { key: string; url: string; name: string; status: "waiting" | "uploading" | "failed"; error?: string };

export function ProjectGallery({ projectId }: { projectId: number }) {
  const { data, error, reload } = useApi<ProjectImage[] | { results: ProjectImage[] }>("cms/project-images", {
    project: projectId,
    page_size: 200,
  });
  const images = Array.isArray(data) ? data : (data?.results ?? []);
  const [pending, setPending] = useState<Pending[]>([]);
  const [dragging, setDragging] = useState(false);
  const uploading = pending.some((p) => p.status !== "failed");

  const update = (key: string, patch: Partial<Pending>) =>
    setPending((list) => list.map((p) => (p.key === key ? { ...p, ...patch } : p)));
  const discard = (key: string) =>
    setPending((list) => {
      const item = list.find((p) => p.key === key);
      if (item) URL.revokeObjectURL(item.url);
      return list.filter((p) => p.key !== key);
    });

  async function upload(fileList: FileList | File[]) {
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;
    // Show every selected photo immediately, then upload them one by one.
    const queued: Pending[] = files.map((f, i) => ({
      key: `${Date.now()}-${i}-${f.name}`,
      url: URL.createObjectURL(f),
      name: f.name,
      status: "waiting",
    }));
    setPending((list) => [...list.filter((p) => p.status === "failed"), ...queued]);

    for (const [i, original] of files.entries()) {
      const item = queued[i];
      update(item.key, { status: "uploading" });
      try {
        const file = await compressImage(original);
        const form = new FormData();
        form.append("project", String(projectId));
        form.append("image", file);
        form.append("order", String(images.length + i));
        await api("cms/project-images", { method: "POST", form });
        discard(item.key); // it now appears in the saved photos below
        reload();
      } catch (e) {
        update(item.key, { status: "failed", error: (e as Error).message });
      }
    }
  }

  async function remove(id: number) {
    if (!confirm("Remove this photo?")) return;
    await api(`cms/project-images/${id}`, { method: "DELETE" });
    reload();
  }

  const failed = pending.filter((p) => p.status === "failed");

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        upload(e.dataTransfer.files);
      }}
      className={`rounded-md transition-shadow ${dragging ? "ring-2 ring-brand-100 ring-offset-4" : ""}`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-semibold">Gallery photos</h3>
        <label className="btn btn-ghost btn-sm cursor-pointer">
          {uploading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Upload className="size-4" aria-hidden />}
          {uploading ? "Uploading…" : "Add photos"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => {
              if (e.target.files?.length) upload(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      {error && <ErrorBox message={error} />}
      {failed.length > 0 && (
        <div className="mb-3">
          <ErrorBox message={`${failed.length} photo${failed.length === 1 ? "" : "s"} didn't upload: ${failed[0].error}`} />
        </div>
      )}

      {images.length === 0 && pending.length === 0 ? (
        <div className="grid place-items-center gap-1.5 rounded-md border border-dashed border-line bg-sand/50 px-4 py-10 text-center text-sm text-muted">
          <ImagePlus className="size-6" aria-hidden />
          <span>No gallery photos yet</span>
          <span className="text-xs">Choose “Add photos” or drop images here</span>
        </div>
      ) : (
        <>
          {images.length > 0 && (
            <p className="mb-2 text-xs text-muted">
              Add a short caption to each photo (e.g. “Living room after painting”). Captions are shown on the site and
              read aloud by screen readers.
            </p>
          )}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" aria-live="polite">
            {pending.map((p) => (
              <div key={p.key}>
                <div className="relative overflow-hidden rounded-lg">
                  <img src={p.url} alt={`Preview of ${p.name}`} className="aspect-square w-full object-cover" />
                  <div
                    className={`absolute inset-0 flex flex-col items-center justify-center gap-1 text-xs font-semibold ${
                      p.status === "failed" ? "bg-red-900/60 text-white" : "bg-ink/45 text-white"
                    }`}
                  >
                    {p.status === "failed" ? (
                      <AlertCircle className="size-5" aria-hidden />
                    ) : (
                      <Loader2 className={`size-5 ${p.status === "uploading" ? "animate-spin" : "opacity-60"}`} aria-hidden />
                    )}
                    {p.status === "waiting" ? "Waiting" : p.status === "uploading" ? "Uploading" : "Failed"}
                  </div>
                  {p.status === "failed" && (
                    <button
                      type="button"
                      onClick={() => discard(p.key)}
                      className="absolute top-1 right-1 rounded-md bg-white/90 p-1 text-ink shadow"
                      aria-label={`Dismiss ${p.name}`}
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
                <p className="mt-1.5 truncate text-xs text-muted">{p.name}</p>
              </div>
            ))}

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
