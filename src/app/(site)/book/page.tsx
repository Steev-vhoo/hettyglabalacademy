import type { Metadata } from "next";
import Link from "next/link";
import { db, hasDb } from "@/lib/db";
import { User, type UserDoc } from "@/lib/models";
import { activeServices, seatsLeft } from "@/lib/booking";
import { getSession } from "@/lib/auth";
import { paymentsEnabled } from "@/lib/payments";
import { whatsappLink } from "@/lib/site";
import { usualHoursText } from "@/lib/slots";
import { Chat } from "@/components/icons";
import { PageHero, Notice } from "@/components/ui";
import { BookingForm, type ServiceOption } from "@/components/forms/BookingForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book a Session",
  description: "Book NCLEX tutoring, CELPIP coaching, English lessons, mentorship or a free discovery call with Hetty Global Academy. Pay with Mobile Money or card.",
  alternates: { canonical: "/book" },
};

type Props = { searchParams: Promise<{ service?: string; cancelled?: string }> };

export default async function BookPage({ searchParams }: Props) {
  const sp = await searchParams;
  let services: ServiceOption[] = [];
  let prefill: { name?: string; email?: string; phone?: string; country?: string } | undefined;
  let failed = false;

  if (hasDb()) {
    try {
      await db();
      const rows = await activeServices();
      services = await Promise.all(
        rows.map(async (s) => {
          const left = s.kind === "course" ? await seatsLeft(s) : null;
          return {
            id: String(s._id),
            slug: s.slug,
            name: s.name,
            kind: s.kind as ServiceOption["kind"],
            summary: s.summary ?? "",
            durationMin: s.durationMin ?? 60,
            priceGHS: s.priceGHS ?? null,
            priceCAD: s.priceCAD ?? null,
            startDate: s.startDate?.toISOString(),
            schedule: s.schedule ?? "",
            seatsLeft: left === Infinity ? null : left,
            formats: (s.formats?.length ? s.formats : ["individual", "group"]) as ServiceOption["formats"],
          };
        }),
      );
      const session = await getSession();
      if (session) {
        const u = await User.findById(session.sub).lean<UserDoc>();
        if (u) prefill = { name: u.name, email: u.email, phone: u.phone ?? "", country: u.country ?? "" };
      }
    } catch (e) {
      console.error("[book]", e);
      failed = true;
    }
  } else failed = true;

  return (
    <>
      <PageHero crumb="Book a session" title="Book a session" intro="Choose a service and a time that suits you. Everything runs online." />
      <section className="py-14">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_340px]">
          <div>
            {failed ? (
              <Notice tone="error">Online booking is temporarily unavailable. Please <a href={whatsappLink("Hello, I'd like to book a session.")}>message us on WhatsApp</a> to book.</Notice>
            ) : (
              <BookingForm services={services} initialSlug={sp.service} prefill={prefill} providers={{ paystack: paymentsEnabled.paystack(), stripe: paymentsEnabled.stripe() }} cancelled={sp.cancelled === "1"} />
            )}
          </div>
          <aside className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
            <div className="card">
              <h2 className="mb-3 text-xl">Good to know</h2>
              <ul className="flex list-disc flex-col gap-2 pl-5 text-[15px] text-muted">
                <li>{usualHoursText()}</li>
                <li>Meet on Zoom or by WhatsApp call — individual or group.</li>
                <li>Paid bookings are confirmed as soon as payment goes through.</li>
                <li>Need to change your time? Reply to your confirmation email or message us at least 24 hours before.</li>
              </ul>
            </div>
            <a href={whatsappLink("Hello, I'd like to book a session with Hetty Global Academy.")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-2xl bg-[#25D366] p-5 text-[#0b2914] no-underline">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-[#128c4a]"><Chat /></span>
              <span><strong className="block">Prefer to book on WhatsApp?</strong><span className="text-sm">Message us and we&apos;ll arrange a time.</span></span>
            </a>
            {!prefill && (
              <div className="card border-transparent bg-gold-soft">
                <h2 className="mb-2 text-xl">Have an account?</h2>
                <p className="mb-4 text-[15px]">Sign in to fill in your details and see all your bookings in one place.</p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/login?next=/book" className="btn-primary btn-sm">Sign in</Link>
                  <Link href="/register?next=/book" className="btn-outline btn-sm">Register</Link>
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
