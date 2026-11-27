import { db } from "@/lib/db";
import { Booking } from "@/lib/models";
import { markPaid } from "@/lib/booking";
import { stripeSignatureValid } from "@/lib/payments";

export const dynamic = "force-dynamic";

type CheckoutSession = { payment_status: string; amount_total: number; currency: string; metadata?: { reference?: string } };

/**
 * Stripe Dashboard → Developers → Webhooks → endpoint https://YOURDOMAIN/api/payments/stripe/webhook
 * Events: checkout.session.completed, checkout.session.async_payment_succeeded, checkout.session.expired
 */
export async function POST(req: Request) {
  const raw = await req.text();
  if (!stripeSignatureValid(raw, req.headers.get("stripe-signature"), process.env.STRIPE_WEBHOOK_SECRET ?? "")) {
    return new Response("Invalid signature", { status: 400 });
  }
  const event = JSON.parse(raw) as { type: string; data: { object: CheckoutSession } };
  const s = event.data.object;
  const reference = s.metadata?.reference;
  if (!reference) return new Response("ok");

  if ((event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") && s.payment_status === "paid") {
    await markPaid(reference, s.amount_total, s.currency);
  } else if (event.type === "checkout.session.expired") {
    await db();
    await Booking.updateOne(
      { "payment.reference": reference, status: "pending_payment" },
      { $set: { status: "cancelled", adminNotes: "Checkout expired — slot released." }, $unset: { slotKey: 1 } },
    );
  }
  return new Response("ok");
}
