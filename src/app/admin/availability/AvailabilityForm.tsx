"use client";

import { useActionState } from "react";
import { saveAvailability } from "@/actions/admin";
import { initialState } from "@/actions/types";
import { minutesToHHMM, type SlotSettings } from "@/lib/slots";
import { Notice } from "@/components/ui";
import { SubmitButton } from "@/components/forms/SubmitButton";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const ZONES = ["America/Toronto", "America/Vancouver", "America/Edmonton", "America/Winnipeg", "America/Halifax", "Africa/Accra", "Europe/London", "America/New_York"];

export function AvailabilityForm({ settings }: { settings: SlotSettings }) {
  const [state, action] = useActionState(saveAvailability, initialState);
  const hours = (d: number) => settings.weekly.filter((w) => w.day === d).map((w) => `${minutesToHHMM(w.start)}-${minutesToHHMM(w.end)}`).join(", ");

  return (
    <form action={action} className="flex max-w-3xl flex-col gap-6">
      {state.error && <Notice tone="error">{state.error}</Notice>}
      {state.ok && <Notice tone="success">{state.message}</Notice>}

      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="mb-1 text-xl">Weekly hours</h2>
        <p className="mb-5 text-sm text-muted">Tick the days you work. Several ranges are fine, e.g. <code>09:00-12:00, 14:00-17:00</code>.</p>
        <div className="flex flex-col divide-y divide-line">
          {DAYS.map((name, d) => (
            <div key={d} className="flex flex-wrap items-center gap-4 py-3">
              <label className="flex w-36 items-center gap-2 font-semibold">
                <input type="checkbox" name={`on-${d}`} defaultChecked={settings.weekly.some((w) => w.day === d)} className="size-[18px] accent-[#4a2832]" />
                {name}
              </label>
              <label className="sr-only" htmlFor={`hours-${d}`}>{name} hours</label>
              <input id={`hours-${d}`} name={`hours-${d}`} className="input min-h-11 max-w-sm flex-1" defaultValue={hours(d) || "09:00-17:00"} />
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 rounded-2xl border border-line bg-white p-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="tz">Your timezone</label>
          <select className="input" id="tz" name="timezone" defaultValue={settings.timezone}>
            {[...new Set([settings.timezone, ...ZONES])].map((z) => <option key={z} value={z}>{z.replace(/_/g, " ")}</option>)}
          </select>
        </div>
        <div><label className="label" htmlFor="step">Start a slot every (minutes)</label><input className="input" id="step" name="slotStepMin" type="number" min={5} defaultValue={settings.slotStepMin} /></div>
        <div><label className="label" htmlFor="buffer">Break between sessions (minutes)</label><input className="input" id="buffer" name="bufferMin" type="number" min={0} defaultValue={settings.bufferMin} /></div>
        <div><label className="label" htmlFor="notice">Minimum notice (hours)</label><input className="input" id="notice" name="minNoticeHours" type="number" min={0} defaultValue={settings.minNoticeHours} /></div>
        <div><label className="label" htmlFor="ahead">Bookable up to (days ahead)</label><input className="input" id="ahead" name="maxDaysAhead" type="number" min={1} defaultValue={settings.maxDaysAhead} /></div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="blocked">Days off (holidays, travel)</label>
          <textarea className="input min-h-20 font-mono text-sm" id="blocked" name="blockedDates" placeholder="2026-12-25, 2026-12-26" defaultValue={settings.blockedDates.join(", ")} />
          <p className="mt-1 text-xs text-muted">One date per entry, YYYY-MM-DD, separated by commas or new lines.</p>
        </div>
      </section>
      <div><SubmitButton pendingText="Saving…">Save availability</SubmitButton></div>
    </form>
  );
}
