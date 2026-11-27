import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getRelatedPosts } from "@/lib/queries";
import { readingMinutes, renderMarkdown } from "@/lib/markdown";
import { formatDate } from "@/lib/format";
import { site, whatsappLink } from "@/lib/site";
import { JsonLd } from "@/components/ui";
import { PostCard, PostCover } from "@/components/PostCard";
import { Arrow } from "@/components/icons";

export const revalidate = 300;
export const generateStaticParams = async () => [];

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return { title: "Article not found" };
  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt;
  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
      authors: [post.author],
      ...(post.coverImage ? { images: [{ url: post.coverImage, alt: post.coverAlt }] } : {}),
    },
  };
}

export default async function PostPage({ params }: Props) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const [html, related] = [renderMarkdown(post.content), await getRelatedPosts(post)];
  const url = `${site.url}/blog/${post.slug}`;
  const share = [
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${post.title} ${url}`)}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  ];

  return (
    <article className="py-14">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.metaDescription || post.excerpt,
          datePublished: post.publishedAt?.toISOString(),
          dateModified: post.updatedAt?.toISOString(),
          author: { "@type": "Person", name: post.author },
          publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: `${site.url}/brand/crest-transparent.webp` } },
          mainEntityOfPage: url,
          ...(post.coverImage ? { image: post.coverImage } : {}),
        }}
      />
      <div className="container-x flex max-w-3xl flex-col gap-6">
        <Link href="/blog" className="text-sm font-semibold no-underline">← Back to blog</Link>
        <span className="pill self-start bg-gold-soft text-burgundy">{post.category}</span>
        <h1 className="text-4xl leading-[1.1] sm:text-5xl">{post.title}</h1>
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted">
          <span><strong className="text-charcoal">{post.author}</strong> · {formatDate(post.publishedAt, { dateStyle: "long" })} · {readingMinutes(post.content)} min read</span>
          <span className="flex flex-wrap gap-2">
            {share.map((s) => <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm border-line">{s.label}</a>)}
          </span>
        </div>
      </div>
      {post.coverImage && (
        <div className="container-x mt-10 max-w-5xl"><PostCover post={post} className="aspect-[16/8]" /></div>
      )}
      <div className="container-x mt-10 max-w-3xl">
        <div className="prose-hga" dangerouslySetInnerHTML={{ __html: html }} />
        {post.tags?.length > 0 && <p className="mt-8 flex flex-wrap gap-2">{post.tags.map((t) => <span key={t} className="pill bg-ivory text-muted">#{t}</span>)}</p>}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-burgundy p-8 text-white">
          <div><h2 className="text-2xl text-white">Want help with this?</h2><p className="text-white/80">Book a one-to-one session with Harriet.</p></div>
          <div className="flex flex-wrap gap-2">
            <Link href="/book" className="btn-gold">Book a session <Arrow /></Link>
            <a href={whatsappLink(`Hello, I read "${post.title}" and have a question.`)} className="btn border border-white/40 text-white hover:bg-white/10" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <div className="container-x mt-20 flex flex-col gap-8">
          <h2 className="text-3xl">Related articles</h2>
          <div className="grid gap-8 md:grid-cols-3">{related.map((p) => <PostCard key={String(p._id)} post={p} />)}</div>
        </div>
      )}
    </article>
  );
}
