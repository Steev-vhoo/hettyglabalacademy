import Image from "next/image";
import Link from "next/link";
import { nav, site, tiktokProfileUrl, whatsappLink } from "@/lib/site";
import { programs } from "@/lib/programs";
import { NewsletterForm } from "./forms/NewsletterForm";

export function Footer() {
  const socials = [
    { href: tiktokProfileUrl, label: "TikTok" },
    site.social.instagram && { href: site.social.instagram, label: "Instagram" },
    site.social.facebook && { href: site.social.facebook, label: "Facebook" },
  ].filter(Boolean) as { href: string; label: string }[];
  const link = "text-[#ede6da]/85 no-underline hover:text-gold";

  return (
    <footer className="mt-10 bg-charcoal text-[#ede6da]">
      {/* Newsletter band */}
      <div className="container-x">
        <div className="relative -top-10 -mb-4 flex flex-wrap items-center justify-between gap-6 rounded-[28px] bg-burgundy px-6 py-8 sm:px-10">
          <span aria-hidden="true" className="absolute inset-0 rounded-[28px] opacity-10 dots" />
          <div className="relative max-w-md">
            <p className="font-serif text-2xl text-white">Get new guides &amp; course dates first</p>
            <p className="text-sm text-white/75">NCLEX, CELPIP and career tips — one email when something new is posted.</p>
          </div>
          <div className="relative w-full max-w-md"><NewsletterForm /></div>
        </div>
      </div>

      <div className="container-x grid gap-10 pb-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Image src="/brand/crest-transparent.webp" alt="" width={96} height={70} className="h-[70px] w-24 object-contain" />
            <span className="flex flex-col leading-tight">
              <span className="font-display text-2xl font-bold tracking-[0.04em] text-white">HETTY</span>
              <span className="font-display text-xs tracking-[0.22em] text-gold">GLOBAL ACADEMY</span>
            </span>
          </div>
          <p className="max-w-xs font-serif text-lg text-white/90">{site.tagline}</p>
          <div className="flex flex-wrap gap-2">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/20 px-4 py-2 text-sm text-white no-underline hover:border-gold hover:text-gold">{s.label}</a>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-4 font-display text-sm tracking-[0.16em] text-gold">ACADEMIES</h2>
          <ul className="space-y-2.5 text-sm">{programs.map((p) => <li key={p.slug}><Link className={link} href={`/programs/${p.slug}`}>{p.name}</Link></li>)}</ul>
        </div>
        <div>
          <h2 className="mb-4 font-display text-sm tracking-[0.16em] text-gold">EXPLORE</h2>
          <ul className="space-y-2.5 text-sm">
            {nav.slice(1).map((n) => <li key={n.href}><Link className={link} href={n.href}>{n.label}</Link></li>)}
            <li><Link className={link} href="/register">Student registration</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-4 font-display text-sm tracking-[0.16em] text-gold">GET IN TOUCH</h2>
          <ul className="space-y-2.5 text-sm">
            <li><Link className={link} href="/book">Book a session</Link></li>
            <li><a className={link} href={whatsappLink()}>WhatsApp</a></li>
            <li><a className={`${link} break-all`} href={`mailto:${site.email}`}>{site.email}</a></li>
            <li className="text-[#ede6da]/60">Online — Ghana, Canada &amp; worldwide</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-wrap justify-between gap-3 py-6 text-[13px] text-[#ede6da]/70">
          <span>© {new Date().getFullYear()} {site.name} · <span className="font-display tracking-[0.14em] text-gold/80">LEARN · GROW · EXCEL</span></span>
          <span className="flex gap-5">
            <Link className="text-[#ede6da]/70 no-underline hover:text-white" href="/privacy">Privacy</Link>
            <Link className="text-[#ede6da]/70 no-underline hover:text-white" href="/terms">Terms</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
