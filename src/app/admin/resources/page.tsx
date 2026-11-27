import { db } from "@/lib/db";
import { Resource, type ResourceDoc } from "@/lib/models";
import { deleteResource } from "@/actions/admin";
import { RESOURCE_CATEGORIES } from "@/lib/constants";
import { AdminHeader, Panel } from "../ui";
import { AddResourceForm } from "./AddResourceForm";

export const metadata = { title: "Resources" };

export default async function ResourcesAdmin() {
  await db();
  const items = await Resource.find().sort({ category: 1, order: 1 }).lean<ResourceDoc[]>();
  return (
    <>
      <AdminHeader title="Resources" intro="Study materials, guides and links shown on the Resources page. Upload PDFs to Google Drive or Dropbox, set sharing to “Anyone with the link”, and paste the link here." />
      <div className="grid gap-6 xl:grid-cols-[400px_1fr]">
        <AddResourceForm />
        <div className="flex flex-col gap-5">
          {RESOURCE_CATEGORIES.map((cat) => {
            const list = items.filter((r) => r.category === cat);
            return (
              <Panel key={cat} title={`${cat} (${list.length})`}>
                <ul className="flex flex-col divide-y divide-line">
                  {list.map((r) => (
                    <li key={String(r._id)} className="flex flex-wrap items-center gap-3 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{r.title} <span className="pill ml-1 bg-ivory text-muted">{r.kind}</span></p>
                        <a href={r.url} target="_blank" rel="noopener noreferrer" className="block truncate text-xs">{r.url}</a>
                      </div>
                      <form action={deleteResource.bind(null, String(r._id))}>
                        <button type="submit" className="btn-outline btn-sm border-line text-[#8a1c1c]">Remove</button>
                      </form>
                    </li>
                  ))}
                  {list.length === 0 && <li className="py-2 text-sm text-muted">Nothing here yet.</li>}
                </ul>
              </Panel>
            );
          })}
        </div>
      </div>
    </>
  );
}
