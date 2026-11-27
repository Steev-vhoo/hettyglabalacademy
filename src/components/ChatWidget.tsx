"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { sendContact } from "@/actions/public";
import { initialState } from "@/actions/types";
import { media } from "@/lib/media";
import { site, whatsappLink } from "@/lib/site";
import { Photo } from "./brand";
import { Chat, Close } from "./icons";
import { SubmitButton } from "./forms/SubmitButton";

const TOPICS = [
  { t: "Student enquiry", msg: "Hello, I have a question as a student." },
  { t: "Course information", msg: "Hello, I'd like information about your courses." },
  { t: "Registration help", msg: "Hello, I need help registering." },
  { t: "Booking support", msg: "Hello, I need help with a booking." },
  { t: "General enquiry", msg: "Hello Hetty Global Academy, I have a question." },
];

/**
 * Lightweight "live chat": quick topics open WhatsApp with a ready-made message,
 * or visitors can leave a message that lands in Admin › Messages and Harriet's email.
 * No paid chat service or third-party scripts.
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"topics" | "form">("topics");
  const [topic, setTopic] = useState(TOPICS[0].t);
  const [state, action] = useActionState(sendContact, initialState);
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); toggle.current?.focus(); } };
    document.addEventListener("keydown", onKey);
    panel.current?.querySelector<HTMLElement>("button, a, input")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-5 sm:bottom-5">
      {open && (
        <div ref={panel} role="dialog" aria-label="Chat with Hetty Global Academy" className="w-[min(360px,calc(100vw-2rem))] animate-pop overflow-hidden rounded-[24px] bg-white shadow-2xl ring-1 ring-black/5">
          <div className="flex items-center gap-3 bg-burgundy p-4 text-white">
            <Photo m={{ ...media.popup, label: undefined, focus: "50% 12%" }} zoom={false} sizes="44px" className="size-11 shrink-0 rounded-full ring-2 ring-gold" />
            <div className="flex-1">
              <p className="font-serif text-lg leading-tight">Hetty Global Academy</p>
              <p className="flex items-center gap-1.5 text-xs text-white/80"><span className="size-2 rounded-full bg-[#25D366]" />We usually reply on WhatsApp</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="grid size-10 place-items-center rounded-full hover:bg-white/10"><Close className="size-5" /></button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-4">
            <p className="mb-3 rounded-2xl rounded-tl-sm bg-ivory px-4 py-3 text-sm">
              Hello! How can we help you today? Choose a topic to chat with us on WhatsApp, or leave a message.
            </p>

            {mode === "topics" ? (
              <div className="flex flex-col gap-2">
                {TOPICS.map((x) => (
                  <a key={x.t} href={whatsappLink(x.msg)} target="_blank" rel="noopener noreferrer"
                    className="flex min-h-11 items-center justify-between rounded-xl border border-line px-4 text-sm font-semibold text-charcoal no-underline transition-colors hover:border-burgundy hover:bg-burgundy-soft">
                    {x.t}<span aria-hidden="true" className="text-gold-dark">→</span>
                  </a>
                ))}
                <button type="button" onClick={() => setMode("form")} className="mt-1 min-h-11 rounded-xl bg-burgundy px-4 text-sm font-semibold text-white hover:bg-burgundy-dark">
                  Leave a message instead
                </button>
                <p className="mt-1 text-center text-xs text-muted">
                  Or <Link href="/book" onClick={() => setOpen(false)}>book a session</Link> · <a href={`mailto:${site.email}`}>email us</a>
                </p>
              </div>
            ) : state.ok ? (
              <p role="status" className="rounded-2xl bg-[#e7f3ea] px-4 py-3 text-sm text-[#1c5a35]">{state.message}</p>
            ) : (
              <form action={action} className="flex flex-col gap-2.5">
                {state.error && <p role="alert" className="text-sm text-[#8a1c1c]">{state.error}</p>}
                <label className="sr-only" htmlFor="cw-topic">Topic</label>
                <select id="cw-topic" name="topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="input min-h-11 text-sm">
                  {TOPICS.map((x) => <option key={x.t}>{x.t}</option>)}
                </select>
                <label className="sr-only" htmlFor="cw-name">Your name</label>
                <input id="cw-name" name="name" required placeholder="Your name" autoComplete="name" className="input min-h-11 text-sm" />
                <label className="sr-only" htmlFor="cw-email">Email</label>
                <input id="cw-email" name="email" type="email" required placeholder="Email" autoComplete="email" className="input min-h-11 text-sm" />
                <label className="sr-only" htmlFor="cw-phone">WhatsApp number (optional)</label>
                <input id="cw-phone" name="phone" type="tel" placeholder="WhatsApp number (optional)" autoComplete="tel" className="input min-h-11 text-sm" />
                <label className="sr-only" htmlFor="cw-msg">Message</label>
                <textarea id="cw-msg" name="message" required minLength={10} placeholder="Your message" className="input min-h-24 text-sm" />
                <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                <SubmitButton className="btn-primary min-h-11" pendingText="Sending…">Send message</SubmitButton>
                <button type="button" onClick={() => setMode("topics")} className="text-sm text-muted underline">Back to topics</button>
              </form>
            )}
          </div>
        </div>
      )}

      <button
        ref={toggle}
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Chat with us"}
        className="group flex h-15 items-center gap-2 rounded-full bg-[#25D366] pr-5 pl-4 text-white shadow-lg shadow-black/20 transition-transform hover:scale-105"
      >
        {open ? <Close className="size-7" /> : <Chat className="size-7" />}
        <span className="hidden text-sm font-semibold sm:inline">{open ? "Close" : "Chat with us"}</span>
      </button>
    </div>
  );
}
