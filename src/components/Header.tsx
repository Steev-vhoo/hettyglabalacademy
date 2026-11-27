"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site, tiktokProfileUrl, whatsappLink } from "@/lib/site";
import { Logo } from "./Logo";
import { Chat, Close, Menu } from "./icons";

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  // Session is looked up in the browser so public pages can stay statically cached.
  const [me, setMe] = useState<{ signedIn: boolean; isAdmin: boolean }>({ signedIn: false, isAdmin: false });
  useEffect(() => {
    fetch("/api/me", { cache: "no-store" })
      .then((r) => r.json())
      .then(setMe)
      .catch(() => {});
  }, [path]);
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  const account = me.isAdmin ? { href: "/admin", label: "Dashboard" } : me.signedIn ? { href: "/account", label: "My account" } : { href: "/login", label: "Sign in" };
  const socials = [
    { href: tiktokProfileUrl, label: "TikTok" },
    site.social.instagram && { href: site.social.instagram, label: "Instagram" },
    site.social.facebook && { href: site.social.facebook, label: "Facebook" },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <>
      {/* Top bar */}
      <div className="hidden bg-burgundy text-[13px] text-white md:block">
        <div className="container-x flex items-stretch justify-between gap-6">
          <div className="flex items-center gap-6 py-2.5">
            <a href={`mailto:${site.email}`} className="text-white/90 no-underline hover:text-white">{site.email}</a>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-white/90 no-underline hover:text-white"><Chat className="size-4 text-gold" />WhatsApp us</a>
            <span className="text-white/70">Online classes · Ghana, Canada &amp; worldwide</span>
          </div>
          <div className="my-1.5 flex items-center gap-4 rounded-full bg-gold px-5 text-charcoal">
            <span className="font-semibold">Follow</span>
            {socials.map((s) => <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="font-medium text-charcoal no-underline hover:underline">{s.label}</a>)}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="container-x flex items-center justify-between gap-4 py-3">
          <Logo />
          <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} aria-current={active(n.href) ? "page" : undefined}
                className={`text-[15px] font-medium no-underline hover:text-burgundy ${active(n.href) ? "text-burgundy underline decoration-gold decoration-2 underline-offset-8" : "text-charcoal"}`}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-4 lg:flex">
            <Link href={account.href} className="text-[15px] font-medium text-charcoal no-underline hover:text-burgundy">{account.label}</Link>
            <Link href="/book" className="btn-primary">Book a session</Link>
          </div>
          <button type="button" className="grid size-11 place-items-center rounded-full lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <Close /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav aria-label="Mobile" className="border-t border-line bg-white lg:hidden">
            <div className="container-x flex flex-col py-3">
              {[...nav, account].map((n) => (
                <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-line/60 text-base font-medium text-charcoal no-underline">{n.label}</Link>
              ))}
              <Link href="/book" onClick={() => setOpen(false)} className="btn-primary mt-4">Book a session</Link>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
