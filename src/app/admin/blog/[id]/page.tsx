import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Post, type PostDoc } from "@/lib/models";
import { PostEditor } from "../PostEditor";

export const metadata = { title: "Edit post" };

export default async function EditPost({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const { id } = await params;
  if (!/^[a-f0-9]{24}$/.test(id)) notFound();
  await db();
  const p = await Post.findById(id).lean<PostDoc>();
  if (!p) notFound();
  return (
    <PostEditor
      justCreated={!!(await searchParams).saved}
      post={{
        id: String(p._id),
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        content: p.content,
        coverImage: p.coverImage,
        coverAlt: p.coverAlt,
        category: p.category,
        tags: (p.tags ?? []).join(", "),
        status: p.status,
        publishedAt: p.publishedAt ? new Date(p.publishedAt.getTime() - p.publishedAt.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "",
        featured: p.featured,
        metaTitle: p.metaTitle,
        metaDescription: p.metaDescription,
        author: p.author,
      }}
    />
  );
}
