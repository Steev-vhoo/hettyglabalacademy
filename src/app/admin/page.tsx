import Link from "next/link";
import { db } from "@/lib/db";
import { Booking, Message, Post, User, type BookingDoc, type MessageDoc } from "@/lib/models";
import { formatDate, money, STATUS_LABEL } from "@/lib/format";
import { StatusPill } from "@/components/ui";
import { AdminHeader, Panel, Stat, td, th } from "./ui";

export default async function AdminOverview() {
  await db();
  const now = new Date();
  const week = new Date(Date.now() + 7 * 86400_000);
  const monthAgo = new Date(Date.now() - 30 * 86400_000);
  const [upcoming, pending, unread, published, drafts, students, recent, messages, revenue] = await Promise.all([
    Booking.countDocuments({ status: "confirmed", startsAt: { $gte: now, $lte: week } }),
    Booking.countDocuments({ status: "pending" }),
    Message.countDocuments({ read: false }),
    Post.countDocuments({ status: "published" }),
    Post.countDocuments({ status: "draft" }),
    User.countDocuments({ role: "student" }),
    Booking.find({ status: { $ne: "cancelled" } }).sort({ createdAt: -1 }).limit(8).lean<BookingDoc[]>(),
    Message.find({ read: false }).sort({ createdAt: -1 }).limit(4).lean<MessageDoc[]>(),
    Booking.aggregate<{ _id: string; total: number }>([
      { $match: { "payment.status": "paid", "payment.paidAt": { $gte: monthAgo } } },
      { $group: { _id: "$payment.currency", total: { $sum: "$payment.amount" } } },
    ]),
  ]);

  return (
    <>
      <AdminHeader title="Overview" intro="What's happening at the academy.">
        <Link href="/admin/blog/new" className="btn-primary">+ New blog post</Link>
        <Link href="/admin/availability" className="btn-outline">Set availability</Link>
      </AdminHeader>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Stat label="Confirmed, next 7 days" value={upcoming} />
        <Stat label="Pending confirmation" value={pending} note="Free bookings awaiting you" />
        <Stat label="Unread messages" value={unread} />
        <Stat label="Students registered" value={students} />
        <Stat label="Paid, last 30 days" value={revenue.length ? revenue.map((r) => money(r.total, r._id)).join(" + ") : "—"} note={`${published} posts live · ${drafts} drafts`} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Recent bookings">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead><tr><th className={th}>Client</th><th className={th}>Service</th><th className={th}>When</th><th className={th}>Status</th></tr></thead>
              <tbody>
                {recent.map((b) => (
                  <tr key={String(b._id)}>
                    <td className={td}><Link href={`/admin/bookings?id=${b._id}`} className="font-semibold">{b.name}</Link><br /><span className="text-muted">{b.country}</span></td>
                    <td className={td}>{b.serviceName}</td>
                    <td className={td}>{b.startsAt ? formatDate(b.startsAt, { dateStyle: "medium", timeStyle: "short" }) : "Course"}</td>
                    <td className={td}><StatusPill status={b.status} label={STATUS_LABEL[b.status]} /></td>
                  </tr>
                ))}
                {recent.length === 0 && <tr><td className={td} colSpan={4}>No bookings yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel title="Unread messages">
          <ul className="flex flex-col gap-4">
            {messages.map((m) => (
              <li key={String(m._id)} className="text-sm">
                <strong>{m.name}</strong> · <span className="text-muted">{m.topic}</span>
                <p className="line-clamp-2 text-muted">{m.message}</p>
              </li>
            ))}
            {messages.length === 0 && <li className="text-sm text-muted">All caught up.</li>}
          </ul>
          <Link href="/admin/messages" className="mt-4 inline-block text-sm font-semibold">All messages →</Link>
        </Panel>
      </div>
    </>
  );
}
