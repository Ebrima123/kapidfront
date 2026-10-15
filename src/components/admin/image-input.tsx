"use client";

/* eslint-disable @next/next/no-img-element -- previews of local files and Cloudinary media */
import { useId, useState } from "react";
import { ImagePlus, Loader2, RotateCcw, Upload } from "lucide-react";
import { compressImage } from "@/lib/compress-image";

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

/**
 * Image field with a live preview: shows the saved image, or the newly picked one
 * before saving. Supports drag-and-drop onto the preview, and Undo back to the
 * saved image. Large photos are shrunk before upload (see compressImage).
 */
export function ImageInput({
  id,
  label,
  value,
  onChange,
}: {
  id?: string;
  label: string;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const autoId = useId();
  const inputId = id ?? autoId;
  // The last saved value (a URL string or empty), so Undo can restore it. It moves
  // forward when a save hands back a new URL.
  const [original, setOriginal] = useState(value);
  if (typeof value === "string" && value !== original) setOriginal(value);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  const isNew = value instanceof File;
  const savedUrl = typeof value === "string" && value ? value : null;
  const src = isNew ? preview : savedUrl;

  async function pick(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    setBusy(true);
    try {
      const ready = await compressImage(file);
      setPreview((old) => {
        if (old) URL.revokeObjectURL(old);
        return URL.createObjectURL(ready);
      });
      onChange(ready);
    } finally {
      setBusy(false);
    }
  }

  function undo() {
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return null;
    });
    onChange(original);
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pick(e.dataTransfer.files?.[0]);
        }}
        className={`relative grid aspect-[4/3] w-full shrink-0 place-items-center overflow-hidden rounded-md border bg-sand sm:w-60 ${
          dragging ? "border-brand-500 ring-2 ring-brand-100" : "border-line"
        }`}
      >
        {src ? (
          <img src={src} alt={`Preview of ${label.toLowerCase()}`} className="size-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1.5 px-4 text-center text-sm text-muted">
            <ImagePlus className="size-6" aria-hidden />
            <span>No image yet</span>
            <span className="text-xs">Drop an image here</span>
          </div>
        )}
        {isNew && !busy && (
          <span className="absolute top-2 left-2 rounded-[3px] bg-accent-600 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-white uppercase">
            New
          </span>
        )}
        {busy && (
          <div className="absolute inset-0 grid place-items-center bg-paper/80 text-sm font-medium text-brand-900">
            <span className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" aria-hidden /> Preparing image…
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2.5 text-sm">
        <label htmlFor={inputId} className="btn btn-ghost btn-sm cursor-pointer">
          <Upload className="size-4" aria-hidden />
          {src ? "Replace image" : "Choose image"}
          <input
            id={inputId}
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={busy}
            onChange={(e) => {
              pick(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>

        {isNew ? (
          <div className="space-y-2">
            <p className="text-ink">
              <span className="font-semibold">New image:</span> {(value as File).name} · {formatSize((value as File).size)}
              <br />
              <span className="text-muted">It uploads when you save.</span>
            </p>
            <button type="button" onClick={undo} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline">
              <RotateCcw className="size-3.5" aria-hidden /> {original ? "Keep the current image" : "Remove selection"}
            </button>
          </div>
        ) : (
          <p className="text-muted">{src ? "Current image." : "No image uploaded."} You can also drop a file onto the preview.</p>
        )}
        <p className="text-xs text-muted">JPG, PNG or WebP. Large photos are resized automatically.</p>
      </div>
    </div>
  );
}
