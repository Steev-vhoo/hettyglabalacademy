import "server-only";
import { db } from "./db";
import { Booking, Service, Settings, type BookingDoc, type ServiceDoc, type SettingsDoc } from "./models";
import { generateSlots, type Interval, type SlotSettings } from "./slots";
import { adminEmail, sendMail } from "./mail";
import { formatDate, money } from "./format";
import { site } from "./site";
import { PLATFORM_LABEL } from "./constants";

export const HOLD_MINUTES = 30;

const DEFAULT_SETTINGS: SlotSettings = {
  // Usual window: 8:00–9:00 am Ghana time (GMT), Monday–Saturday. Change it any time in Admin › Availability.
  timezone: "Africa/Accra",
  weekly: [1, 2, 3, 4, 5, 6].map((day) => ({ day, start: 8 * 60, end: 9 * 60 })),
  blockedDates: [],
  slotStepMin: 30,
  bufferMin: 15,
  minNoticeHours: 12,
  maxDaysAhead: 45,
};

export async function getSettings(): Promise<SlotSettings> {
  await db();
  const s = await Settings.findOne({ key: "main" }).lean<SettingsDoc>();
  if (!s) return DEFAULT_SETTINGS;
  return {
    timezone: s.timezone ?? DEFAULT_SETTINGS.timezone,
    weekly: (s.weekly ?? []).map((w) => ({ day: Number(w.day), start: Number(w.start), end: Number(w.end) })),
    blockedDates: s.blockedDates ?? [],
    slotStepMin: s.slotStepMin ?? 30,
    bufferMin: s.bufferMin ?? 15,
    minNoticeHours: s.minNoticeHours ?? 12,
    maxDaysAhead: s.maxDaysAhead ?? 45,
  };
}

/** Frees slots held by checkouts that were abandoned. */
export async function releaseExpiredHolds() {
  await Booking.updateMany(
    { status: "pending_payment", holdExpiresAt: { $lt: new Date() } },
    { $set: { status: "cancelled", adminNotes: "Payment not completed — slot released automatically." }, $unset: { slotKey: 1 } },
  );
}

async function busyIntervals(): Promise<Interval[]> {
  const rows = await Booking.find(
    { slotKey: { $type: "string" }, startsAt: { $gte: new Date(Date.now() - 86400_000) } },
    { startsAt: 1, endsAt: 1 },
  ).lean();
  return rows.filter((r) => r.startsAt && r.endsAt).map((r) => ({ start: r.startsAt!.getTime(), end: r.endsAt!.getTime() }));
}

export async function availableSlots(service: Pick<ServiceDoc, "durationMin">) {
  await db();
  await releaseExpiredHolds();
  const [settings, busy] = await Promise.all([getSettings(), busyIntervals()]);
  return generateSlots(settings, service.durationMin ?? 60, busy);
}

export async function seatsLeft(service: ServiceDoc) {
  if (!service.seats) return Infinity;
  const taken = await Booking.countDocuments({
    service: service._id,
    $or: [{ status: { $in: ["pending", "confirmed", "completed"] } }, { status: "pending_payment", holdExpiresAt: { $gt: new Date() } }],
  });
  return Math.max(0, service.seats - taken);
}

export async function activeServices() {
  await db();
  return Service.find({ active: true }).sort({ order: 1, name: 1 }).lean<ServiceDoc[]>();
}

/** Marks a booking paid after the provider confirms it. Idempotent; checks amount and currency. */
export async function markPaid(reference: string, amount: number, currency: string) {
  await db();
  const booking = await Booking.findOne({ "payment.reference": reference });
  if (!booking) return { ok: false as const, reason: "not_found" };
  if (booking.payment?.status === "paid") return { ok: true as const, booking };
  if (booking.payment?.amount !== amount || booking.payment?.currency?.toUpperCase() !== currency.toUpperCase()) {
    console.error(`[payments] amount mismatch for ${reference}: got ${amount} ${currency}`);
    return { ok: false as const, reason: "amount_mismatch" };
  }
  booking.payment.status = "paid";
  booking.payment.paidAt = new Date();
  booking.status = "confirmed";
  booking.holdExpiresAt = undefined;
  if (!booking.slotKey && booking.startsAt) booking.slotKey = booking.startsAt.toISOString();
  try {
    await booking.save();
  } catch {
    // The hold expired and someone else took the slot while the client was paying: keep the payment, flag for Harriet.
    booking.slotKey = undefined;
    booking.status = "pending";
    booking.adminNotes = "Paid after the slot hold expired and the time was taken — please reschedule.";
    await booking.save();
  }
  await notifyBooking(booking.toObject() as BookingDoc, "paid");
  return { ok: true as const, booking };
}

export async function notifyBooking(b: BookingDoc, event: "new" | "paid" | "confirmed" | "cancelled") {
  const when = b.startsAt
    ? `${formatDate(b.startsAt, { dateStyle: "full", timeStyle: "short" }, b.timezone || undefined)} (${b.timezone || "UTC"})`
    : "Course enrolment";
  const price = b.payment?.amount ? money(b.payment.amount, b.payment.currency || "CAD") : "Free";
  const subject = {
    new: `Booking received: ${b.serviceName}`,
    paid: `Payment received — you're booked: ${b.serviceName}`,
    confirmed: `Confirmed: ${b.serviceName}`,
    cancelled: `Cancelled: ${b.serviceName}`,
  }[event];
  const body = [
    `Hello ${b.name},`,
    event === "cancelled"
      ? `Your booking for ${b.serviceName} has been cancelled. Reply to this email or message us on WhatsApp if you'd like a new time.`
      : event === "new"
        ? `Thank you — we've received your booking for ${b.serviceName}. Harriet will confirm it shortly.`
        : `Your booking for ${b.serviceName} is confirmed.`,
    `When: ${when}`,
    `Session: ${b.sessionType === "group" ? "Group" : "Individual"} · ${PLATFORM_LABEL[b.platform ?? "zoom"]}`,
    ...(b.platform === "whatsapp" ? [`We'll call you on WhatsApp at ${b.phone || "the number you gave"}.`] : []),
    `Price: ${price}`,
    ...(b.meetingLink ? [`Meeting link: ${b.meetingLink}`] : []),
    `Manage your bookings: ${site.url}/account`,
    `— ${site.name}`,
  ];
  await sendMail(b.email, subject, body);
  if (event === "new" || event === "paid") {
    await sendMail(adminEmail(), `[HGA] ${subject} — ${b.name}`, [
      `${b.name} (${b.email}, ${b.phone || "no phone"}) — ${b.country || ""}`,
      `Service: ${b.serviceName}`,
      `When: ${when}`,
      `Session: ${b.sessionType ?? "individual"} · ${PLATFORM_LABEL[b.platform ?? "zoom"]}`,
      `Payment: ${price} (${b.payment?.status})`,
      `Notes: ${b.notes || "—"}`,
      `Open: ${site.url}/admin/bookings`,
    ]);
  }
}
