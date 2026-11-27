import Image from "next/image";
import Link from "next/link";
import type { PostDoc } from "@/lib/models";
import { formatDate } from "@/lib/format";

export function PostCover({ post, className = "" }: { post: Pick<PostDoc, "coverImage" | "coverAlt" | "title" | "category">; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-burgundy ${className}`}>
      {post.coverImage ? (
        <Image src={post.coverImage} alt={post.coverAlt || ""} fill sizes="(min-width: 1024px) 400px, 100vw" className="object-cover" />
      ) : (
        <div className="flex h-full flex-col justify-end bg-[radial-gradient(circle_at_80%_10%,#6b3542,transparent_55%)] p-6">
          <span className="font-display text-xs tracking-[0.2em] text-gold">{post.category.toUpperCase()}</span>
        </div>
      )}
    </div>
  );
}

export function PostCard({ post }: { post: PostDoc }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col gap-3 text-charcoal no-underline">
      <PostCover post={post} className="aspect-[16/10]" />
      <span className="pill self-start bg-gold-soft text-burgundy">{post.category}</span>
      <h3 className="text-xl leading-snug group-hover:underline">{post.title}</h3>
      {post.excerpt && <p className="line-clamp-2 text-[15px] text-muted">{post.excerpt}</p>}
      <span className="text-[13px] text-muted">{formatDate(post.publishedAt)}</span>
    </Link>
  );
}
