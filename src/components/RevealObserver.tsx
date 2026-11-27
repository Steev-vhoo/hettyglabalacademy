"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Fades elements marked `data-reveal` up into view as they scroll in.
 * Anything already on screen is shown straight away (no flicker), and nothing is hidden
 * unless JavaScript runs and the visitor hasn't asked for reduced motion.
 */
export function RevealObserver() {
  const path = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = [...document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)")];
    const fold = window.innerHeight * 0.92;
    for (const el of els) if (el.getBoundingClientRect().top < fold) el.classList.add("is-visible");
    document.documentElement.classList.add("reveal-ready");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    for (const el of els) if (!el.classList.contains("is-visible")) io.observe(el);
    return () => io.disconnect();
  }, [path]);
  return null;
}
