import type { Metadata } from "next";
import Link from "next/link";
import { programs } from "@/lib/programs";
import { site } from "@/lib/site";
import { PageHero, SectionHeading } from "@/components/ui";
import { Arrow, programIcon } from "@/components/icons";
import { Eyebrow, Photo, Sparkle } from "@/components/brand";
import { media } from "@/lib/media";
import { delay } from "@/lib/motion";

export const metadata: Metadata = {
  title: "About Us — Our Story, Mission & Vision",
  description:
    "Hetty Global Academy was founded by Registered Nurse, nursing educator and mentor Harriet K to empower internationally trained professionals through education and mentorship across borders.",
  alternates: { canonical: "/about" },
};

const values = [
  { t: "Learn", d: "Clear, practical teaching grounded in real nursing and professional experience." },
  { t: "Grow", d: "Personal feedback and mentorship that builds confidence, not just knowledge." },
  { t: "Excel", d: "High standards and honest guidance so every learner can reach their goal." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero crumb="About" title="Our story" intro="Every great journey begins with a purpose. Ours began with a desire to educate, empower and create opportunities that transcend borders." />

      {/* ── Story, part 1 ── */}
      <section className="py-20">
        <div className="container-x grid items-start gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div data-reveal="left" className="relative mx-auto w-full max-w-md lg:sticky lg:top-28">
            <Photo m={{ ...media.mentor, label: "Harriet K · Registered Nurse" }} priority className="aspect-[4/5] rounded-[40px_120px_40px_40px]" />
            <Sparkle className="absolute -top-3 -left-3 size-9 animate-twinkle text-gold" />
            <div className="absolute -right-4 -bottom-5 rounded-2xl bg-burgundy px-5 py-3 font-display text-sm tracking-[0.18em] text-gold shadow-xl sm:-right-8">LEARN · GROW · EXCEL</div>
          </div>
          <div className="flex flex-col gap-6 text-[17px] leading-[1.8]">
            <Eyebrow>Our story</Eyebrow>
            <h2 className="text-3xl leading-tight sm:text-[42px]">Knowledge should open doors</h2>
            <p data-reveal>
              Hetty Global Academy was founded on a simple but powerful belief: <strong className="text-burgundy">knowledge should open doors, education should create possibilities, and access to the right guidance can transform lives.</strong>
            </p>
            <p data-reveal>Our story is deeply rooted in the power of education, professional growth, resilience and the determination to achieve more.</p>
            <p data-reveal>
              As a Registered Nurse, nursing educator and mentor, our founder&apos;s professional journey across different environments and countries has shaped a deep appreciation for the opportunities education can create. Her experiences have reinforced the importance of continuous learning, professional confidence, mentorship and access to reliable educational resources.
            </p>
            <p data-reveal>Beyond the clinical environment, a passion for teaching and knowledge-sharing gradually developed into a broader mission.</p>
            <p data-reveal>
              Through educational content, nursing tutorials and mentorship, she began connecting with aspiring nurses, internationally educated professionals and individuals seeking new academic and professional opportunities. Her educational videos, including nursing lessons delivered in Twi, became a way of making complex information more accessible and reminding learners that their backgrounds, circumstances or starting points do not have to define their destinations.
            </p>
            <blockquote data-reveal className="my-2 rounded-3xl bg-ivory px-7 py-6 font-serif text-2xl leading-snug text-burgundy">
              Education is most powerful when knowledge is shared and people are empowered to believe in their potential.
            </blockquote>
            <p data-reveal>
              The encouraging messages, questions and motivational responses from learners across different communities strengthened that conviction — and it became the foundation of Hetty Global Academy.
            </p>
          </div>
        </div>
      </section>

      {/* ── Mission & vision ── */}
      <section className="bg-burgundy py-20 text-white">
        <div className="container-x grid gap-5 md:grid-cols-2">
          {[
            { t: "Our Mission", d: site.mission },
            { t: "Our Vision", d: site.vision },
          ].map((m, i) => (
            <div key={m.t} data-reveal style={delay(i * 140)} className="relative overflow-hidden rounded-[28px] border border-white/15 bg-white/5 p-8 sm:p-10">
              <span aria-hidden="true" className="absolute -top-6 -right-4 font-serif text-[140px] leading-none text-white/5">{i ? "◎" : "✦"}</span>
              <h2 className="font-display text-xl tracking-[0.12em] text-gold">{m.t.toUpperCase()}</h2>
              <p className="mt-4 font-serif text-2xl leading-snug text-white sm:text-[28px]">{m.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Story, part 2 ── */}
      <section className="py-20">
        <div className="container-x grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-6 text-[17px] leading-[1.8]">
            <Eyebrow>Today</Eyebrow>
            <h2 className="text-3xl leading-tight sm:text-[42px]">An international learning and mentorship community</h2>
            <p data-reveal>
              Today, Hetty Global Academy is envisioned as an international learning and mentorship platform serving individuals across Ghana, Africa, Canada and the wider global community.
            </p>
            <p data-reveal>
              Our educational focus extends beyond nursing. Through nursing education and NCLEX preparation, CELPIP preparation, English language coaching, professional development and mentorship, we aim to equip learners with practical knowledge, confidence and the guidance needed to pursue their ambitions.
            </p>
            <p data-reveal>
              We recognize that every learner has a different story, a different starting point and a different dream. Our role is to support that journey through quality education, meaningful mentorship and an environment that encourages growth.
            </p>
            <p data-reveal className="font-semibold text-burgundy">
              We are not simply building an academy. We are building a community where knowledge is shared, potential is nurtured, confidence is developed and opportunities are pursued.
            </p>
          </div>
          <div data-reveal="right" className="relative">
            <Photo m={media.program.mentorship} className="aspect-[4/3] rounded-[120px_40px_40px_40px]" />
            <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-charcoal">Ghana · Africa · Canada · Worldwide</span>
          </div>
        </div>
      </section>

      {/* ── Closing promise ── */}
      <section className="pb-20">
        <div className="container-x">
          <div data-reveal="zoom" className="relative overflow-hidden rounded-[32px] bg-gold px-8 py-14 text-center sm:px-16">
            <span aria-hidden="true" className="absolute inset-0 opacity-20 dots" />
            <p className="relative mx-auto max-w-3xl font-serif text-2xl leading-snug text-burgundy sm:text-3xl">
              Because someone&apos;s future can change when the right person takes the time to teach, guide and believe in them.
            </p>
            <p className="relative mt-6 font-display text-sm tracking-[0.2em] text-burgundy">{site.promise.toUpperCase()}</p>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="bg-ivory py-20">
        <div className="container-x flex flex-col gap-10">
          <SectionHeading center eyebrow="Our motto" title="Learn · Grow · Excel" />
          <div className="grid gap-5 md:grid-cols-3">
            {values.map((v, i) => (
              <div key={v.t} data-reveal style={delay(i * 120)} className="rounded-2xl bg-white p-8">
                <h3 className="font-display text-2xl tracking-[0.08em] text-gold-dark">{v.t.toUpperCase()}</h3>
                <p className="mt-3 text-muted">{v.d}</p>
              </div>
            ))}
          </div>
          <p className="text-center font-serif text-xl text-burgundy">{site.tagline}</p>
        </div>
      </section>

      {/* ── Departments ── */}
      <section className="py-20">
        <div className="container-x flex flex-col gap-10">
          <SectionHeading center eyebrow="What we do" title="Three departments" />
          <div className="grid gap-5 md:grid-cols-3">
            {programs.map((p, i) => {
              const Icon = programIcon[p.icon];
              return (
                <Link key={p.slug} href={`/programs/${p.slug}`} data-reveal style={delay(i * 110)} className="card flex flex-col gap-3 text-charcoal no-underline transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-md">
                  <span className="grid size-12 place-items-center rounded-full bg-burgundy text-gold"><Icon /></span>
                  <h3 className="text-xl">{p.name}</h3>
                  <p className="text-sm text-muted">{p.teaser}</p>
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
