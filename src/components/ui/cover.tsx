"use client";

import Image from "next/image";
import { useState } from "react";

// Next.js refuses to optimise images from local addresses, so dev media is passed through as-is.
export const isLocal = (src: string) => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(src);

/**
 * CMS image, served through Next.js image optimisation (resized, modern formats,
 * lazy-loaded). Falls back to a paint-swatch gradient, or `fallback`, when no image
 * was uploaded or the file is missing (e.g. media lost on a redeploy).
 *
 * The wrapper sets the box size via `className` (e.g. aspect ratio + width); the image fills it.
 */
export function Cover({
  src,
  alt,
  swatch = "other",
  className = "",
  imgClassName = "",
  priority = false,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  fallback,
}: {
  src: string | null | undefined;
  alt: string;
  swatch?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
  /** Rendered instead of the swatch when there is no usable image. */
  fallback?: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return fallback ?? <div role="img" aria-label={alt} className={`swatch-${swatch} ${className}`} />;
  }
  return (
    <div className={`relative overflow-hidden bg-sand ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={70}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        unoptimized={isLocal(src)}
        className={`object-cover ${imgClassName}`}
        onError={() => setFailed(true)}
        // A server-rendered <img> can fail before hydration attaches onError; catch that on mount.
        ref={(el) => {
          if (el?.complete && el.naturalWidth === 0) setFailed(true);
        }}
      />
    </div>
  );
}
