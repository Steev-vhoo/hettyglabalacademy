"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { Booking, Service, type ServiceDoc } from "@/lib/models";
import { getSession } from "@/lib/auth";
import { availableSlots, HOLD_MINUTES, notifyBooking, seatsLeft } from "@/lib/booking";
import { createPaystackCheckout, createStripeCheckout, paymentsEnabled, providerCurrency, type Provider } from "@/lib/payments";
import { rateLimited } from "@/lib/ratelimit";
import { site } from "@/lib/site";
import { fieldErrors, type FormState } from "./types";

const schema = z.object({
  serviceId: z.string().regex(/^[a-f0-9]{24}$/, "Choose a service"),
  slot: z.string().optional(),
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  phone: z.string().trim().min(6, "Enter a WhatsApp or phone number").max(30),
  country: z.string().trim().max(60).optional(),
  stage: z.string().trim().max(60).optional(),
  notes: z.string().trim().max(2000).optional(),
  timezone: z.string().max(60).optional(),
  provider: z.enum(["paystack", "stripe"]).optional(),
  consent: z.literal("on", { message: "Please accept the booking terms" }),
});

export async function createBooking(_: FormState, form: FormData): Promise<FormState> {
  if (await rateLimited("booking", 10, 60 * 60_000)) return { error: "Too many booking attempts. Please message us on WhatsApp." };
  const parsed = schema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Please check the highlighted fields.", fields: fieldErrors(parsed.error.issues) };
  const d = parsed.data;

  await db();
  const service = await Service.findOne({ _id: d.serviceId, active: true }).lean<ServiceDoc>();
  if (!service) return { error: "That service is no longer available." };

  // Time slot (consultations) or seat (courses)
  let startsAt: Date | undefined;
  let endsAt: Date | undefined;
  if (service.kind === "consultation") {
    if (!d.slot) return { error: "Please choose a date and time.", fields: { slot: "Choose a time" } };
    const slots = await availableSlots(service);
    if (!slots.includes(d.slot)) return { error: "Sorry — that time was just taken. Please choose another.", fields: { slot: "Choose another time" } };
    startsAt = new Date(d.slot);
    endsAt = new Date(startsAt.getTime() + (service.durationMin ?? 60) * 60_000);
  } else if ((await seatsLeft(service)) <= 0) {
    return { error: "This course is full. Message us on WhatsApp to join the waiting list." };
  }

  // Price
  const priced = (p: Provider) => (p === "paystack" ? service.priceGHS : service.priceCAD);
  const isFree = (service.priceGHS ?? null) === 0 || (service.priceCAD ?? null) === 0 || (service.priceGHS == null && service.priceCAD == null);
  let provider: Provider | null = null;
  if (!isFree) {
    provider = d.provider ?? null;
    if (!provider || priced(provider) == null || !paymentsEnabled[provider]()) {
      return { error: "Please choose a payment option.", fields: { provider: "Choose how to pay" } };
    }
  }
  const amount = provider ? Number(priced(provider)) : 0;
  const currency = provider ? providerCurrency[provider] : "";
  const reference = `HGA-${randomBytes(8).toString("hex").toUpperCase()}`;
  const session = await getSession();

  let booking;
  try {
    booking = await Booking.create({
      service: service._id,
      serviceName: service.name,
      kind: service.kind,
      user: session?.role === "student" ? session.sub : undefined,
      name: d.name,
      email: d.email,
      phone: d.phone,
      country: d.country,
      stage: d.stage,
      notes: d.notes,
      timezone: d.timezone,
      startsAt,
      endsAt,
      slotKey: startsAt?.toISOString(),
      holdExpiresAt: provider ? new Date(Date.now() + HOLD_MINUTES * 60_000) : undefined,
      status: provider ? "pending_payment" : "pending",
      payment: { provider: provider ?? "none", amount, currency, reference, status: provider ? "unpaid" : "free" },
    });
  } catch (e) {
    if ((e as { code?: number }).code === 11000) return { error: "Sorry — someone booked that time a moment ago. Please choose another." };
    throw e;
  }

  const confirmation = `${site.url}/book/confirmation?ref=${reference}`;
  if (!provider) {
    await notifyBooking(booking.toObject(), "new");
    redirect(confirmation);
  }

  let checkoutUrl: string;
  try {
    const input = {
      bookingId: String(booking._id),
      reference,
      email: d.email,
      amount,
      description: `${service.name} — ${site.name}`,
      successUrl: provider === "paystack" ? `${site.url}/api/payments/paystack/callback` : confirmation,
      cancelUrl: `${site.url}/book?service=${service.slug}&cancelled=1`,
    };
    if (provider === "paystack") checkoutUrl = await createPaystackCheckout(input);
    else checkoutUrl = (await createStripeCheckout(input)).url;
  } catch (e) {
    console.error("[booking] checkout failed", e);
    await Booking.updateOne({ _id: booking._id }, { $set: { status: "cancelled", adminNotes: "Checkout could not start." }, $unset: { slotKey: 1 } });
    return { error: "We couldn't start the payment. Please try again, choose the other payment option, or message us on WhatsApp." };
  }
  redirect(checkoutUrl);
}

export async function cancelMyBooking(id: string) {
  const session = await getSession();
  if (!session) redirect("/login");
  await db();
  const b = await Booking.findOne({ _id: id, $or: [{ user: session.sub }, { email: session.email }] });
  if (!b || !["pending", "pending_payment"].includes(b.status)) return;
  b.status = "cancelled";
  b.slotKey = undefined;
  await b.save();
  await notifyBooking(b.toObject(), "cancelled");
  redirect("/account?cancelled=1");
}
