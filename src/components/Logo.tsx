import Image from "next/image";
import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 no-underline" aria-label="Hetty Global Academy — home">
      <Image src="/brand/crest-transparent.webp" alt="" width={64} height={47} priority className="h-[47px] w-16 object-contain" />
      <span className="flex flex-col leading-[1.05]">
        <span className={`font-display text-[22px] font-bold tracking-[0.04em] ${light ? "text-white" : "text-burgundy"}`}>HETTY</span>
        <span className={`font-display text-[10.5px] font-semibold tracking-[0.22em] ${light ? "text-gold" : "text-gold-dark"}`}>GLOBAL ACADEMY</span>
      </span>
    </Link>
  );
}
