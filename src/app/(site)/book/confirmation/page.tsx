import type { Metadata } from "next";
import Link from "next/link";
import { db, hasDb } from "@/lib/db";
import { Booking, type BookingDoc } from "@/lib/models";
import { money } from "@/lib/format";
import { PLATFORM_LABEL } from "@/lib/constants";
import { markPaid } from "@/lib/booking";
import { getStripeSession } from "@/lib/payments";
import { whatsappLink } from "@/lib/site";
import { Notice, PageHero } from "@/components/ui";
import { LocalTime } from "@/components/LocalTime";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Booking confirmation", robots: { index: false } };

type Props = { searchParams: Promise<{ ref?: string; session_id?: string }> };

export default async function ConfirmationPage({ searchParams }: Props) {
  const sp = await searchParams;
  const ref = sp.ref ?? "";
  let b: BookingDoc | null = null;
  if (hasDb() && /^HGA-[A-F0-9]{16}$/.test(ref)) {
    await db();
    b = await Booking.findOne({ "payment.reference": ref }).lean<BookingDoc>();
    // Back from Stripe before the webhook arrived: check the session directly.
    if (b?.status === "pending_payment" && b.payment?.provider === "stripe" && sp.session_id) {
      const s = await getStripeSession(sp.session_id).catch(() => null);
      if (s?.payment_status === "paid" && s.metadata?.reference === ref) {
        await markPaid(ref, s.amount_total, s.currency);
        b = await Booking.findOne({ "payment.reference": ref }).lean<BookingDoc>();
      }
    }
  }

  const paid = b?.payment?.status === "paid";
  const awaiting = b?.status === "pending_payment";
  const title = !b ? "Booking not found" : awaiting ? "Payment processing" : paid || b.status === "confirmed" ? "You're booked!" : "Booking received";

  return (
    <>
      <PageHero crumb="Booking" title={title} />
      <section className="py-14">
        <div className="container-x max-w-2xl">
          {!b ? (
            <Notice tone="error">We couldn&apos;t find that booking. If you paid, please <a href={whatsappLink()}>message us on WhatsApp</a> with your payment receipt.</Notice>
          ) : (
            <div className="card flex flex-col gap-5">
              {awaiting && <Notice>We&apos;re waiting for confirmation from the payment provider. This usually takes under a minute — refresh this page, or check your email.</Notice>}
              {b.status === "pending" && !paid && <Notice>Thank you! Harriet will confirm your booking shortly by email.</Notice>}
              {(paid || b.status === "confirmed") && <Notice tone="success">Your booking is confirmed. A confirmation email is on its way to {b.email}.</Notice>}
              <dl className="grid gap-4 sm:grid-cols-2">
                <div><dt className="text-sm text-muted">Service</dt><dd className="font-semibold">{b.serviceName}</dd></div>
                <div><dt className="text-sm text-muted">When</dt><dd className="font-semibold">{b.startsAt ? <LocalTime iso={b.startsAt.toISOString()} /> : "Course enrolment"}</dd></div>
                <div><dt className="text-sm text-muted">Payment</dt><dd className="font-semibold">{b.payment?.amount ? `${money(b.payment.amount, b.payment.currency || "CAD")} — ${paid ? "paid" : "unpaid"}` : "Free"}</dd></div>
                <div><dt className="text-sm text-muted">Session</dt><dd className="font-semibold">{b.sessionType === "group" ? "Group" : "Individual"} · {PLATFORM_LABEL[b.platform ?? "zoom"]}</dd></div>
                <div><dt className="text-sm text-muted">Reference</dt><dd className="font-mono text-sm">{ref}</dd></div>
              </dl>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/account" className="btn-primary">View my bookings</Link>
                <a href={whatsappLink(`Hello Harriet, I just booked ${b.serviceName}. My booking reference is ${ref}.`)} className="btn-outline" target="_blank" rel="noopener noreferrer">Confirm on WhatsApp</a>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
