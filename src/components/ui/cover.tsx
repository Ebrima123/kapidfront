/* eslint-disable @next/next/no-img-element -- media is served by the Django API host */

/** Image from the CMS, or a paint-swatch gradient when none has been uploaded. */
export function Cover({
  src,
  alt,
  swatch = "other",
  className = "",
}: {
  src: string | null | undefined;
  alt: string;
  swatch?: string;
  className?: string;
}) {
  if (!src) return <div role="img" aria-label={alt} className={`swatch-${swatch} ${className}`} />;
  return <img src={src} alt={alt} className={`object-cover ${className}`} loading="lazy" />;
}
