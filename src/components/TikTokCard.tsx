"use client";

import { useState } from "react";
import { tiktokPlayerUrl } from "@/lib/tiktok";
import { Play } from "./icons";

/** Click-to-load TikTok player: no TikTok scripts or cookies load until the visitor presses play. */
export function TikTokCard({ videoId, title, coverImage, url }: { videoId: string; title: string; coverImage?: string; url: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-burgundy">
        {playing ? (
          <iframe src={tiktokPlayerUrl(videoId)} title={title || "TikTok video"} allow="autoplay; encrypted-media; fullscreen" className="absolute inset-0 h-full w-full border-0" />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-4 p-5 text-center" aria-label={`Play video: ${title || "TikTok video"}`}>
            {coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" loading="lazy" />
            ) : (
              <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#6b3542,transparent_60%)]" />
            )}
            <span className="relative grid size-16 place-items-center rounded-full bg-gold text-charcoal shadow-lg transition-transform group-hover:scale-110">
              <Play className="ml-1 size-7" />
            </span>
            {!coverImage && title && <span className="relative line-clamp-4 font-serif text-lg text-white">{title}</span>}
          </button>
        )}
      </div>
      <figcaption className="flex items-start justify-between gap-3 text-sm">
        <span className="line-clamp-2 text-charcoal">{title || "Watch on TikTok"}</span>
        <a href={url} target="_blank" rel="noopener noreferrer" className="shrink-0 font-semibold">TikTok ↗</a>
      </figcaption>
    </figure>
  );
}
