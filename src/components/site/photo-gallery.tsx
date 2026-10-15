"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { isLocal } from "@/components/ui/cover";

export type Photo = { id: number; image: string; caption: string };

/** Thumbnail grid that opens a full-screen viewer (arrow keys, swipe, Esc to close). */
export function PhotoGallery({ photos, title }: { photos: Photo[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const altFor = (p: Photo, i: number) => p.caption || `${title}, photo ${i + 1} of ${photos.length}`;

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);

  const step = (delta: number) => setIndex((i) => (i === null ? i : (i + delta + photos.length) % photos.length));

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((p, i) => (
          <li key={`${p.id}-${i}`}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block aspect-square w-full overflow-hidden rounded-xl bg-sand"
              aria-label={`Open photo ${i + 1} of ${photos.length}${p.caption ? `: ${p.caption}` : ""}`}
            >
              <Image
                src={p.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 50vw"
                quality={70}
                unoptimized={isLocal(p.image)}
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute right-2 bottom-2 grid size-8 place-items-center rounded-full bg-white/90 text-ink opacity-0 shadow transition group-hover:opacity-100 group-focus-visible:opacity-100">
                <Expand className="size-4" aria-hidden />
              </span>
            </button>
            {p.caption && <p className="mt-1.5 text-sm text-muted">{p.caption}</p>}
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={() => setIndex(null)}
        aria-label={`${title} photos`}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink/95 p-0 text-white backdrop:bg-ink/80"
      >
        {index !== null && (
          <div
            className="flex h-full flex-col"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
              touchX.current = null;
            }}
          >
            <div className="flex items-center justify-between p-3 sm:p-4">
              <p className="text-sm text-white/80" aria-live="polite">
                {index + 1} / {photos.length}
              </p>
              <button
                type="button"
                onClick={() => setIndex(null)}
                className="grid size-11 place-items-center rounded-full hover:bg-white/10"
                aria-label="Close photos"
                autoFocus
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="relative flex-1">
              <Image
                key={photos[index].image}
                src={photos[index].image}
                alt={altFor(photos[index], index)}
                fill
                sizes="100vw"
                quality={80}
                unoptimized={isLocal(photos[index].image)}
                className="object-contain"
              />
              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    className="absolute top-1/2 left-2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 hover:bg-white/25 sm:left-4"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="size-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    className="absolute top-1/2 right-2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 hover:bg-white/25 sm:right-4"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="size-6" />
                  </button>
                </>
              )}
            </div>
            <p className="min-h-14 px-4 py-4 text-center text-sm text-white/85">{photos[index].caption}</p>
          </div>
        )}
      </dialog>
    </>
  );
}
