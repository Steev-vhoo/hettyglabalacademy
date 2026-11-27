"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { media } from "@/lib/media";
import { whatsappLink } from "@/lib/site";
import { Photo, Sparkle } from "./brand";
import { Check, Close } from "./icons";

const DISMISS_KEY = "hga-booking-popup-dismissed";
const SHOWN_KEY = "hga-booking-popup-shown";
const DISMISS_DAYS = 7;
const DELAY_MS = 12_000;
const SKIP = ["/book", "/admin", "/account", "/login", "/register", "/privacy", "/terms"];

const store = {
  get: (s: Storage, k: string) => { try { return s.getItem(k); } catch { return null; } },
  set: (s: Storage, k: string, v: string) => { try { s.setItem(k, v); } catch { /* storage blocked: just show less often */ } },
};

/**
 * Invites first-time visitors to book a one-on-one session.
 * Shows once per visit — after 12 seconds, after scrolling ~45% of a page, or when the mouse heads for the
 * browser tabs — and stays away for 7 days once closed.
 */
export function BookingPopup() {
  const path = usePathname();
  const ref = useRef<HTMLDialogElement>(null);

  const close = useCallback(() => {
    store.set(localStorage, DISMISS_KEY, String(Date.now()));
    ref.current?.close();
  }, []);

  useEffect(() => {
    if (SKIP.some((p) => path.startsWith(p))) return;
    if (store.get(sessionStorage, SHOWN_KEY)) return;
    const dismissed = Number(store.get(localStorage, DISMISS_KEY) || 0);
    if (Date.now() - dismissed < DISMISS_DAYS * 86400_000) return;

    let done = false;
    const open = () => {
      if (done || !ref.current || ref.current.open || document.querySelector("dialog[open]")) return;
      done = true;
      store.set(sessionStorage, SHOWN_KEY, "1");
      ref.current.showModal();
      cleanup();
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max > 0.45) open();
    };
    const onLeave = (e: MouseEvent) => { if (e.clientY <= 0) open(); };
    const timer = window.setTimeout(open, DELAY_MS);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseout", onLeave);
    function cleanup() {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onLeave);
    }
    return cleanup;
  }, [path]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="popup-title"
      onCancel={(e) => { e.preventDefault(); close(); }}
      onClick={(e) => { if (e.target === ref.current) close(); }}
      className="hga-popup m-auto max-h-[92vh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-[28px] bg-white p-0 text-charcoal shadow-2xl"
    >
      <div className="grid sm:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden sm:block">
          <Photo m={media.popup} zoom={false} className="absolute inset-0" sizes="320px" />
          <div className="absolute inset-0 bg-gradient-to-t from-burgundy-dark/70 via-transparent to-transparent" />
          <p className="absolute right-5 bottom-5 left-5 font-serif text-lg text-white">Harriet K<br /><span className="font-sans text-sm text-white/85">Registered Nurse · Founder</span></p>
        </div>
        <div className="relative flex flex-col gap-5 p-7 sm:p-9">
          <button type="button" onClick={close} aria-label="Close" className="absolute top-3 right-3 grid size-11 place-items-center rounded-full text-muted hover:bg-ivory hover:text-charcoal">
            <Close className="size-5" />
          </button>
          <Photo m={{ ...media.popup, label: undefined, focus: "50% 12%" }} zoom={false} sizes="64px" className="size-16 rounded-full ring-4 ring-gold-soft sm:hidden" />
          <span className="eyebrow"><Sparkle className="size-4 animate-twinkle text-gold" />One-on-one with Harriet</span>
          <h2 id="popup-title" className="pr-8 text-3xl leading-tight sm:text-[34px]">Get personal guidance for your next step</h2>
          <p className="text-muted">A private online session built around you — NCLEX, CELPIP, English or career planning.</p>
          <ul className="flex flex-col gap-2.5 text-[15px]">
            {["A plan tailored to your goals and timeline", "Honest feedback from a Registered Nurse", "Times shown in your own timezone"].map((t) => (
              <li key={t} className="flex items-center gap-2.5"><span className="grid size-6 place-items-center rounded-full bg-burgundy text-gold"><Check className="size-3.5" /></span>{t}</li>
            ))}
          </ul>
          <div className="flex flex-col gap-2.5 pt-1">
            <Link href="/book" onClick={close} className="btn-primary min-h-12">Book a one-on-one session</Link>
            <Link href="/book?service=discovery-call" onClick={close} className="btn-outline min-h-12">Start with a free 15-min call</Link>
          </div>
          <p className="text-center text-sm text-muted">
            Questions first? <a href={whatsappLink("Hello Harriet, I'd like to ask about a one-on-one session.")} target="_blank" rel="noopener noreferrer" onClick={close}>Message us on WhatsApp</a>
          </p>
        </div>
      </div>
    </dialog>
  );
}
