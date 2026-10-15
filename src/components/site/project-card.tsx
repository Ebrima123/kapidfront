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
      className="group block rounded-md focus-visible:outline-offset-4"
    >
      <div className="relative overflow-hidden rounded-md">
        <Cover
          src={cover}
          alt={coverAlt(p)}
          swatch={p.category}
          className="aspect-[4/3] w-full"
          imgClassName="transition duration-700 group-hover:scale-[1.03]"
          fallback={
            <div className={`swatch-${p.category} grid aspect-[4/3] w-full place-items-center`}>
              <span className="flex items-center gap-1.5 rounded-[3px] bg-paper/90 px-3 py-1.5 text-xs font-medium text-ink">
                <ImageOff className="size-3.5" aria-hidden /> Photos coming soon
              </span>
            </div>
          }
        />
        <span className="absolute top-3 left-3 rounded-[3px] bg-paper px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em] text-brand-900 uppercase">
          {categoryLabel(p.category)}
        </span>
        {photos > 1 && (
          <span className="absolute right-3 bottom-3 flex items-center gap-1 rounded-[3px] bg-brand-950/80 px-2.5 py-1 text-xs font-medium text-white">
            <Camera className="size-3.5" aria-hidden /> {photos} photos
          </span>
        )}
      </div>
      <H className="mt-4 font-display text-xl leading-snug font-medium text-brand-900 group-hover:text-accent-700">{p.title}</H>
      {p.location && (
        <p className="mt-1 flex items-center gap-1 text-sm text-muted">
          <MapPin className="size-3.5" aria-hidden /> {p.location}
        </p>
      )}
    </Link>
  );
}
