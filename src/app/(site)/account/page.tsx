import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Booking, User, type BookingDoc, type UserDoc } from "@/lib/models";
import { money, STATUS_LABEL } from "@/lib/format";
import { logout } from "@/actions/auth";
import { cancelMyBooking } from "@/actions/booking";
import { Notice, StatusPill } from "@/components/ui";
import { LocalTime } from "@/components/LocalTime";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My account", robots: { index: false } };

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ welcome?: string; cancelled?: string }> }) {
  const session = await requireUser("/account");
  const sp = await searchParams;
  await db();
  const [user, bookings] = await Promise.all([
    User.findById(session.sub).lean<UserDoc>(),
    Booking.find({ $or: [{ user: session.sub }, { email: session.email }] }).sort({ startsAt: -1, createdAt: -1 }).limit(100).lean<BookingDoc[]>(),
  ]);
  const now = Date.now();
  const upcoming = bookings.filter((b) => b.status !== "cancelled" && (!b.startsAt || b.startsAt.getTime() > now));
  const past = bookings.filter((b) => !upcoming.includes(b));

  const Row = ({ b }: { b: BookingDoc }) => (
    <li className="flex flex-wrap items-center justify-between gap-4 border-b border-line py-5 last:border-0">
      <div className="flex flex-col gap-1">
        <strong>{b.serviceName}</strong>
        <span className="text-sm text-muted">{b.startsAt ? <LocalTime iso={b.startsAt.toISOString()} /> : "Course enrolment"}</span>
        {b.meetingLink && b.status === "confirmed" && <a href={b.meetingLink} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold">Join meeting ↗</a>}
      </div>
      <div className="flex items-center gap-3">
        {b.payment?.amount ? <span className="text-sm">{money(b.payment.amount, b.payment.currency || "CAD")}</span> : null}
        <StatusPill status={b.status} label={STATUS_LABEL[b.status]} />
        {["pending", "pending_payment"].includes(b.status) && (
          <form action={cancelMyBooking.bind(null, String(b._id))}>
            <button type="submit" className="btn-outline btn-sm border-line">Cancel</button>
          </form>
        )}
      </div>
    </li>
  );

  return (
    <section className="bg-ivory py-14">
      <div className="container-x flex max-w-4xl flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl">Hello, {user?.name.split(" ")[0] ?? session.name}</h1>
            <p className="text-muted">{session.email}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/book" className="btn-primary">Book a session</Link>
            <form action={logout}><button className="btn-outline" type="submit">Sign out</button></form>
          </div>
        </div>
        {sp.welcome && <Notice tone="success">Welcome! Your student account is ready.</Notice>}
        {sp.cancelled && <Notice>Your booking was cancelled.</Notice>}
        <div className="rounded-3xl bg-white p-6 sm:p-8">
          <h2 className="mb-2 text-2xl">Upcoming</h2>
          {upcoming.length ? <ul>{upcoming.map((b) => <Row key={String(b._id)} b={b} />)}</ul> : <p className="py-4 text-muted">No upcoming bookings. <Link href="/book">Book a session</Link>.</p>}
        </div>
        {past.length > 0 && (
          <div className="rounded-3xl bg-white p-6 sm:p-8">
            <h2 className="mb-2 text-2xl">Past &amp; cancelled</h2>
            <ul>{past.map((b) => <Row key={String(b._id)} b={b} />)}</ul>
          </div>
        )}
        <p className="text-sm text-muted">To update your details or reschedule, message us on WhatsApp or reply to your confirmation email.</p>
      </div>
    </section>
  );
}
