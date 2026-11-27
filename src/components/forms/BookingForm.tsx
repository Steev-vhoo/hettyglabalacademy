"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { createBooking } from "@/actions/booking";
import { initialState } from "@/actions/types";
import { money } from "@/lib/format";
import { Notice } from "../ui";
import { Lock } from "../icons";
import { FieldError, SubmitButton } from "./SubmitButton";

export type ServiceOption = {
  id: string;
  slug: string;
  name: string;
  kind: "consultation" | "course";
  summary: string;
  durationMin: number;
  priceGHS: number | null;
  priceCAD: number | null;
  startDate?: string;
  schedule?: string;
  seatsLeft?: number | null;
};

type Props = {
  services: ServiceOption[];
  initialSlug?: string;
  prefill?: { name?: string; email?: string; phone?: string; country?: string };
  providers: { paystack: boolean; stripe: boolean };
  cancelled?: boolean;
};

const priceLabel = (s: ServiceOption) => {
  if (isFree(s)) return "Free";
  return [s.priceGHS != null && money(s.priceGHS, "GHS"), s.priceCAD != null && money(s.priceCAD, "CAD")].filter(Boolean).join(" · ");
};
const isFree = (s: ServiceOption) => s.priceGHS === 0 || s.priceCAD === 0 || (s.priceGHS == null && s.priceCAD == null);

export function BookingForm({ services, initialSlug, prefill, providers, cancelled }: Props) {
  const [state, action] = useActionState(createBooking, initialState);
  const [serviceId, setServiceId] = useState(services.find((s) => s.slug === initialSlug)?.id ?? services[0]?.id ?? "");
  const service = services.find((s) => s.id === serviceId);
  const [slots, setSlots] = useState<string[] | null>(null);
  const [slotError, setSlotError] = useState(false);
  const [day, setDay] = useState<string>("");
  const [slot, setSlot] = useState<string>("");
  const [tz, setTz] = useState("UTC");
  const f = state.fields ?? {};

  useEffect(() => setTz(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"), []);

  useEffect(() => {
    setSlot("");
    setDay("");
    setSlots(null);
    setSlotError(false);
    if (!service || service.kind !== "consultation") return;
    const ctrl = new AbortController();
    fetch(`/api/slots?service=${service.id}`, { signal: ctrl.signal, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j: { slots: string[] }) => setSlots(j.slots))
      .catch((e) => e?.name !== "AbortError" && setSlotError(true));
    return () => ctrl.abort();
  }, [service]);

  // Group slots by the visitor's local calendar day.
  const byDay = useMemo(() => {
    const m = new Map<string, string[]>();
    const key = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" });
    for (const s of slots ?? []) {
      const k = key.format(new Date(s));
      m.set(k, [...(m.get(k) ?? []), s]);
    }
    return m;
  }, [slots, tz]);
  const days = [...byDay.keys()];
  const activeDay = day || days[0] || "";
  const dayLabel = (k: string) => new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${k}T12:00:00Z`));
  const timeLabel = (iso: string) => new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: tz }).format(new Date(iso));

  const payOptions = service && !isFree(service)
    ? ([
        { id: "paystack", label: "Mobile Money or card (GHS)", note: "via Paystack — MTN MoMo, Telecel Cash, AirtelTigo, Visa, Mastercard", price: service.priceGHS, on: providers.paystack },
        { id: "stripe", label: "International card (CAD)", note: "via Stripe — Visa, Mastercard, Amex, Apple Pay, Google Pay", price: service.priceCAD, on: providers.stripe },
      ] as const).filter((p) => p.price != null && p.on)
    : [];

  return (
    <form action={action} className="flex flex-col gap-12" noValidate>
      {cancelled && <Notice>Payment was cancelled — your time was not booked. You can try again below.</Notice>}
      {state.error && <Notice tone="error">{state.error}</Notice>}
      <input type="hidden" name="timezone" value={tz} />

      {/* 1. Service */}
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-4 font-serif text-2xl text-burgundy">1. Choose a service</legend>
        {services.length === 0 && <Notice>Bookings open soon. Please message us on WhatsApp in the meantime.</Notice>}
        {services.map((s) => (
          <label key={s.id} className={`flex cursor-pointer items-start gap-3 rounded-2xl border-[1.5px] p-4 transition-colors ${s.id === serviceId ? "border-burgundy bg-burgundy-soft" : "border-line bg-white hover:border-gold"}`}>
            <input type="radio" name="serviceId" value={s.id} checked={s.id === serviceId} onChange={() => setServiceId(s.id)} className="mt-1 size-[18px] accent-[#4a2832]" />
            <span className="flex-1">
              <span className="block font-semibold">{s.name}</span>
              <span className="block text-sm text-muted">
                {s.kind === "course" ? `Course${s.startDate ? ` · starts ${new Date(s.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}` : ""}${s.schedule ? ` · ${s.schedule}` : ""}` : `${s.durationMin} min · online`}
                {s.summary ? ` — ${s.summary}` : ""}
              </span>
              {s.kind === "course" && s.seatsLeft != null && <span className="mt-1 block text-xs font-semibold text-gold-dark">{s.seatsLeft > 0 ? `${s.seatsLeft} places left` : "Full — join the waiting list on WhatsApp"}</span>}
            </span>
            <span className="text-right text-sm font-semibold">{priceLabel(s)}</span>
          </label>
        ))}
      </fieldset>

      {/* 2. Date & time */}
      {service?.kind === "consultation" && (
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-4 font-serif text-2xl text-burgundy">2. Pick a date &amp; time</legend>
          <p className="text-sm text-muted">Times are shown in your timezone: <strong className="text-charcoal">{tz.replace(/_/g, " ")}</strong></p>
          {slotError && <Notice tone="error">We couldn&apos;t load available times. Please refresh, or message us on WhatsApp.</Notice>}
          {slots === null && !slotError && <p className="text-sm text-muted" role="status">Loading available times…</p>}
          {slots?.length === 0 && <Notice>No times are open right now. Message us on WhatsApp and we&apos;ll find one for you.</Notice>}
          {days.length > 0 && (
            <>
              <div className="flex gap-2 overflow-x-auto pb-2" role="radiogroup" aria-label="Day">
                {days.map((k) => (
                  <button key={k} type="button" role="radio" aria-checked={k === activeDay} onClick={() => { setDay(k); setSlot(""); }}
                    className={`min-h-14 shrink-0 rounded-xl border-[1.5px] px-4 text-sm font-semibold ${k === activeDay ? "border-burgundy bg-burgundy text-white" : "border-line bg-white text-charcoal hover:border-gold"}`}>
                    {dayLabel(k)}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Time">
                {(byDay.get(activeDay) ?? []).map((s) => (
                  <button key={s} type="button" role="radio" aria-checked={s === slot} onClick={() => setSlot(s)}
                    className={`min-h-11 rounded-xl border-[1.5px] text-sm font-medium ${s === slot ? "border-burgundy bg-burgundy text-white" : "border-line bg-white text-charcoal hover:border-gold"}`}>
                    {timeLabel(s)}
                  </button>
                ))}
              </div>
            </>
          )}
          <input type="hidden" name="slot" value={slot} />
          <FieldError id="slot-e" msg={f.slot} />
        </fieldset>
      )}

      {/* 3. Details */}
      <fieldset className="flex flex-col gap-5">
        <legend className="mb-4 font-serif text-2xl text-burgundy">{service?.kind === "consultation" ? "3" : "2"}. Your details</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="b-name">Full name</label>
            <input className="input" id="b-name" name="name" autoComplete="name" defaultValue={prefill?.name} required aria-invalid={!!f.name} aria-describedby="b-name-e" />
            <FieldError id="b-name-e" msg={f.name} />
          </div>
          <div>
            <label className="label" htmlFor="b-email">Email</label>
            <input className="input" id="b-email" name="email" type="email" autoComplete="email" defaultValue={prefill?.email} required aria-invalid={!!f.email} aria-describedby="b-email-e" />
            <FieldError id="b-email-e" msg={f.email} />
          </div>
          <div>
            <label className="label" htmlFor="b-phone">WhatsApp number</label>
            <input className="input" id="b-phone" name="phone" type="tel" autoComplete="tel" placeholder="+233 …" defaultValue={prefill?.phone} required aria-invalid={!!f.phone} aria-describedby="b-phone-e" />
            <FieldError id="b-phone-e" msg={f.phone} />
          </div>
          <div>
            <label className="label" htmlFor="b-country">Country you live in</label>
            <input className="input" id="b-country" name="country" autoComplete="country-name" defaultValue={prefill?.country} />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="b-stage">Where are you in your journey?</label>
          <select className="input" id="b-stage" name="stage" defaultValue="">
            <option value="">Choose one (optional)</option>
            <option>Nursing student</option>
            <option>Qualified nurse in Ghana</option>
            <option>Preparing to move abroad</option>
            <option>Already living abroad</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="b-notes">What would you like help with? (optional)</label>
          <textarea className="input min-h-28" id="b-notes" name="notes" maxLength={2000} />
        </div>
      </fieldset>

      {/* 4. Payment */}
      {payOptions.length > 0 && (
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-4 font-serif text-2xl text-burgundy">{service?.kind === "consultation" ? "4" : "3"}. Payment</legend>
          {payOptions.map((p, i) => (
            <label key={p.id} className="flex cursor-pointer items-start gap-3 rounded-2xl border-[1.5px] border-line bg-white p-4 has-[:checked]:border-burgundy has-[:checked]:bg-burgundy-soft">
              <input type="radio" name="provider" value={p.id} defaultChecked={i === 0} className="mt-1 size-[18px] accent-[#4a2832]" />
              <span className="flex-1"><span className="block font-semibold">{p.label}</span><span className="block text-sm text-muted">{p.note}</span></span>
              <span className="font-semibold">{money(p.price, p.id === "paystack" ? "GHS" : "CAD")}</span>
            </label>
          ))}
          <FieldError id="provider-e" msg={f.provider} />
          <p className="flex items-center gap-2 text-sm text-muted"><Lock className="size-4" /> You&apos;ll pay on the provider&apos;s secure page. Your time is held for 30 minutes while you pay.</p>
        </fieldset>
      )}
      {service && !isFree(service) && payOptions.length === 0 && (
        <Notice>Online payment isn&apos;t switched on yet. Please message us on WhatsApp to book this service.</Notice>
      )}

      <div className="flex flex-col gap-4">
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" name="consent" className="mt-0.5 size-[18px] accent-[#4a2832]" aria-describedby="consent-e" />
          <span>I agree to the <a href="/terms" target="_blank">booking terms</a> and <a href="/privacy" target="_blank">privacy policy</a>, and I&apos;m happy to be contacted on WhatsApp about this booking.</span>
        </label>
        <FieldError id="consent-e" msg={f.consent} />
        <div>
          <SubmitButton pendingText="Processing…">
            {service && !isFree(service) ? "Continue to secure payment" : "Confirm booking"}
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
