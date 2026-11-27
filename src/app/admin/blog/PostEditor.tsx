"use client";

import Link from "next/link";
import { marked } from "marked";
import { useActionState, useMemo, useRef, useState } from "react";
import { deletePost, savePost } from "@/actions/admin";
import { initialState } from "@/actions/types";
import { POST_CATEGORIES } from "@/lib/constants";
import { slugify } from "@/lib/format";
import { Notice } from "@/components/ui";
import { FieldError, SubmitButton } from "@/components/forms/SubmitButton";

type P = {
  id: string; title: string; slug: string; excerpt: string; content: string; coverImage: string; coverAlt: string; category: string;
  tags: string; status: "draft" | "published"; publishedAt: string; featured: boolean; metaTitle: string; metaDescription: string; author: string;
};

const TOOLS: { label: string; title: string; before: string; after?: string; block?: boolean }[] = [
  { label: "H2", title: "Heading", before: "## ", block: true },
  { label: "H3", title: "Sub-heading", before: "### ", block: true },
  { label: "B", title: "Bold", before: "**", after: "**" },
  { label: "I", title: "Italic", before: "_", after: "_" },
  { label: "• List", title: "Bullet list", before: "- ", block: true },
  { label: "1. List", title: "Numbered list", before: "1. ", block: true },
  { label: "“ Quote", title: "Quote", before: "> ", block: true },
  { label: "Link", title: "Link", before: "[", after: "](https://)" },
  { label: "Image", title: "Image", before: "![Describe the image](https://", after: ")" },
  { label: "TikTok", title: "Embed a TikTok video", before: "\n::tiktok https://www.tiktok.com/@stylenurse1/video/", after: "\n", block: true },
];

export function PostEditor({ post, justCreated }: { post: P; justCreated?: boolean }) {
  const [state, action] = useActionState(savePost, initialState);
  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [content, setContent] = useState(post.content);
  const [meta, setMeta] = useState({ t: post.metaTitle, d: post.metaDescription });
  const [tab, setTab] = useState<"write" | "preview">("write");
  const ref = useRef<HTMLTextAreaElement>(null);
  const f = state.fields ?? {};
  const preview = useMemo(() => (tab === "preview" ? (marked.parse(content.replace(/^::tiktok\s+(\S+)$/gm, "> 🎬 TikTok video: $1"), { async: false }) as string) : ""), [content, tab]);

  function apply(t: (typeof TOOLS)[number]) {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: a, selectionEnd: b, value } = el;
    const sel = value.slice(a, b);
    const prefix = t.block && a > 0 && value[a - 1] !== "\n" ? "\n" : "";
    const insert = `${prefix}${t.before}${sel}${t.after ?? ""}`;
    const next = value.slice(0, a) + insert + value.slice(b);
    setContent(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = a + prefix.length + t.before.length + sel.length;
      el.setSelectionRange(pos, pos);
    });
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="id" value={post.id} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/blog" className="text-sm font-semibold no-underline">← All posts</Link>
          <h1 className="text-3xl">{post.id ? "Edit post" : "New post"}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {post.id && post.status === "published" && <a className="btn-outline" href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">View live ↗</a>}
          <SubmitButton pendingText="Saving…">Save</SubmitButton>
        </div>
      </div>
      {justCreated && !state.error && !state.ok && <Notice tone="success">Post created.</Notice>}
      {state.error && <Notice tone="error">{state.error}</Notice>}
      {state.ok && <Notice tone="success">{state.message}</Notice>}

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <section className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="p-6 pb-0">
            <label htmlFor="pe-title" className="sr-only">Title</label>
            <input id="pe-title" name="title" value={title} onChange={(e) => { setTitle(e.target.value); if (!post.id) setSlug(slugify(e.target.value)); }}
              placeholder="Post title" className="w-full border-0 bg-transparent font-serif text-3xl text-burgundy outline-none placeholder:text-[#b5aaa0]" />
            <FieldError id="pe-title-e" msg={f.title} />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-1 border-y border-line bg-ivory-light px-3 py-2">
            <div role="tablist" className="mr-3 flex gap-1">
              {(["write", "preview"] as const).map((t) => (
                <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`min-h-9 rounded-lg px-3 text-sm font-semibold capitalize ${tab === t ? "bg-burgundy text-white" : "text-charcoal hover:bg-ivory"}`}>{t}</button>
              ))}
            </div>
            {tab === "write" && TOOLS.map((t) => (
              <button key={t.label} type="button" title={t.title} onClick={() => apply(t)} className="min-h-9 min-w-9 rounded-lg px-2 text-sm font-semibold hover:bg-ivory">{t.label}</button>
            ))}
          </div>
          <label htmlFor="pe-content" className="sr-only">Content</label>
          <textarea id="pe-content" ref={ref} name="content" value={content} onChange={(e) => setContent(e.target.value)} hidden={tab !== "write"}
            placeholder={"Start writing…\n\nTips: ## for a heading, - for a list, **bold**. Paste a TikTok link after ::tiktok to embed a video."}
            className="block min-h-[560px] w-full resize-y border-0 p-6 font-mono text-[15px] leading-relaxed outline-none" />
          {tab === "preview" && <div className="prose-hga min-h-[560px] p-6" dangerouslySetInnerHTML={{ __html: preview || "<p><em>Nothing to preview yet.</em></p>" }} />}
        </section>

        <aside className="flex flex-col gap-4">
          <section className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-5">
            <h2 className="text-lg">Publishing</h2>
            <div><label className="label" htmlFor="pe-status">Status</label>
              <select className="input" id="pe-status" name="status" defaultValue={post.status}><option value="draft">Draft</option><option value="published">Published</option></select></div>
            <div><label className="label" htmlFor="pe-date">Publish date (UTC, optional)</label><input className="input" id="pe-date" name="publishedAt" type="datetime-local" defaultValue={post.publishedAt} />
              <p className="mt-1 text-xs text-muted">A future date schedules the post.</p></div>
            <div><label className="label" htmlFor="pe-author">Author</label><input className="input" id="pe-author" name="author" defaultValue={post.author} /></div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" defaultChecked={post.featured} className="size-4 accent-[#4a2832]" />Feature at the top of the blog</label>
          </section>
          <section className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-5">
            <h2 className="text-lg">Cover image</h2>
            <div><label className="label" htmlFor="pe-cover">Image link (https://…)</label><input className="input" id="pe-cover" name="coverImage" type="url" defaultValue={post.coverImage} /><FieldError id="pe-cover-e" msg={f.coverImage} /></div>
            <div><label className="label" htmlFor="pe-alt">Describe the image</label><input className="input" id="pe-alt" name="coverAlt" defaultValue={post.coverAlt} /></div>
          </section>
          <section className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-5">
            <h2 className="text-lg">Organise</h2>
            <div><label className="label" htmlFor="pe-cat">Category</label><select className="input" id="pe-cat" name="category" defaultValue={post.category}>{POST_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
            <div><label className="label" htmlFor="pe-tags">Tags (comma separated)</label><input className="input" id="pe-tags" name="tags" defaultValue={post.tags} placeholder="NCLEX, study tips" /></div>
            <div><label className="label" htmlFor="pe-excerpt">Summary</label><textarea className="input min-h-20" id="pe-excerpt" name="excerpt" defaultValue={post.excerpt} maxLength={300} placeholder="1–2 sentences shown on the blog page" /></div>
          </section>
          <section className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-5">
            <h2 className="text-lg">Search engines (SEO)</h2>
            <div><label className="label" htmlFor="pe-slug">Web address</label>
              <div className="flex items-center gap-1 text-sm text-muted">/blog/<input className="input min-h-10" id="pe-slug" name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} /></div>
              <FieldError id="pe-slug-e" msg={f.slug} /></div>
            <div><label className="label" htmlFor="pe-mt">Search title <span className="font-normal text-muted">({meta.t.length}/70)</span></label><input className="input" id="pe-mt" name="metaTitle" value={meta.t} onChange={(e) => setMeta({ ...meta, t: e.target.value })} maxLength={70} placeholder={title} /><FieldError id="pe-mt-e" msg={f.metaTitle} /></div>
            <div><label className="label" htmlFor="pe-md">Search description <span className="font-normal text-muted">({meta.d.length}/170)</span></label><textarea className="input min-h-20" id="pe-md" name="metaDescription" value={meta.d} onChange={(e) => setMeta({ ...meta, d: e.target.value })} maxLength={170} /><FieldError id="pe-md-e" msg={f.metaDescription} /></div>
            <div className="rounded-xl border border-line p-3 text-sm">
              <p className="text-xs text-muted">Google preview</p>
              <p className="truncate text-[#1a0dab]">{meta.t || title || "Post title"} | Hetty Global Academy</p>
              <p className="text-xs text-[#006621]">…/blog/{slug || "post-title"}</p>
              <p className="line-clamp-2 text-xs text-muted">{meta.d || post.excerpt || "Add a search description."}</p>
            </div>
          </section>
          {post.id && (
            <button type="submit" formAction={deletePost.bind(null, post.id)} formNoValidate className="btn-outline border-[#8a1c1c] text-[#8a1c1c]"
              onClick={(e) => { if (!confirm("Delete this post permanently?")) e.preventDefault(); }}>
              Delete post
            </button>
          )}
        </aside>
      </div>
    </form>
  );
}
