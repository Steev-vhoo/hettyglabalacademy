import type { Metadata } from "next";
import Link from "next/link";
import { programs } from "@/lib/programs";
import { site } from "@/lib/site";
import { PageHero, SectionHeading } from "@/components/ui";
import { Arrow, programIcon } from "@/components/icons";
import { Photo, Sparkle } from "@/components/brand";
import { media } from "@/lib/media";
import { delay } from "@/lib/motion";

export const metadata: Metadata = {
  title: "About Us — Our Story",
  description: `Meet ${site.founder.name}, Registered Nurse and founder of Hetty Global Academy, and learn why the academy exists.`,
  alternates: { canonical: "/about" },
};

const values = [
  { t: "Learn", d: "Clear, practical teaching grounded in real nursing experience." },
  { t: "Grow", d: "Personal feedback and mentorship that builds confidence, not just knowledge." },
  { t: "Excel", d: "High standards and honest guidance so every learner can reach their goal." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero crumb="About" title="Our story" intro="Why Hetty Global Academy exists, and who is behind it." />

      <section className="py-20">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <div data-reveal="left" className="relative mx-auto w-full max-w-md">
            <Photo m={{ ...media.mentor, label: "Harriet K · Registered Nurse" }} priority className="aspect-[4/5] rounded-[40px_120px_40px_40px]" />
            <Sparkle className="absolute -top-3 -left-3 size-9 animate-twinkle text-gold" />
            <div className="absolute -right-4 -bottom-5 rounded-2xl bg-burgundy px-5 py-3 font-display text-sm tracking-[0.18em] text-gold shadow-xl sm:-right-8">LEARN · GROW · EXCEL</div>
          </div>
          <div className="flex flex-col gap-5">
            <SectionHeading eyebrow="Meet the founder" title={`${site.founder.name}, Registered Nurse & CEO`} />
            {/* TODO(client): replace with Harriet's own story (2–3 paragraphs). */}
            <p className="text-lg text-muted">
              Harriet is a Registered Nurse who knows first-hand what it takes to train, pass licensing exams and build a nursing career across borders.
              She founded Hetty Global Academy to give nurses and students in Ghana — and Ghanaians abroad — the clear, trustworthy guidance she wished she had.
            </p>
            <blockquote className="border-l-4 border-gold pl-5 font-serif text-xl text-burgundy">
              &ldquo;I want to give great information to my Ghanaian people back home.&rdquo;
            </blockquote>
          </div>
        </div>
      </section>

      <section className="bg-burgundy py-20 text-white">
        <div className="container-x flex flex-col gap-10">
          <SectionHeading light center eyebrow="Our motto" title="Learn · Grow · Excel" />
          <div className="grid gap-5 md:grid-cols-3">
            {values.map((v, i) => (
              <div key={v.t} data-reveal style={delay(i * 120)} className="rounded-2xl border border-white/15 bg-white/5 p-8">
                <h3 className="font-display text-2xl tracking-[0.08em] text-gold">{v.t.toUpperCase()}</h3>
                <p className="mt-3 text-white/85">{v.d}</p>
              </div>
            ))}
          </div>
          <p className="text-center font-serif text-xl text-white/90">{site.tagline}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-x flex flex-col gap-10">
          <SectionHeading center eyebrow="What we do" title="Nursing · Language · Education · Mentorship" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((p) => {
              const Icon = programIcon[p.icon];
              return (
                <Link key={p.slug} href={`/programs/${p.slug}`} data-reveal className="card flex flex-col gap-3 text-charcoal no-underline transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-md">
                  <span className="grid size-12 place-items-center rounded-full bg-burgundy text-gold"><Icon /></span>
                  <h3 className="text-lg">{p.name}</h3>
                  <p className="text-sm text-muted">{p.short}</p>
                </Link>
              );
            })}
          </div>
          <div className="text-center"><Link href="/book" className="btn-primary">Book your first session <Arrow /></Link></div>
        </div>
      </section>
    </>
  );
}
