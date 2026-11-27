import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Booking, type BookingDoc } from "@/lib/models";

export const dynamic = "force-dynamic";

const cell = (v: unknown) => {
  let s = v == null ? "" : v instanceof Date ? v.toISOString() : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // stop spreadsheet formula injection
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET() {
  const s = await getSession();
  if (s?.role !== "admin") return new Response("Forbidden", { status: 403 });
  await db();
  const rows = await Booking.find().sort({ createdAt: -1 }).limit(5000).lean<BookingDoc[]>();
  const head = ["Created", "Name", "Email", "Phone", "Country", "Service", "Starts (UTC)", "Status", "Amount", "Currency", "Payment", "Provider", "Reference", "Notes"];
  const lines = rows.map((b) =>
    [b.createdAt, b.name, b.email, b.phone, b.country, b.serviceName, b.startsAt, b.status, (b.payment?.amount ?? 0) / 100, b.payment?.currency, b.payment?.status, b.payment?.provider, b.payment?.reference, b.notes].map(cell).join(","),
  );
  return new Response([head.map(cell).join(","), ...lines].join("\n"), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="hga-bookings-${new Date().toISOString().slice(0, 10)}.csv"` },
  });
}
