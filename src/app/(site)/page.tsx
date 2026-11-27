import Link from "next/link";
import { programs } from "@/lib/programs";
import { site, tiktokProfileUrl, whatsappLink } from "@/lib/site";
import { media } from "@/lib/media";
import { getPosts, getVideos } from "@/lib/queries";
import { testimonials } from "@/lib/content";
import { JsonLd, SectionHeading } from "@/components/ui";
import { ArrowDot, BookBadge, Eyebrow, Marquee, Photo, Sparkle } from "@/components/brand";
import { Arrow, Check, Play, programIcon } from "@/components/icons";
import { TikTokCard } from "@/components/TikTokCard";
import { PostCard } from "@/components/PostCard";
import { ContactForm } from "@/components/forms/ContactForm";
import { delay } from "@/lib/motion";

export const revalidate = 300;

const facts = [
  { big: "3", label: "Specialist departments" },
  { big: "1:1", label: "Personal coaching" },
  { big: "100%", label: "Online — join from anywhere" },
  { big: "RN", label: "Led by a Registered Nurse & educator" },
];

const hub = [
  { t: "Personal study plans", d: "A plan built from a diagnostic of your strengths and gaps.", href: "/programs/nursing" },
  { t: "NGN-style practice", d: "Clinical-judgement case studies with clear rationales.", href: "/programs/nursing#nclex" },
  { t: "Speaking feedback", d: "English for beginners and timed CELPIP tasks with personal feedback.", href: "/programs/english" },
  { t: "Career action plans", d: "A written next-steps plan after every mentorship session.", href: "/programs/mentorship" },
];

export default async function Home() {
  const [videos, posts] = await Promise.all([getVideos({ featuredOnly: true, limit: 4 }), getPosts({ limit: 3 })]);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: site.name,
          url: site.url,
          logo: `${site.url}/icon.png`,
          slogan: site.tagline,
          description: site.description,
          founder: { "@type": "Person", name: site.founder.name, jobTitle: "Registered Nurse" },
          email: site.email,
          sameAs: [tiktokProfileUrl, site.social.instagram, site.social.facebook].filter(Boolean),
        }}
      />

      {/* ───────── Hero ───────── */}
      <section className="relative overflow-hidden bg-ivory">
        <span aria-hidden="true" className="absolute top-8 left-[38%] h-24 w-40 opacity-40 dots" />
        <span aria-hidden="true" className="absolute bottom-6 left-[8%] h-20 w-32 opacity-40 dots" />
        <div className="container-x relative grid items-center gap-14 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <div className="flex flex-col gap-6">
            <div className="animate-rise"><Eyebrow>Nursing · Language · Education · Mentorship</Eyebrow></div>
            <h1 style={delay(100)} className="animate-rise text-[44px] leading-[1.04] sm:text-6xl lg:text-[68px]">
              Empowering Minds. Elevating Careers. <em className="text-gold-dark">Transforming Futures.</em>
            </h1>
            <p style={delay(220)} className="max-w-xl animate-rise text-lg text-muted">
              NCLEX-RN preparation, English for beginners and CELPIP, and international career mentorship — led by Registered Nurse {site.founder.name}, for internationally trained nurses and professionals in Ghana, Africa, Canada and worldwide.
            </p>
            <div style={delay(320)} className="flex animate-rise flex-wrap items-center gap-5">
              <Link href="/book" className="btn-primary min-h-12 px-7 transition-transform hover:-translate-y-0.5">Book a session <Arrow /></Link>
              <Link href="/programs" className="font-semibold underline decoration-gold decoration-2 underline-offset-4">View all programs</Link>
            </div>
            <ul style={delay(420)} className="mt-2 grid max-w-xl animate-rise grid-cols-1 gap-2 rounded-2xl bg-white/70 p-4 text-sm sm:grid-cols-3">
              {["Taught by an RN", "Online, any timezone", "Pay with MoMo or card"].map((t) => (
                <li key={t} className="flex items-center gap-2"><span className="grid size-6 place-items-center rounded-full bg-burgundy text-gold"><Check className="size-3.5" /></span>{t}</li>
              ))}
            </ul>
          </div>

          {/* Photo collage */}
          <div style={delay(200)} className="relative mx-auto grid w-full max-w-[560px] animate-rise grid-cols-[1.15fr_1fr] gap-4">
            <Photo m={media.heroPortrait} priority className="row-span-2 min-h-[420px] rounded-[40px_120px_40px_40px] sm:min-h-[500px]" />
            <Photo m={media.heroClass} tone="gold" className="min-h-[200px] rounded-[120px_40px_40px_40px] sm:min-h-[240px]" />
            <Photo m={media.heroStudy} tone="ivory" className="min-h-[200px] rounded-[32px_32px_64px_32px] sm:min-h-[240px] sm:rounded-[40px_40px_120px_40px]" />
            <BookBadge id="hero-badge" className="absolute top-1/2 left-[46%] -translate-x-1/2 -translate-y-1/2" />
            <Sparkle className="absolute -right-2 bottom-8 size-10 animate-twinkle text-gold" />
            <Sparkle className="absolute right-8 bottom-24 size-5 animate-twinkle text-gold-dark [animation-delay:1.4s]" />
            <Sparkle className="absolute -top-4 left-6 size-6 animate-float text-gold" />
          </div>
        </div>
      </section>

      {/* ───────── Marquee ───────── */}
      <Marquee
        className="bg-burgundy py-5 font-serif text-xl text-white sm:text-2xl"
        items={["NCLEX-RN Preparation", "English for Beginners", "CELPIP — Canadian English", "Global Career Mentorship", "Your Knowledge", "Your Confidence", "Your Global Opportunity"]}
      />

      {/* ───────── Bento intro ───────── */}
      <section className="py-20 sm:py-24">
        <div className="container-x grid gap-5 md:grid-cols-3">
          <Link href="/about" data-reveal className="group flex flex-col gap-5 rounded-[28px] bg-ivory p-7 transition-shadow hover:shadow-xl text-charcoal no-underline">
            <div className="flex items-start justify-between gap-4">
              <span className="pill border border-line bg-white text-muted">WHO WE ARE</span>
              <ArrowDot />
            </div>
            <h2 className="text-2xl leading-snug">A nurse-led academy helping internationally trained nurses learn, pass and thrive</h2>
            <Photo m={media.aboutTop} className="mt-auto aspect-[4/3] rounded-2xl" />
          </Link>
          <Link href="/programs/nursing" data-reveal style={delay(120)} className="group relative flex transition-shadow hover:shadow-xl flex-col gap-5 overflow-hidden rounded-[28px] bg-gold p-3 text-charcoal no-underline">
            <Photo m={media.program.nursing} className="aspect-[4/3.4] rounded-[22px]" />
            <div className="flex items-end justify-between gap-4 px-4 pb-4">
              <div>
                <span className="pill bg-white/70 text-burgundy">FEATURED DEPARTMENT</span>
                <h2 className="mt-3 text-2xl leading-snug">Nursing Education — NCLEX-RN Preparation</h2>
              </div>
              <ArrowDot light />
            </div>
          </Link>
          <Link href="/videos" data-reveal style={delay(240)} className="group flex flex-col gap-5 rounded-[28px] bg-ivory p-7 transition-shadow hover:shadow-xl text-charcoal no-underline">
            <div className="flex items-start justify-between gap-4">
              <span className="pill border border-line bg-white text-muted">ON TIKTOK</span>
              <ArrowDot />
            </div>
            <h2 className="text-2xl leading-snug">Popular videos from @{site.social.tiktokHandle} on exams and life abroad</h2>
            <div className="relative mt-auto">
              <Photo m={media.connect} tone="ivory" className="aspect-[4/3] rounded-2xl" />
              <span className="absolute inset-0 grid place-items-center"><span className="grid size-14 place-items-center rounded-full bg-burgundy text-gold shadow-lg"><Play className="ml-1 size-6" /></span></span>
            </div>
          </Link>
        </div>
      </section>

      {/* ───────── About + facts ───────── */}
      <section className="pb-20 sm:pb-24">
        <div className="container-x">
          <div data-reveal className="flex justify-center"><Eyebrow>About us</Eyebrow></div>
          <h2 data-reveal className="mx-auto mt-3 max-w-3xl text-center text-3xl leading-[1.12] sm:text-[44px]">Founded by a nurse, for the next generation of nurses</h2>
          <div className="mt-12 grid items-center gap-12 lg:grid-cols-2">
            <div data-reveal="left" className="relative grid grid-cols-[1.4fr_1fr] gap-4">
              <Photo m={media.aboutTop} className="min-h-[220px] rounded-3xl" />
              <div aria-hidden="true" className="flex flex-col gap-3">
                <span className="h-1/2 rounded-t-full border border-line" />
                <span className="h-1/2 rounded-b-full border border-line" />
              </div>
              <Photo m={media.aboutBottom} tone="gold" className="col-span-2 min-h-[240px] rounded-3xl" />
              <BookBadge id="about-badge" className="absolute top-[44%] right-[18%] size-28 -translate-y-1/2" />
            </div>
            <div data-reveal="right" className="flex flex-col gap-6">
              <p className="text-lg text-muted">
                Hetty Global Academy was founded on a simple but powerful belief: knowledge should open doors, education should create possibilities, and access to the right guidance can transform lives.
              </p>
              <blockquote className="rounded-2xl border-l-4 border-gold bg-ivory px-6 py-5 font-serif text-xl text-burgundy">
                &ldquo;Someone&apos;s future can change when the right person takes the time to teach, guide and believe in them.&rdquo;
                <footer className="mt-2 font-sans text-sm text-muted not-italic">— Our story, {site.name}</footer>
              </blockquote>
              <ol className="flex flex-col gap-4">
                {[["Learn", "Clear teaching grounded in real nursing experience"], ["Grow", "Personal feedback that builds confidence"], ["Excel", "High standards and honest guidance to reach your goal"]].map(([t, d], i) => (
                  <li key={t} className="flex items-center gap-4">
                    <span className="font-display text-sm text-gold-dark">0{i + 1}</span>
                    <span className="h-px w-8 bg-gold" aria-hidden="true" />
                    <span><strong className="font-display tracking-wide text-burgundy">{t.toUpperCase()}</strong> <span className="text-muted">— {d}</span></span>
                  </li>
                ))}
              </ol>
              <div><Link href="/about" className="btn-primary">About us <Arrow /></Link></div>
            </div>
          </div>
          <dl className="mt-16 grid grid-cols-2 border-y border-line lg:grid-cols-4">
            {facts.map((f, i) => (
              <div key={f.label} data-reveal style={delay(i * 100)} className={`flex items-center gap-4 px-4 py-7 sm:px-6 ${i % 2 ? "border-l border-line" : ""} ${i === 2 ? "lg:border-l" : ""} ${i > 1 ? "border-t border-line lg:border-t-0" : ""}`}>
                <dd className="font-serif text-4xl text-burgundy sm:text-5xl">{f.big}</dd>
                <dt className="text-sm text-muted">{f.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ───────── Academies (dark) ───────── */}
      <section className="relative bg-burgundy py-20 text-white sm:py-24">
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-6 stripes" />
        <div className="container-x flex flex-col gap-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading light eyebrow="Our departments" title={<>Three departments, <em className="text-gold">one goal:</em> your success</>} />
            <Link href="/programs" className="btn bg-white text-burgundy hover:bg-ivory">View all programs <Arrow /></Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {programs.map((p, i) => {
              const Icon = programIcon[p.icon];
              const hi = i === 1;
              const text = (
                <div className={`flex flex-1 flex-col gap-3 rounded-2xl p-5 ${hi ? "bg-white/45" : "bg-white/5 ring-1 ring-white/15"}`}>
                  <span className={`flex items-center gap-2 text-xs font-semibold tracking-[0.14em] ${hi ? "text-burgundy" : "text-gold"}`}><Icon className="size-4" />{p.short.toUpperCase()}</span>
                  <h3 className={`text-xl ${hi ? "text-burgundy" : "text-white"}`}>{p.name}</h3>
                  <p className={`text-sm ${hi ? "text-charcoal" : "text-white/75"}`}>{p.teaser}</p>
                  <span className={`mt-auto flex items-center gap-1.5 text-sm font-semibold ${hi ? "text-burgundy" : "text-gold"}`}>Learn more <Arrow /></span>
                </div>
              );
              return (
                <Link key={p.slug} href={`/programs/${p.slug}`} data-reveal style={delay(i * 110)} className={`group flex flex-col gap-3 rounded-3xl p-3 no-underline transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-2xl ${hi ? "bg-gold" : "bg-white/[0.06]"}`}>
                  {hi ? <>{text}<Photo m={media.program[p.slug]} tone="burgundy" className="aspect-[4/3] rounded-2xl" /></> : <><Photo m={media.program[p.slug]} tone={i % 2 ? "gold" : "ivory"} className="aspect-[4/3] rounded-2xl" />{text}</>}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────── Learning hub ───────── */}
      <section className="py-20 sm:py-24">
        <div className="container-x grid gap-5 lg:grid-cols-[1fr_1.15fr]">
          <div data-reveal="left" className="group relative min-h-[460px] overflow-hidden rounded-[28px]">
            <Photo m={media.hub} className="absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-burgundy-dark via-burgundy-dark/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-8">
              <span className="pill self-start bg-white/90 text-burgundy">LEARNING HUB</span>
              <p className="font-serif text-2xl leading-snug text-white sm:text-3xl">Learn from someone who has done the job — and get the feedback that makes the difference.</p>
              <Link href="/register" className="btn-gold self-start">Get started</Link>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {hub.map((h, i) => (
              <Link key={h.t} href={h.href} data-reveal style={delay(i * 100)} className={`group flex flex-col justify-between gap-6 rounded-[24px] border p-7 text-charcoal no-underline transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-lg ${i === 1 ? "border-transparent bg-gold-soft" : i === 2 ? "border-transparent bg-ivory" : "border-line bg-white"}`}>
                <span className="grid size-12 place-items-center rounded-2xl bg-burgundy text-gold transition-transform duration-500 group-hover:rotate-12"><Sparkle className="size-5" /></span>
                <div>
                  <h3 className="text-xl">{h.t}</h3>
                  <p className="mt-2 text-sm text-muted">{h.d}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── TikTok ───────── */}
      <section className="bg-ivory py-20 sm:py-24">
        <div className="container-x flex flex-col gap-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Popular on TikTok" title={<>Watch <em className="text-gold-dark">@{site.social.tiktokHandle}</em></>}>
              <p className="max-w-xl text-muted">Short, practical videos on nursing, exams and life abroad.</p>
            </SectionHeading>
            <div className="flex gap-3">
              {videos.length > 0 && <Link href="/videos" className="btn-outline">All videos</Link>}
              <a href={tiktokProfileUrl} className="btn-primary" target="_blank" rel="noopener noreferrer">Follow on TikTok</a>
            </div>
          </div>
          <div data-reveal className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {videos.length > 0
              ? videos.map((v) => <TikTokCard key={v.videoId} videoId={v.videoId} title={v.title} coverImage={v.coverImage} url={v.url} />)
              : ["Nursing tips", "NCLEX advice", "CELPIP practice", "Life abroad"].map((t, i) => (
                  <a key={t} href={tiktokProfileUrl} target="_blank" rel="noopener noreferrer" className="group flex flex-col gap-3 text-charcoal no-underline">
                    <span className={`relative grid aspect-[9/16] place-items-center overflow-hidden rounded-2xl ${i % 2 ? "bg-gold" : "bg-burgundy"}`}>
                      <span aria-hidden="true" className="absolute inset-0 opacity-20 dots" />
                      <span className={`relative grid size-16 place-items-center rounded-full transition-transform group-hover:scale-110 ${i % 2 ? "bg-burgundy text-gold" : "bg-gold text-burgundy"}`}><Play className="ml-1 size-7" /></span>
                    </span>
                    <span className="text-sm font-semibold">{t} — watch on TikTok ↗</span>
                  </a>
                ))}
          </div>
        </div>
      </section>

      {/* ───────── How it works ───────── */}
      <section className="py-20 sm:py-24">
        <div className="container-x">
          <div data-reveal="zoom" className="relative overflow-hidden rounded-[32px] bg-burgundy px-6 py-14 text-white sm:px-12">
            <span aria-hidden="true" className="absolute inset-0 opacity-10 dots" />
            <div className="relative flex flex-col gap-10">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <SectionHeading light eyebrow="How it works" title="Book a session in three simple steps" />
                <Link href="/book" className="btn-gold">Book now <Arrow /></Link>
              </div>
              <ol className="grid gap-5 md:grid-cols-3">
                {[
                  ["Choose a service", "NCLEX or CELPIP coaching, English, mentorship — or a free discovery call."],
                  ["Pick a date & time", "Open times are shown in your own timezone."],
                  ["Pay & get confirmed", "Mobile Money or card. Your confirmation and meeting link arrive by email."],
                ].map(([t, d], i) => (
                  <li key={t} data-reveal style={delay(i * 130)} className="flex flex-col gap-3 rounded-2xl bg-white/[0.07] p-7 ring-1 ring-white/15 transition-colors hover:bg-white/[0.12]">
                    <span className="grid size-12 place-items-center rounded-full bg-gold font-display text-lg text-burgundy">{i + 1}</span>
                    <h3 className="text-xl text-white">{t}</h3>
                    <p className="text-white/80">{d}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Meet your mentor ───────── */}
      <section className="pb-20 sm:pb-24">
        <div className="container-x grid items-stretch gap-5 md:grid-cols-[1fr_1.1fr_1fr]">
          <div data-reveal className="flex flex-col justify-between gap-8 rounded-[28px] border border-line p-8">
            <Eyebrow>Your mentor</Eyebrow>
            <h2 className="text-3xl leading-tight">Meet the nurse behind the academy</h2>
            <p className="text-muted">Every program is designed and taught by {site.founder.name} — Registered Nurse, nursing educator and mentor — drawing on her professional journey across different countries.</p>
          </div>
          <div data-reveal style={delay(120)} className="group relative min-h-[420px] overflow-hidden rounded-[28px]">
            <Photo m={{ ...media.mentor, label: undefined }} className="absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-burgundy-dark/90 to-transparent p-6 pt-20 text-white">
              <div><p className="font-serif text-2xl">{site.founder.name}</p><p className="text-sm text-white/80">{site.founder.title}</p></div>
              <Link href="/about" className="btn btn-sm bg-white text-burgundy">View profile <Arrow /></Link>
            </div>
          </div>
          <div data-reveal style={delay(240)} className="flex flex-col justify-between gap-6 rounded-[28px] bg-gold p-8 text-charcoal">
            <p className="font-serif text-2xl leading-snug text-burgundy">Not sure where to start?</p>
            <p>Book a free 15-minute discovery call and we&apos;ll point you to the right department.</p>
            <div className="flex flex-col gap-3">
              <Link href="/book?service=discovery-call" className="btn-primary">Free discovery call</Link>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn border border-burgundy/30 text-burgundy hover:bg-white/40">Ask on WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Testimonials (hidden until real ones are added) ───────── */}
      {testimonials.length > 0 && (
        <section className="bg-ivory py-20 sm:py-24">
          <div className="container-x flex flex-col gap-10">
            <SectionHeading center eyebrow="Testimonials" title="Stories from our learners" />
            <div className="grid gap-5 md:grid-cols-3">
              {testimonials.map((t) => (
                <figure key={t.name} className="m-0 flex flex-col gap-5 rounded-3xl bg-white p-7">
                  <span aria-hidden="true" className="font-serif text-6xl leading-none text-gold">&ldquo;</span>
                  <blockquote className="font-serif text-lg">{t.quote}</blockquote>
                  <figcaption className="text-sm"><strong>{t.name}</strong><br /><span className="text-muted">{t.detail}</span></figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────── Blog ───────── */}
      {posts.length > 0 && (
        <section className="py-20 sm:py-24">
          <div className="container-x flex flex-col gap-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow="Latest insights" title="Guides & updates from the blog" />
              <Link href="/blog" className="btn-outline">All articles <Arrow /></Link>
            </div>
            <div className="grid gap-8 md:grid-cols-3">{posts.map((p) => <PostCard key={String(p._id)} post={p} />)}</div>
          </div>
        </section>
      )}

      {/* ───────── Let's connect ───────── */}
      <section className="pb-16">
        <div className="container-x">
          <div data-reveal className="grid overflow-hidden rounded-[32px] bg-ivory lg:grid-cols-[1.1fr_1fr]">
            <div className="flex flex-col gap-6 p-7 sm:p-12">
              <SectionHeading eyebrow="Let's connect" title="Have a question? We'd love to help." />
              <ContactForm />
            </div>
            <div className="relative hidden min-h-[520px] lg:block">
              <Photo m={media.connect} className="absolute inset-0" />
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="absolute right-6 bottom-6 left-6 flex items-center justify-between gap-4 rounded-2xl bg-white p-5 text-charcoal no-underline shadow-lg">
                <span><strong className="block">Prefer WhatsApp?</strong><span className="text-sm text-muted">It&apos;s usually the quickest way to reach us.</span></span>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#25D366] text-white"><Arrow className="size-5 -rotate-45" /></span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
