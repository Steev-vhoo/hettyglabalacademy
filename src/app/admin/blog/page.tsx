import Link from "next/link";
import { db } from "@/lib/db";
import { Post, type PostDoc } from "@/lib/models";
import { formatDate } from "@/lib/format";
import { Notice, StatusPill } from "@/components/ui";
import { AdminHeader, Panel, td, th } from "../ui";

export const metadata = { title: "Blog posts" };

export default async function AdminBlog({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  const sp = await searchParams;
  await db();
  const posts = await Post.find().sort({ updatedAt: -1 }).select("-content").lean<PostDoc[]>();
  return (
    <>
      <AdminHeader title="Blog posts" intro="Write in plain text with simple formatting — the editor shows a live preview.">
        <Link href="/admin/blog/new" className="btn-primary">+ New post</Link>
      </AdminHeader>
      {sp.deleted && <div className="mb-4"><Notice>Post deleted.</Notice></div>}
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead><tr><th className={th}>Title</th><th className={th}>Category</th><th className={th}>Status</th><th className={th}>Updated</th></tr></thead>
            <tbody>
              {posts.map((p) => (
                <tr key={String(p._id)}>
                  <td className={td}><Link href={`/admin/blog/${p._id}`} className="font-semibold">{p.title}</Link>{p.featured && <span className="ml-2 pill bg-gold text-charcoal">Featured</span>}<br /><span className="text-muted">/blog/{p.slug}</span></td>
                  <td className={td}>{p.category}</td>
                  <td className={td}><StatusPill status={p.status} />{p.status === "published" && p.publishedAt && p.publishedAt > new Date() && <span className="block text-xs text-muted">Scheduled {formatDate(p.publishedAt)}</span>}</td>
                  <td className={td}>{formatDate(p.updatedAt)}</td>
                </tr>
              ))}
              {posts.length === 0 && <tr><td className={td} colSpan={4}>No posts yet — write your first one.</td></tr>}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
