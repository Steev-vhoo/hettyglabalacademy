import { test } from "node:test";
import assert from "node:assert/strict";
import { generateSlots, zonedToUtc, dateIn, weekday, type SlotSettings } from "../src/lib/slots.ts";

const base: SlotSettings = {
  timezone: "America/Toronto",
  weekly: [{ day: 4, start: 9 * 60, end: 12 * 60 }], // Thursdays 9:00–12:00
  blockedDates: [],
  slotStepMin: 30,
  bufferMin: 0,
  minNoticeHours: 0,
  maxDaysAhead: 7,
};

test("zonedToUtc handles winter (EST, UTC-5) and summer (EDT, UTC-4)", () => {
  assert.equal(new Date(zonedToUtc("2026-12-10", 9 * 60, "America/Toronto")).toISOString(), "2026-12-10T14:00:00.000Z");
  assert.equal(new Date(zonedToUtc("2026-07-09", 9 * 60, "America/Toronto")).toISOString(), "2026-07-09T13:00:00.000Z");
  assert.equal(new Date(zonedToUtc("2026-12-10", 9 * 60, "Africa/Accra")).toISOString(), "2026-12-10T09:00:00.000Z");
});

test("dateIn and weekday", () => {
  assert.equal(dateIn(Date.parse("2026-12-10T03:00:00Z"), "America/Toronto"), "2026-12-09");
  assert.equal(weekday("2026-12-10"), 4);
});

test("generates 60-minute slots on a 30-minute step inside opening hours", () => {
  const now = Date.parse("2026-12-07T12:00:00Z"); // Monday
  const slots = generateSlots(base, 60, [], now);
  assert.deepEqual(slots, ["2026-12-10T14:00:00.000Z", "2026-12-10T14:30:00.000Z", "2026-12-10T15:00:00.000Z", "2026-12-10T15:30:00.000Z", "2026-12-10T16:00:00.000Z"]);
});

test("busy intervals plus buffer remove overlapping slots", () => {
  const now = Date.parse("2026-12-07T12:00:00Z");
  const busy = [{ start: Date.parse("2026-12-10T15:00:00Z"), end: Date.parse("2026-12-10T16:00:00Z") }];
  const slots = generateSlots({ ...base, bufferMin: 15 }, 60, busy, now);
  assert.deepEqual(slots, []);
  const noBuffer = generateSlots(base, 60, busy, now);
  assert.deepEqual(noBuffer, ["2026-12-10T14:00:00.000Z", "2026-12-10T16:00:00.000Z"]);
});

test("blocked dates and minimum notice are respected", () => {
  const now = Date.parse("2026-12-07T12:00:00Z");
  assert.deepEqual(generateSlots({ ...base, blockedDates: ["2026-12-10"] }, 60, [], now), []);
  const late = Date.parse("2026-12-10T13:00:00Z");
  const slots = generateSlots({ ...base, minNoticeHours: 2 }, 60, [], late);
  assert.equal(slots[0], "2026-12-10T15:00:00.000Z");
});

test("8–9am Ghana time is 08:00 UTC all year (Ghana has no daylight saving)", () => {
  const ghana: SlotSettings = { ...base, timezone: "Africa/Accra", weekly: [{ day: 4, start: 8 * 60, end: 9 * 60 }] };
  assert.deepEqual(generateSlots(ghana, 60, [], Date.parse("2026-12-07T12:00:00Z")), ["2026-12-10T08:00:00.000Z"]);
  assert.deepEqual(generateSlots(ghana, 60, [], Date.parse("2026-07-06T12:00:00Z")), ["2026-07-09T08:00:00.000Z"]);
});

test("usualHoursText derives the Vancouver equivalent from timezone data", async () => {
  const { usualHoursText } = await import("../src/lib/slots.ts");
  const text = usualHoursText(Date.parse("2026-12-10T12:00:00Z"));
  const expected = new Intl.DateTimeFormat("en-US", { timeZone: "America/Vancouver", hour: "numeric", minute: "2-digit" }).format(new Date("2026-12-10T08:00:00Z"));
  assert.ok(text.startsWith("Most consultations run 8:00 AM–9:00 AM Ghana time (GMT)"), text);
  assert.ok(text.includes(expected), text);
});
