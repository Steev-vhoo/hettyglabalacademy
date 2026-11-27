/**
 * Pure time-slot logic (no database), so it can be unit tested.
 * Opening hours are stored in the admin's timezone; slots are returned as UTC ISO strings
 * and the browser shows them in the visitor's own timezone.
 */

export type WeeklyRange = { day: number; start: number; end: number }; // day 0=Sun, minutes from midnight
export type SlotSettings = {
  timezone: string;
  weekly: WeeklyRange[];
  blockedDates: string[];
  slotStepMin: number;
  bufferMin: number;
  minNoticeHours: number;
  maxDaysAhead: number;
};
export type Interval = { start: number; end: number }; // epoch ms

/** Offset (ms) of `tz` from UTC at instant `utcMs`. */
export function tzOffset(utcMs: number, tz: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(utcMs));
  const n = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(n("year"), n("month") - 1, n("day"), n("hour"), n("minute"), n("second"));
  return asUtc - Math.floor(utcMs / 1000) * 1000;
}

/** Wall-clock date + minutes in `tz` → UTC epoch ms (DST-safe). */
export function zonedToUtc(date: string, minutes: number, tz: string) {
  const [y, m, d] = date.split("-").map(Number);
  const guess = Date.UTC(y, m - 1, d, 0, minutes);
  let utc = guess - tzOffset(guess, tz);
  utc = guess - tzOffset(utc, tz);
  return utc;
}

/** Calendar date (YYYY-MM-DD) of an instant in `tz`. */
export function dateIn(utcMs: number, tz: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(
    new Date(utcMs),
  );
}

export function addDays(date: string, n: number) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

export function weekday(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function overlaps(a: Interval, b: Interval) {
  return a.start < b.end && b.start < a.end;
}

/** All bookable slot start times (UTC ISO) for a service of `durationMin`. */
export function generateSlots(s: SlotSettings, durationMin: number, busy: Interval[], now = Date.now()): string[] {
  const out: string[] = [];
  const earliest = now + s.minNoticeHours * 3600_000;
  const buffer = s.bufferMin * 60_000;
  const blocked = new Set(s.blockedDates);
  const today = dateIn(now, s.timezone);
  const step = Math.max(5, s.slotStepMin);

  for (let i = 0; i <= s.maxDaysAhead; i++) {
    const date = addDays(today, i);
    if (blocked.has(date)) continue;
    const ranges = s.weekly.filter((r) => r.day === weekday(date)).sort((a, b) => a.start - b.start);
    for (const r of ranges) {
      for (let t = r.start; t + durationMin <= r.end; t += step) {
        const start = zonedToUtc(date, t, s.timezone);
        const end = start + durationMin * 60_000;
        if (start < earliest) continue;
        const padded = { start: start - buffer, end: end + buffer };
        if (busy.some((b) => overlaps(padded, b))) continue;
        out.push(new Date(start).toISOString());
      }
    }
  }
  return out;
}

export const minutesToHHMM = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
export const hhmmToMinutes = (s: string) => {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + (m || 0);
};
