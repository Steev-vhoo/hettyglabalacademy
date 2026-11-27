"use client";

import { useActionState } from "react";
import { updateBooking } from "@/actions/admin";
import { initialState } from "@/actions/types";
import { STATUS_LABEL } from "@/lib/format";
import { BOOKING_STATUSES } from "@/lib/constants";
import { Notice } from "@/components/ui";
import { FieldError, SubmitButton } from "@/components/forms/SubmitButton";

type B = {
  id: string; name: string; email: string; phone: string; country: string; stage: string; notes: string;
  serviceName: string; when: string; clientWhen: string; status: string; payment: string; reference: string;
  meetingLink: string; adminNotes: string; phoneDigits: string;
};

export function BookingEditor({ b }: { b: B }) {
  const [state, action] = useActionState(updateBooking, initialState);
  const row = (k: string, v: React.ReactNode) => v ? <div><dt className="text-xs text-muted">{k}</dt><dd className="text-sm font-medium">{v}</dd></div> : null;
  return (
    <section className="flex flex-col gap-4 self-start rounded-2xl border border-line bg-white p-5 sm:p-6">
      <h2 className="text-xl">{b.name}</h2>
      <dl className="grid grid-cols-2 gap-3">
        {row("Service", b.serviceName)}
        {row("Your time", b.when)}
        {row("Client's time", b.clientWhen)}
        {row("Payment", b.payment)}
        {row("Email", <a href={`mailto:${b.email}`}>{b.email}</a>)}
        {row("Phone", b.phone)}
        {row("Country", b.country)}
        {row("Stage", b.stage)}
        {row("Reference", <span className="font-mono text-xs">{b.reference}</span>)}
      </dl>
      {b.notes && <div className="rounded-xl bg-ivory p-3 text-sm"><span className="text-xs text-muted">Client note</span><br />{b.notes}</div>}
      {b.phoneDigits && (
        <a className="btn-outline btn-sm self-start border-line" target="_blank" rel="noopener noreferrer"
          href={`https://wa.me/${b.phoneDigits}?text=${encodeURIComponent(`Hello ${b.name.split(" ")[0]}, this is Harriet from Hetty Global Academy about your ${b.serviceName} booking.`)}`}>
          Message on WhatsApp
        </a>
      )}
      <form action={action} className="flex flex-col gap-4 border-t border-line pt-4">
        {state.error && <Notice tone="error">{state.error}</Notice>}
        {state.ok && <Notice tone="success">{state.message}</Notice>}
        <input type="hidden" name="id" value={b.id} />
        <div>
          <label className="label" htmlFor="be-status">Status</label>
          <select className="input" id="be-status" name="status" defaultValue={b.status}>
            {BOOKING_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="be-link">Meeting link</label>
          <input className="input" id="be-link" name="meetingLink" type="url" placeholder="https://meet.google.com/…" defaultValue={b.meetingLink} />
          <FieldError id="be-link-e" msg={state.fields?.meetingLink} />
        </div>
        <div>
          <label className="label" htmlFor="be-notes">Private notes</label>
          <textarea className="input min-h-24" id="be-notes" name="adminNotes" defaultValue={b.adminNotes} />
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="notify" defaultChecked className="size-4 accent-[#4a2832]" />Email the client when confirming or cancelling</label>
        <SubmitButton pendingText="Saving…">Save changes</SubmitButton>
      </form>
    </section>
  );
}
