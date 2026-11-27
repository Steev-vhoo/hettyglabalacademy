import { db } from "@/lib/db";
import { Booking, Subscriber, User, type UserDoc } from "@/lib/models";
import { formatDate } from "@/lib/format";
import { AdminHeader, Panel, td, th } from "../ui";

export const metadata = { title: "Students" };

export default async function StudentsPage() {
  await db();
  const [students, counts, subscribers] = await Promise.all([
    User.find({ role: "student" }).sort({ createdAt: -1 }).limit(500).lean<UserDoc[]>(),
    Booking.aggregate<{ _id: string; n: number }>([{ $match: { status: { $ne: "cancelled" } } }, { $group: { _id: "$email", n: { $sum: 1 } } }]),
    Subscriber.countDocuments(),
  ]);
  const byEmail = new Map(counts.map((c) => [c._id, c.n]));
  return (
    <>
      <AdminHeader title="Students" intro={`${students.length} registered students · ${subscribers} newsletter subscribers`} />
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead><tr><th className={th}>Name</th><th className={th}>Contact</th><th className={th}>Country</th><th className={th}>Stage</th><th className={th}>Interests</th><th className={th}>Bookings</th><th className={th}>Joined</th></tr></thead>
            <tbody>
              {students.map((u) => (
                <tr key={String(u._id)}>
                  <td className={td}><strong>{u.name}</strong></td>
                  <td className={td}><a href={`mailto:${u.email}`}>{u.email}</a><br /><span className="text-muted">{u.phone}</span></td>
                  <td className={td}>{u.country}</td>
                  <td className={td}>{u.stage}</td>
                  <td className={td}>{(u.interests ?? []).join(", ")}</td>
                  <td className={td}>{byEmail.get(u.email) ?? 0}</td>
                  <td className={td}>{formatDate(u.createdAt)}</td>
                </tr>
              ))}
              {students.length === 0 && <tr><td className={td} colSpan={7}>No students registered yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
