import Image from "next/image";
import Link from "next/link";
import type { Media } from "@/lib/media";
import { Arrow, Book, Globe, People, Play, Stethoscope } from "./icons";

const ICONS = { nurse: Stethoscope, study: Book, people: People, book: Book, globe: Globe, video: Play };
const TONES = {
  burgundy: "bg-burgundy text-gold [background-image:radial-gradient(circle_at_25%_15%,#6e3a47,transparent_55%),radial-gradient(circle_at_85%_90%,#2e1820,transparent_50%)]",
  gold: "bg-gold text-burgundy [background-image:radial-gradient(circle_at_20%_10%,#e2cd9f,transparent_55%)]",
  ivory: "bg-gold-soft text-burgundy [background-image:radial-gradient(circle_at_80%_20%,#fbf8f3,transparent_60%)]",
};

/** A photo, or — until one is added in src/lib/media.ts — a designed brand panel of the same size. */
export function Photo({ m, className = "", tone = "burgundy", sizes = "(min-width: 1024px) 40vw, 100vw", priority }: { m: Media; className?: string; tone?: keyof typeof TONES; sizes?: string; priority?: boolean }) {
  const Icon = ICONS[m.icon];
  return (
    <div className={`${/\babsolute\b/.test(className) ? "" : "relative"} overflow-hidden ${className}`}>
      {m.src ? (
        <Image src={m.src} alt={m.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div role="img" aria-label={m.alt} className={`absolute inset-0 flex items-center justify-center ${TONES[tone]}`}>
          <span aria-hidden="true" className="absolute inset-0 opacity-25 dots [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
          <span aria-hidden="true" className="relative grid size-20 place-items-center rounded-full border border-current/40">
            <Icon className="size-9 opacity-90" />
          </span>
        </div>
      )}
      {m.label && <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-charcoal shadow-sm">{m.label}</span>}
    </div>
  );
}

/** Rotating circular "Book a session" badge. Motion stops for visitors who prefer reduced motion. */
export function BookBadge({ id = "badge", className = "", text = "BOOK A SESSION ✦ LEARN · GROW · EXCEL ✦" }: { id?: string; className?: string; text?: string }) {
  return (
    <Link href="/book" aria-label="Book a session" className={`group ${/\babsolute\b/.test(className) ? "" : "relative"} grid size-32 place-items-center rounded-full bg-burgundy text-gold shadow-xl ring-4 ring-white no-underline ${className}`}>
      <svg viewBox="0 0 120 120" className="absolute inset-0 size-full animate-spin-slow" aria-hidden="true">
        <defs><path id={id} d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0" /></defs>
        <text fill="currentColor" fontSize="9.5" fontWeight="600" fontFamily="var(--font-cinzel), serif">
          <textPath href={`#${id}`} textLength="280" lengthAdjust="spacing">{text}</textPath>
        </text>
      </svg>
      <span className="grid size-12 place-items-center rounded-full bg-gold text-burgundy transition-transform group-hover:scale-110"><Arrow className="size-5 -rotate-45" /></span>
    </Link>
  );
}

export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0z" />
    </svg>
  );
}

/** Infinite scrolling band. The duplicate copy is hidden from screen readers. */
export function Marquee({ items, className = "" }: { items: string[]; className?: string }) {
  const row = (hidden?: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((t) => (
        <li key={t} className="flex items-center gap-10 whitespace-nowrap">
          <span>{t}</span>
          <Sparkle className="size-5 text-gold" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {row()}
        {row(true)}
      </div>
    </div>
  );
}

/** Section label with the gold "double dot" mark. */
export function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span className={`eyebrow ${light ? "text-gold" : ""}`}>
      <span aria-hidden="true" className="flex">
        <span className="size-3 rounded-full bg-gold" />
        <span className={`-ml-1 size-3 rounded-full ${light ? "bg-white" : "bg-burgundy"}`} />
      </span>
      {children}
    </span>
  );
}

/** Round arrow button used on cards. */
export function ArrowDot({ light }: { light?: boolean }) {
  return (
    <span aria-hidden="true" className={`grid size-10 shrink-0 place-items-center rounded-full transition-transform group-hover:rotate-45 ${light ? "bg-white text-burgundy" : "border border-line bg-white text-burgundy"}`}>
      <Arrow className="size-4 -rotate-45" />
    </span>
  );
}
