"use client";

const MAX_EDGE = 2560; // px, plenty for full-width photos
const SKIP_BELOW = 1.5 * 1024 * 1024; // already small enough
const QUALITY = 0.85;

/**
 * Shrink a large photo in the browser before upload. Phone photos are often 3–8 MB,
 * and uploads pass through the website's server (Vercel rejects bodies over ~4.5 MB).
 * Small files, GIFs and SVGs are returned unchanged, as is anything that fails to decode.
 */
export async function compressImage(file: File): Promise<File> {
  if (file.size < SKIP_BELOW || !file.type.startsWith("image/") || /gif|svg/.test(file.type)) return file;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    // Keep transparency for PNG/WebP; photos become JPEG.
    const type = file.type === "image/png" || file.type === "image/webp" ? "image/webp" : "image/jpeg";
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, QUALITY));
    if (!blob || blob.size >= file.size) return file;

    const ext = type === "image/webp" ? "webp" : "jpg";
    const name = file.name.replace(/\.[^.]+$/, "") + "." + ext;
    return new File([blob], name, { type, lastModified: file.lastModified });
  } catch {
    return file;
  }
}
