import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { programBySlug, programs } from "@/lib/programs";
import { getServices } from "@/lib/queries";
import { money } from "@/lib/format";
import { site, whatsappLink } from "@/lib/site";
import { JsonLd, SectionHeading } from "@/components/ui";
import { Arrow, Check, programIcon } from "@/components/icons";

export const revalidate = 300;
export const dynamicParams = false;
export const generateStaticParams = () => programs.map((p) => ({ slug: p.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = programBySlug((await params).slug);
  if (!p) return {};
  return {
    title: `${p.label} — ${p.name}`,
    description: p.intro,
    alternates: { canonical: `/programs/${p.slug}` },
    openGraph: { title: `${p.label} | ${site.name}`, description: p.intro },
  };
}

export default async function ProgramPage({ params }: Props) {
  const p = programBySlug((await params).slug);
  if (!p) notFound();
  const services = await getServices(p.academy);
  const Icon = programIcon[p.icon];

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Course",
            name: `${p.label} — ${p.name}`,
            description: p.intro,
            provider: { "@type": "EducationalOrganization", name: site.name, sameAs: site.url },
            hasCourseInstance: { "@type": "CourseInstance", courseMode: "online" },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: p.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          },
        ]}
      />

      <section className="bg-ivory py-16 sm:py-20">
        <div className="container-x grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-5">
            <nav aria-label="Breadcrumb" className="text-sm text-muted">
              <Link href="/" className="text-muted no-underline">Home</Link> / <Link href="/programs" className="text-muted no-underline">Programs</Link> / {p.label}
            </nav>
            <span className="eyebrow"><Icon className="size-5" />{p.label}</span>
            <h1 className="text-4xl leading-[1.08] sm:text-[56px]">{p.name}</h1>
            <p className="max-w-2xl text-lg text-muted">{p.intro}</p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/book${services[0] ? `?service=${services[0].slug}` : ""}`} className="btn-primary">Book a session <Arrow /></Link>
              <a href={whatsappLink(`Hello, I'd like to ask about ${p.name}.`)} className="btn-outline" target="_blank" rel="noopener noreferrer">Ask on WhatsApp</a>
            </div>
          </div>
          {p.atAGlance && (
            <dl className="grid grid-cols-2 gap-3 rounded-[28px] bg-burgundy p-6 text-white sm:p-8">
              <p className="col-span-2 font-display text-sm tracking-[0.18em] text-gold">AT A GLANCE</p>
              {p.atAGlance.map((g) => (
                <div key={g.label} className="rounded-2xl bg-white/5 p-4">
                  <dt className="text-xs uppercase tracking-wider text-white/70">{g.label}</dt>
                  <dd className="mt-1 font-serif text-lg text-white">{g.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      <section className="py-20">
        <div className="container-x grid gap-14 lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col gap-12">
            {p.sections.map((s) => (
              <article key={s.title} className="flex flex-col gap-4">
                <h2 className="text-3xl">{s.title}</h2>
                <p className="text-[17px] leading-relaxed text-charcoal">{s.body}</p>
                {s.points && (
                  <ul className="flex flex-col gap-2.5">
                    {s.points.map((pt) => <li key={pt} className="flex gap-3"><Check className="mt-0.5 size-5 shrink-0 text-gold-dark" />{pt}</li>)}
                  </ul>
                )}
              </article>
            ))}
            {p.officialLinks && (
              <p className="text-sm text-muted">
                Official information:{" "}
                {p.officialLinks.map((l, i) => (
                  <span key={l.href}>{i > 0 && " · "}<a href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a></span>
                ))}
              </p>
            )}
          </div>
          <aside className="flex flex-col gap-6">
            <div className="card">
              <h2 className="mb-4 text-xl">Who it&apos;s for</h2>
              <ul className="flex flex-col gap-3 text-[15px]">{p.forWho.map((w) => <li key={w} className="flex gap-3"><Check className="mt-0.5 size-5 shrink-0 text-gold-dark" />{w}</li>)}</ul>
            </div>
            <div className="card border-transparent bg-gold-soft">
              <h2 className="mb-4 text-xl">How we help</h2>
              <ul className="flex flex-col gap-3 text-[15px]">{p.howWeHelp.map((w) => <li key={w} className="flex gap-3"><Check className="mt-0.5 size-5 shrink-0 text-burgundy" />{w}</li>)}</ul>
            </div>
          </aside>
        </div>
      </section>

      {services.length > 0 && (
        <section className="bg-burgundy py-20 text-white">
          <div className="container-x flex flex-col gap-10">
            <SectionHeading light eyebrow="Book online" title={`${p.name.replace("Hetty ", "")} sessions & courses`} />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <div key={String(s._id)} className="flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/5 p-6">
                  <span className="text-xs uppercase tracking-wider text-gold">{s.kind === "course" ? "Course" : `${s.durationMin} min session`}</span>
                  <h3 className="text-xl text-white">{s.name}</h3>
                  {s.summary && <p className="text-white/80">{s.summary}</p>}
                  <p className="font-semibold">
                    {[s.priceGHS != null && money(s.priceGHS, "GHS"), s.priceCAD != null && money(s.priceCAD, "CAD")].filter(Boolean).join(" · ") || "Free"}
                  </p>
                  <Link href={`/book?service=${s.slug}`} className="btn-gold mt-auto self-start">Book <Arrow /></Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading eyebrow="FAQ" title="Common questions" />
          <div className="rounded-3xl border border-line px-6 sm:px-8">
            {p.faqs.map((f, i) => (
              <details key={f.q} className={`group py-5 ${i < p.faqs.length - 1 ? "border-b border-line" : ""}`} open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
                  {f.q}<span aria-hidden="true" className="text-2xl text-gold-dark group-open:rotate-45 transition-transform">+</span>
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
