import type { Metadata } from "next";
import Link from "next/link";
import { getPosts, getResources, getVideos } from "@/lib/queries";
import { RESOURCE_CATEGORIES } from "@/lib/constants";
import { generalFaqs } from "@/lib/content";
import { whatsappLink } from "@/lib/site";
import { PageHero, SectionHeading } from "@/components/ui";
import { ArrowDot, Sparkle } from "@/components/brand";
import { Arrow, Book, Globe, Play, Stethoscope } from "@/components/icons";
import { PostCard } from "@/components/PostCard";
import { delay } from "@/lib/motion";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Academy Resources — NCLEX, CELPIP & English Study Materials",
  description: "NCLEX study materials, nursing articles, CELPIP practice resources, English learning materials, educational videos, downloadable study guides and FAQs.",
  alternates: { canonical: "/resources" },
};

const CATEGORY_INFO: Record<(typeof RESOURCE_CATEGORIES)[number], { icon: typeof Book; blurb: string }> = {
  "NCLEX study materials": { icon: Stethoscope, blurb: "Practice questions, topic reviews and NGN case-study tips." },
  "CELPIP practice resources": { icon: Globe, blurb: "Speaking and writing prompts, timing tips and practice sets." },
  "English learning materials": { icon: Book, blurb: "Beginner-friendly vocabulary, grammar and conversation guides." },
  "Downloadable study guides": { icon: Book, blurb: "PDF guides and checklists to study at your own pace." },
  "Nursing articles & links": { icon: Stethoscope, blurb: "Trusted external reading for nurses and IENs." },
};

const KIND_LABEL = { download: "Download", link: "Open link", video: "Watch" } as const;

export default async function ResourcesPage() {
  const [resources, posts, videos] = await Promise.all([getResources(), getPosts({ limit: 3, category: "Nursing & NCLEX" }), getVideos({ limit: 1 })]);

  return (
    <>
      <PageHero crumb="Resources" title="Academy resources" intro="Study materials, articles, videos and guides for nursing, CELPIP and English — gathered in one place." />

      {/* Quick links */}
      <section className="py-14">
        <div className="container-x grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { href: "#materials", t: "Study materials & guides", d: "NCLEX, CELPIP and English", Icon: Book },
            { href: "/blog?category=Nursing+%26+NCLEX", t: "Nursing articles", d: "Guides on the blog", Icon: Stethoscope },
            { href: "/videos", t: "Educational videos", d: `${videos.length ? "Popular" : "Lessons"} on TikTok`, Icon: Play },
            { href: "#faq", t: "Frequently asked questions", d: "Booking, sessions & payment", Icon: Globe },
          ].map(({ href, t, d, Icon }, i) => (
            <Link key={t} href={href} data-reveal style={delay(i * 90)} className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 text-charcoal no-underline transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-lg">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-burgundy text-gold"><Icon className="size-6" /></span>
              <span className="flex-1"><strong className="block">{t}</strong><span className="text-sm text-muted">{d}</span></span>
              <ArrowDot />
            </Link>
          ))}
        </div>
      </section>

      {/* Materials by category */}
      <section id="materials" className="scroll-mt-28 bg-ivory py-20">
        <div className="container-x flex flex-col gap-12">
          <SectionHeading eyebrow="Study materials" title="Learn at your own pace" />
          <div className="grid gap-6 lg:grid-cols-2">
            {RESOURCE_CATEGORIES.map((cat, i) => {
              const { icon: Icon, blurb } = CATEGORY_INFO[cat];
              const items = resources.filter((r) => r.category === cat);
              return (
                <div key={cat} data-reveal style={delay((i % 2) * 120)} className="flex flex-col gap-4 rounded-[28px] bg-white p-7">
                  <div className="flex items-center gap-4">
                    <span className="grid size-12 place-items-center rounded-full bg-gold-soft text-burgundy"><Icon /></span>
                    <div><h3 className="text-xl">{cat}</h3><p className="text-sm text-muted">{blurb}</p></div>
                  </div>
                  {items.length ? (
                    <ul className="flex flex-col divide-y divide-line">
                      {items.map((r) => (
                        <li key={String(r._id)}>
                          <a href={r.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 py-3.5 text-charcoal no-underline">
                            <span className="flex-1">
                              <strong className="block group-hover:underline">{r.title}</strong>
                              {r.description && <span className="text-sm text-muted">{r.description}</span>}
                            </span>
                            <span className="pill shrink-0 bg-ivory text-burgundy">{KIND_LABEL[r.kind]}{!r.free && " · Students"}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="rounded-2xl bg-ivory-light px-4 py-3 text-sm text-muted">
                      New materials are being prepared. <a href={whatsappLink(`Hello, I'm interested in ${cat.toLowerCase()}.`)} target="_blank" rel="noopener noreferrer">Ask us on WhatsApp</a> to be told first.
                    </p>
                  )}
                </div>
              );
            })}
            <Link href="/videos" data-reveal className="group relative flex flex-col justify-between gap-6 overflow-hidden rounded-[28px] bg-burgundy p-7 text-white no-underline">
              <span aria-hidden="true" className="absolute inset-0 opacity-15 dots" />
              <div className="relative flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-full bg-gold text-burgundy"><Play className="ml-0.5 size-5" /></span>
                <div><h3 className="text-xl text-white">Educational videos</h3><p className="text-sm text-white/75">Nursing lessons — some in Twi — exam tips and life abroad.</p></div>
              </div>
              <span className="relative flex items-center gap-2 font-semibold text-gold">Watch the videos <Arrow /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* Articles */}
      {posts.length > 0 && (
        <section className="py-20">
          <div className="container-x flex flex-col gap-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow="Nursing educational articles" title="From the blog" />
              <Link href="/blog" className="btn-outline">All articles <Arrow /></Link>
            </div>
            <div className="grid gap-8 md:grid-cols-3">{posts.map((p) => <PostCard key={String(p._id)} post={p} />)}</div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section id="faq" className="scroll-mt-28 py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading eyebrow="FAQ" title="Frequently asked questions">
            <p className="flex items-center gap-2 text-muted"><Sparkle className="size-4 text-gold" />Still unsure? <a href={whatsappLink()}>Message us on WhatsApp</a>.</p>
          </SectionHeading>
          <div data-reveal className="rounded-3xl border border-line px-6 sm:px-8">
            {generalFaqs.map((f, i) => (
              <details key={f.q} className={`group py-5 ${i < generalFaqs.length - 1 ? "border-b border-line" : ""}`} open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
                  {f.q}<span aria-hidden="true" className="text-2xl text-gold-dark transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="pt-3 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
