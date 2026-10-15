import Link from "next/link";
import { Camera, ImageOff, MapPin } from "lucide-react";
import { Cover } from "@/components/ui/cover";
import { categoryLabel, coverAlt, coverOf, photosOf } from "@/lib/projects";
import type { Project } from "@/lib/types";

export function ProjectCard({ project: p, headingLevel: H = "h3" }: { project: Project; headingLevel?: "h2" | "h3" }) {
  const cover = coverOf(p);
  const photos = photosOf(p).length;
  return (
    <Link
      href={`/projects/${p.slug}`}
      className="group block rounded-2xl focus-visible:outline-offset-4"
    >
      <div className="relative overflow-hidden rounded-2xl">
        <Cover
          src={cover}
          alt={coverAlt(p)}
          swatch={p.category}
          className="aspect-[4/3] w-full"
          imgClassName="transition duration-500 group-hover:scale-105"
          fallback={
            <div className={`swatch-${p.category} grid aspect-[4/3] w-full place-items-center`}>
              <span className="flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-ink">
                <ImageOff className="size-3.5" aria-hidden /> Photos coming soon
              </span>
            </div>
          }
        />
        <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-ink shadow-sm">
          {categoryLabel(p.category)}
        </span>
        {photos > 1 && (
          <span className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full bg-ink/75 px-2.5 py-1 text-xs font-medium text-white">
            <Camera className="size-3.5" aria-hidden /> {photos} photos
          </span>
        )}
      </div>
      <H className="mt-3 font-semibold text-balance group-hover:text-accent-700">{p.title}</H>
      {p.location && (
        <p className="mt-1 flex items-center gap-1 text-sm text-muted">
          <MapPin className="size-3.5" aria-hidden /> {p.location}
        </p>
      )}
    </Link>
  );
}
