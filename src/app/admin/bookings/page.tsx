import Link from "next/link";
import { db } from "@/lib/db";
import { Booking, type BookingDoc } from "@/lib/models";
import { formatDate, money, STATUS_LABEL } from "@/lib/format";
import { getSettings, releaseExpiredHolds } from "@/lib/booking";
import { StatusPill } from "@/components/ui";
import { AdminHeader, Panel, td, th } from "../ui";
import { BookingEditor } from "./BookingEditor";

export const metadata = { title: "Bookings" };

const TABS = {
  upcoming: { label: "Upcoming", filter: () => ({ status: { $in: ["pending", "confirmed"] }, $or: [{ startsAt: { $gte: new Date() } }, { startsAt: null }] }) },
  pending: { label: "Needs action", filter: () => ({ status: "pending" }) },
  awaiting: { label: "Awaiting payment", filter: () => ({ status: "pending_payment" }) },
  past: { label: "Past", filter: () => ({ status: { $in: ["confirmed", "completed"] }, startsAt: { $lt: new Date() } }) },
  cancelled: { label: "Cancelled", filter: () => ({ status: "cancelled" }) },
  all: { label: "All", filter: () => ({}) },
} as const;

type Props = { searchParams: Promise<{ tab?: string; id?: string; q?: string }> };

export default async function BookingsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const tab = (sp.tab && sp.tab in TABS ? sp.tab : "upcoming") as keyof typeof TABS;
  await db();
  await releaseExpiredHolds();
  const filter: Record<string, unknown> = { ...TABS[tab].filter() };
  if (sp.q) {
    const rx = { $regex: sp.q.slice(0, 60).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    filter.$and = [{ $or: [{ name: rx }, { email: rx }, { phone: rx }, { "payment.reference": rx }] }];
  }
  const sort: Record<string, 1 | -1> = tab === "upcoming" ? { startsAt: 1 } : { startsAt: -1, createdAt: -1 };
  const [rows, selected, settings] = await Promise.all([
    Booking.find(filter).sort(sort).limit(200).lean<BookingDoc[]>(),
    sp.id && /^[a-f0-9]{24}$/.test(sp.id) ? Booking.findById(sp.id).lean<BookingDoc>() : null,
    getSettings(),
  ]);
  const tz = settings.timezone;
  const link = (p: Record<string, string | undefined>) => `/admin/bookings?${new URLSearchParams(Object.entries({ tab, q: sp.q, ...p }).filter(([, v]) => v) as [string, string][])}`;

  return (
    <>
      <AdminHeader title="Bookings" intro={`Times shown in your timezone (${tz.replace(/_/g, " ")}).`}>
        <a href="/admin/bookings/export" className="btn-outline">Export CSV</a>
      </AdminHeader>
      <div className="grid gap-6 2xl:grid-cols-[1fr_400px]">
        <Panel className="p-0 sm:p-0">
          <nav className="flex flex-wrap gap-1 border-b border-line px-3" aria-label="Booking filters">
            {Object.entries(TABS).map(([k, v]) => (
              <Link key={k} href={link({ tab: k, id: undefined })} aria-current={k === tab ? "page" : undefined}
                className={`flex min-h-11 items-center border-b-2 px-3 text-sm font-semibold no-underline ${k === tab ? "border-burgundy text-charcoal" : "border-transparent text-muted"}`}>{v.label}</Link>
            ))}
          </nav>
          <form className="flex gap-2 p-4" action="/admin/bookings">
            <input type="hidden" name="tab" value={tab} />
            <label htmlFor="bq" className="sr-only">Search bookings</label>
            <input id="bq" name="q" defaultValue={sp.q} placeholder="Search name, email, phone, reference…" className="input min-h-11" />
            <button className="btn-outline" type="submit">Search</button>
          </form>
          <div className="overflow-x-auto px-4 pb-4">
            <table className="w-full min-w-[760px]">
              <thead><tr><th className={th}>Client</th><th className={th}>Service</th><th className={th}>When</th><th className={th}>Payment</th><th className={th}>Status</th></tr></thead>
              <tbody>
                {rows.map((b) => (
                  <tr key={String(b._id)} className={selected && String(selected._id) === String(b._id) ? "bg-burgundy-soft" : ""}>
                    <td className={td}>
                      <Link href={link({ id: String(b._id) })} className="font-semibold">{b.name}</Link>
                      <br /><span className="text-muted">{b.email}</span>
                    </td>
                    <td className={td}>{b.serviceName}</td>
                    <td className={td}>{b.startsAt ? formatDate(b.startsAt, { dateStyle: "medium", timeStyle: "short" }, tz) : "Course"}</td>
                    <td className={td}>
                      {b.payment?.amount ? money(b.payment.amount, b.payment.currency || "CAD") : "Free"}
                      <br /><StatusPill status={b.payment?.status ?? "free"} />
                    </td>
                    <td className={td}><StatusPill status={b.status} label={STATUS_LABEL[b.status]} /></td>
                  </tr>
                ))}
                {rows.length === 0 && <tr><td className={td} colSpan={5}>No bookings here.</td></tr>}
              </tbody>
            </table>
          </div>
        </Panel>
        {selected ? (
          <BookingEditor
            key={String(selected._id)}
            b={{
              id: String(selected._id),
              name: selected.name,
              email: selected.email,
              phone: selected.phone ?? "",
              country: selected.country ?? "",
              stage: selected.stage ?? "",
              notes: selected.notes ?? "",
              serviceName: selected.serviceName,
              when: selected.startsAt ? `${formatDate(selected.startsAt, { dateStyle: "full", timeStyle: "short" }, tz)}` : "Course enrolment",
              clientWhen: selected.startsAt && selected.timezone ? `${formatDate(selected.startsAt, { dateStyle: "medium", timeStyle: "short" }, selected.timezone)} (${selected.timezone})` : "",
              status: selected.status,
              payment: selected.payment?.amount ? `${money(selected.payment.amount, selected.payment.currency || "CAD")} · ${selected.payment.status} · ${selected.payment.provider}` : "Free",
              reference: selected.payment?.reference ?? "",
              meetingLink: selected.meetingLink ?? "",
              adminNotes: selected.adminNotes ?? "",
              phoneDigits: (selected.phone ?? "").replace(/\D/g, ""),
            }}
          />
        ) : (
          <Panel><p className="text-sm text-muted">Select a booking to see details, add a meeting link, confirm or cancel.</p></Panel>
        )}
      </div>
    </>
  );
}
