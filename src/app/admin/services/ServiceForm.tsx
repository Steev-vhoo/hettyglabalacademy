"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { saveService } from "@/actions/admin";
import { initialState } from "@/actions/types";
import { ACADEMIES } from "@/lib/constants";
import { Notice } from "@/components/ui";
import { FieldError, SubmitButton } from "@/components/forms/SubmitButton";

export type ServiceInput = {
  id: string; name: string; kind: "consultation" | "course"; academy: string; summary: string; durationMin: number;
  priceGHS: string; priceCAD: string; startDate: string; schedule: string; seats: number; order: number; active: boolean;
};

export function ServiceForm({ s }: { s: ServiceInput }) {
  const [state, action] = useActionState(saveService, initialState);
  const [kind, setKind] = useState(s.kind);
  const f = state.fields ?? {};
  return (
    <form action={action} className="flex flex-col gap-4 self-start rounded-2xl border border-line bg-white p-6">
      <h2 className="text-xl">{s.id ? "Edit service" : "New service"}</h2>
      {state.error && <Notice tone="error">{state.error}</Notice>}
      <input type="hidden" name="id" value={s.id} />
      <div><label className="label" htmlFor="sv-name">Name</label><input className="input" id="sv-name" name="name" defaultValue={s.name} required /><FieldError id="sv-name-e" msg={f.name} /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="sv-kind">Type</label>
          <select className="input" id="sv-kind" name="kind" value={kind} onChange={(e) => setKind(e.target.value as ServiceInput["kind"])}>
            <option value="consultation">Session (pick a time)</option>
            <option value="course">Course (enrol)</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="sv-academy">Academy</label>
          <select className="input" id="sv-academy" name="academy" defaultValue={s.academy}>{ACADEMIES.map((a) => <option key={a}>{a}</option>)}</select>
        </div>
      </div>
      <div><label className="label" htmlFor="sv-summary">Short description</label><input className="input" id="sv-summary" name="summary" defaultValue={s.summary} maxLength={300} /></div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className="label" htmlFor="sv-ghs">Price GHS</label><input className="input" id="sv-ghs" name="priceGHS" inputMode="decimal" defaultValue={s.priceGHS} placeholder="e.g. 300" /><FieldError id="sv-ghs-e" msg={f.priceGHS} /></div>
        <div><label className="label" htmlFor="sv-cad">Price CAD</label><input className="input" id="sv-cad" name="priceCAD" inputMode="decimal" defaultValue={s.priceCAD} placeholder="e.g. 60" /><FieldError id="sv-cad-e" msg={f.priceCAD} /></div>
        <div><label className="label" htmlFor="sv-dur">Minutes</label><input className="input" id="sv-dur" name="durationMin" type="number" min={10} defaultValue={s.durationMin} /></div>
      </div>
      {kind === "course" && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div><label className="label" htmlFor="sv-start">Start date</label><input className="input" id="sv-start" name="startDate" type="date" defaultValue={s.startDate} /></div>
          <div><label className="label" htmlFor="sv-seats">Places (0 = no limit)</label><input className="input" id="sv-seats" name="seats" type="number" min={0} defaultValue={s.seats} /></div>
          <div className="sm:col-span-3"><label className="label" htmlFor="sv-sched">Schedule</label><input className="input" id="sv-sched" name="schedule" defaultValue={s.schedule} placeholder="e.g. 8 weeks · Saturdays 10:00 GMT" /></div>
        </div>
      )}
      {kind !== "course" && <><input type="hidden" name="seats" value={s.seats} /><input type="hidden" name="schedule" value={s.schedule} /></>}
      <div className="grid items-end gap-4 sm:grid-cols-2">
        <div><label className="label" htmlFor="sv-order">Display order</label><input className="input" id="sv-order" name="order" type="number" defaultValue={s.order} /></div>
        <label className="flex min-h-12 items-center gap-2 text-sm font-semibold"><input type="checkbox" name="active" defaultChecked={s.active} className="size-[18px] accent-[#4a2832]" />Bookable on the website</label>
      </div>
      <div className="flex gap-2"><SubmitButton pendingText="Saving…">Save</SubmitButton><Link href="/admin/services" className="btn-outline">Close</Link></div>
    </form>
  );
}
