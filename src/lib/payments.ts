import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Two providers, called over their REST APIs:
 *  - Paystack: Ghana — Mobile Money + cards, charged in GHS (amount in pesewas)
 *  - Stripe Checkout: international cards, charged in CAD (amount in cents)
 * The card form is hosted by the provider, so card numbers never touch this site.
 */

export type Provider = "paystack" | "stripe";
export const providerCurrency: Record<Provider, "GHS" | "CAD"> = { paystack: "GHS", stripe: "CAD" };

export const paymentsEnabled = {
  paystack: () => Boolean(process.env.PAYSTACK_SECRET_KEY),
  stripe: () => Boolean(process.env.STRIPE_SECRET_KEY),
};

type CheckoutInput = {
  bookingId: string;
  reference: string;
  email: string;
  amount: number; // minor units
  description: string;
  successUrl: string;
  cancelUrl: string;
};

export async function createPaystackCheckout(i: CheckoutInput) {
  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      email: i.email,
      amount: i.amount,
      currency: "GHS",
      reference: i.reference,
      callback_url: i.successUrl,
      metadata: { bookingId: i.bookingId, description: i.description, cancel_action: i.cancelUrl },
    }),
  });
  const json = (await res.json()) as { status: boolean; message: string; data?: { authorization_url: string } };
  if (!res.ok || !json.status || !json.data) throw new Error(`Paystack: ${json.message}`);
  return json.data.authorization_url;
}

export async function verifyPaystack(reference: string) {
  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    cache: "no-store",
  });
  const json = (await res.json()) as { status: boolean; data?: { status: string; amount: number; currency: string; reference: string } };
  if (!res.ok || !json.status || !json.data) return null;
  return json.data;
}

export async function createStripeCheckout(i: CheckoutInput) {
  const body = new URLSearchParams({
    mode: "payment",
    success_url: `${i.successUrl}${i.successUrl.includes("?") ? "&" : "?"}session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: i.cancelUrl,
    customer_email: i.email,
    client_reference_id: i.bookingId,
    "metadata[bookingId]": i.bookingId,
    "metadata[reference]": i.reference,
    "payment_intent_data[metadata][bookingId]": i.bookingId,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "cad",
    "line_items[0][price_data][unit_amount]": String(i.amount),
    "line_items[0][price_data][product_data][name]": i.description,
    expires_at: String(Math.floor(Date.now() / 1000) + 31 * 60),
  });
  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const json = (await res.json()) as { id?: string; url?: string; error?: { message: string } };
  if (!res.ok || !json.url || !json.id) throw new Error(`Stripe: ${json.error?.message ?? res.statusText}`);
  return { url: json.url, sessionId: json.id };
}

/** Looks up a Checkout Session on return from Stripe, so the confirmation page doesn't have to wait for the webhook. */
export async function getStripeSession(id: string) {
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(id)) return null;
  const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${id}`, {
    headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json()) as { payment_status: string; amount_total: number; currency: string; metadata?: { reference?: string } };
}

/* ---------- Webhook signature checks (pure; unit tested) ---------- */

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Paystack: `x-paystack-signature` = HMAC-SHA512(raw body, secret key). */
export function paystackSignatureValid(rawBody: string, signature: string | null, secret: string) {
  if (!signature || !secret) return false;
  return safeEqual(createHmac("sha512", secret).update(rawBody).digest("hex"), signature);
}

/** Stripe: `Stripe-Signature: t=<ts>,v1=<hmac>`, HMAC-SHA256(`${t}.${body}`, webhook secret), 5-minute tolerance. */
export function stripeSignatureValid(rawBody: string, header: string | null, secret: string, nowSec = Math.floor(Date.now() / 1000)) {
  if (!header || !secret) return false;
  const parts = header.split(",").map((p) => p.split("="));
  const t = parts.find(([k]) => k === "t")?.[1];
  const sigs = parts.filter(([k]) => k === "v1").map(([, v]) => v);
  if (!t || !sigs.length || Math.abs(nowSec - Number(t)) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${t}.${rawBody}`).digest("hex");
  return sigs.some((s) => safeEqual(expected, s));
}
