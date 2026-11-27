import type { Metadata } from "next";
import Link from "next/link";
import { programs } from "@/lib/programs";
import { PageHero } from "@/components/ui";
import { Arrow, programIcon } from "@/components/icons";
import { ArrowDot, Photo } from "@/components/brand";
import { media } from "@/lib/media";

export const metadata: Metadata = {
  title: "Programs — NCLEX, CELPIP, English & Mentorship",
  description: "Explore Hetty Global Academy's four academies: NCLEX preparation, CELPIP test preparation, English communication and career mentorship for nurses.",
  alternates: { canonical: "/programs" },
};

export default function ProgramsPage() {
  return (
    <>
      <PageHero crumb="Programs" title="Programs & academies" intro="Choose the support that fits where you are in your journey." />
      <section className="py-20">
        <div className="container-x grid gap-6 md:grid-cols-2">
          {programs.map((p) => {
            const Icon = programIcon[p.icon];
            return (
              <Link key={p.slug} href={`/programs/${p.slug}`} className="group flex flex-col gap-5 rounded-[28px] border border-line bg-ivory-light p-3 text-charcoal no-underline transition-shadow hover:shadow-lg">
                <Photo m={media.program[p.slug]} tone={p.slug === "celpip" ? "gold" : "burgundy"} className="aspect-[16/9] rounded-[22px]" />
                <div className="flex flex-col gap-4 px-5 pb-5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="eyebrow"><Icon className="size-5" />{p.label}</span>
                    <ArrowDot />
                  </div>
                  <h2 className="text-3xl">{p.name}</h2>
                  <p className="text-muted">{p.intro}</p>
                  <span className="flex items-center gap-1.5 font-semibold text-burgundy">Explore {p.name.replace("Hetty ", "")} <Arrow /></span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
