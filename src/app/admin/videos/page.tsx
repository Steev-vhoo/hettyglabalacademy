import { db } from "@/lib/db";
import { Video, type VideoDoc } from "@/lib/models";
import { deleteVideo, updateVideo } from "@/actions/admin";
import { site } from "@/lib/site";
import { AdminHeader, Panel } from "../ui";
import { AddVideoForm } from "./AddVideoForm";

export const metadata = { title: "TikTok videos" };

export default async function VideosAdmin() {
  await db();
  const videos = await Video.find().sort({ order: 1, createdAt: -1 }).lean<VideoDoc[]>();
  return (
    <>
      <AdminHeader title="TikTok videos" intro={`Choose which @${site.social.tiktokHandle} videos appear on the website. Featured videos (first 4) also show on the homepage.`} />
      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <AddVideoForm />
        <Panel title={`On the site (${videos.length})`}>
          <ul className="flex flex-col divide-y divide-line">
            {videos.map((v, i) => (
              <li key={String(v._id)} className="flex flex-wrap items-center gap-3 py-3">
                <span className="w-6 text-sm text-muted">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{v.title || "Untitled video"}</p>
                  <a href={v.url} target="_blank" rel="noopener noreferrer" className="block truncate text-xs">{v.url}</a>
                </div>
                <form action={updateVideo.bind(null, String(v._id), { featured: !v.featured })}>
                  <button className={`pill ${v.featured ? "bg-gold text-charcoal" : "bg-ivory text-muted"}`} type="submit">{v.featured ? "★ Featured" : "☆ Feature"}</button>
                </form>
                <form action={updateVideo.bind(null, String(v._id), { move: "up" })}><button type="submit" className="btn-outline btn-sm border-line px-3" aria-label="Move up" disabled={i === 0}>↑</button></form>
                <form action={updateVideo.bind(null, String(v._id), { move: "down" })}><button type="submit" className="btn-outline btn-sm border-line px-3" aria-label="Move down" disabled={i === videos.length - 1}>↓</button></form>
                <form action={deleteVideo.bind(null, String(v._id))}><button type="submit" className="btn-outline btn-sm border-line text-[#8a1c1c]">Remove</button></form>
              </li>
            ))}
            {videos.length === 0 && <li className="py-3 text-sm text-muted">No videos yet. Add your most popular TikToks on the left.</li>}
          </ul>
        </Panel>
      </div>
    </>
  );
}
