import Link from "next/link";
import { db } from "@/lib/db";
import { Service, type ServiceDoc } from "@/lib/models";
import { formatDate, money } from "@/lib/format";
import { Notice, StatusPill } from "@/components/ui";
import { ACADEMY_LABEL } from "@/lib/constants";
import { AdminHeader, Panel, td, th } from "../ui";
import { ServiceForm, type ServiceInput } from "./ServiceForm";

export const metadata = { title: "Services & courses" };

const toInput = (s?: ServiceDoc): ServiceInput => ({
  id: s ? String(s._id) : "",
  name: s?.name ?? "",
  kind: s?.kind ?? "consultation",
  academy: s?.academy ?? "general",
  summary: s?.summary ?? "",
  durationMin: s?.durationMin ?? 60,
  priceGHS: s?.priceGHS != null ? (s.priceGHS / 100).toFixed(2) : "",
  priceCAD: s?.priceCAD != null ? (s.priceCAD / 100).toFixed(2) : "",
  startDate: s?.startDate ? s.startDate.toISOString().slice(0, 10) : "",
  schedule: s?.schedule ?? "",
  seats: s?.seats ?? 0,
  formats: s?.formats?.length ? s.formats : ["individual", "group"],
  order: s?.order ?? 0,
  active: s?.active ?? true,
});

export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ edit?: string; saved?: string }> }) {
  const sp = await searchParams;
  await db();
  const services = await Service.find().sort({ order: 1, name: 1 }).lean<ServiceDoc[]>();
  const editing = sp.edit === "new" ? undefined : services.find((s) => String(s._id) === sp.edit);
  const showForm = sp.edit === "new" || !!editing;

  return (
    <>
      <AdminHeader title="Services & courses" intro="What clients can book. Leave a price empty if you don't offer that currency; use 0 for free.">
        <Link href="/admin/services?edit=new" className="btn-primary">+ Add service</Link>
      </AdminHeader>
      {sp.saved && <div className="mb-4"><Notice tone="success">Saved.</Notice></div>}
      <div className="grid gap-6 2xl:grid-cols-[1fr_480px]">
        <Panel>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead><tr><th className={th}>Service</th><th className={th}>Type</th><th className={th}>GHS</th><th className={th}>CAD</th><th className={th}>Status</th><th className={th}></th></tr></thead>
              <tbody>
                {services.map((s) => (
                  <tr key={String(s._id)}>
                    <td className={td}><strong>{s.name}</strong><br /><span className="text-muted">{ACADEMY_LABEL[s.academy]}</span></td>
                    <td className={td}>{s.kind === "course" ? `Course${s.startDate ? ` · ${formatDate(s.startDate)}` : ""}` : `${s.durationMin} min`}</td>
                    <td className={td}>{s.priceGHS != null ? money(s.priceGHS, "GHS") : "—"}</td>
                    <td className={td}>{s.priceCAD != null ? money(s.priceCAD, "CAD") : "—"}</td>
                    <td className={td}><StatusPill status={s.active ? "confirmed" : "cancelled"} label={s.active ? "Bookable" : "Hidden"} /></td>
                    <td className={td}><Link href={`/admin/services?edit=${s._id}`} className="font-semibold">Edit</Link></td>
                  </tr>
                ))}
                {services.length === 0 && <tr><td className={td} colSpan={6}>No services yet. Run <code>npm run seed</code> for starter services, or add one.</td></tr>}
              </tbody>
            </table>
          </div>
        </Panel>
        {showForm && <ServiceForm key={sp.edit} s={toInput(editing)} />}
      </div>
    </>
  );
}
