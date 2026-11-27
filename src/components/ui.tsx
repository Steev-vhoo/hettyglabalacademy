import Link from "next/link";

import Image from "next/image";
import { Eyebrow } from "./brand";

/** Inner-page header: a rounded burgundy panel with the crest as a watermark. */
export function PageHero({ crumb, title, intro, children }: { crumb: string; title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <section className="pt-6 pb-4">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[32px] bg-burgundy px-6 py-14 text-white sm:px-12 sm:py-20">
          <span aria-hidden="true" className="absolute inset-0 opacity-[0.12] dots" />
          <Image src="/brand/crest-transparent.webp" alt="" width={420} height={306} aria-hidden="true" className="pointer-events-none absolute -right-16 -bottom-16 w-[340px] opacity-[0.12] sm:w-[420px]" />
          <div className="relative flex max-w-3xl flex-col gap-5">
            <nav aria-label="Breadcrumb" className="self-start rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/85">
              <Link href="/" className="text-white/85 no-underline hover:text-white">Home</Link> <span aria-hidden="true" className="text-gold">/</span> {crumb}
            </nav>
            <h1 className="text-4xl leading-[1.08] text-white sm:text-5xl lg:text-[60px]">{title}</h1>
            <span aria-hidden="true" className="h-0.5 w-24 bg-gold" />
            {intro && <p className="max-w-2xl text-lg text-white/85">{intro}</p>}
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, center, light, children }: { eyebrow: string; title: React.ReactNode; center?: boolean; light?: boolean; children?: React.ReactNode }) {
  return (
    <div className={`flex flex-col gap-3 ${center ? "items-center text-center" : ""}`}>
      <Eyebrow light={light}>{eyebrow}</Eyebrow>
      <h2 className={`max-w-2xl text-3xl leading-[1.12] sm:text-[44px] ${light ? "text-white" : ""}`}>{title}</h2>
      {children}
    </div>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function Notice({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "error" | "success" }) {
  const styles = { info: "bg-ivory text-charcoal", error: "bg-[#fdecec] text-[#8a1c1c]", success: "bg-[#e7f3ea] text-[#1c5a35]" }[tone];
  return <div role={tone === "error" ? "alert" : "status"} className={`rounded-xl px-4 py-3 text-sm ${styles}`}>{children}</div>;
}

const STATUS_STYLE: Record<string, string> = {
  confirmed: "bg-[#e3f1e8] text-[#1c5a35]",
  completed: "bg-[#e6ecf5] text-[#1d3a63]",
  pending: "bg-[#fff1d6] text-[#7a4a00]",
  pending_payment: "bg-[#fff1d6] text-[#7a4a00]",
  cancelled: "bg-[#eeefec] text-[#4f5551]",
  paid: "bg-[#e3f1e8] text-[#1c5a35]",
  unpaid: "bg-[#fff1d6] text-[#7a4a00]",
  free: "bg-[#eeefec] text-[#4f5551]",
  refunded: "bg-[#eeefec] text-[#4f5551]",
  published: "bg-[#e3f1e8] text-[#1c5a35]",
  draft: "bg-[#eeefec] text-[#4f5551]",
};
export function StatusPill({ status, label }: { status: string; label?: string }) {
  return <span className={`pill ${STATUS_STYLE[status] ?? "bg-ivory"}`}>{label ?? status.replace("_", " ")}</span>;
}
