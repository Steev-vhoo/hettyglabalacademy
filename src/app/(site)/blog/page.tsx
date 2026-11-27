import type { Metadata } from "next";
import Link from "next/link";
import { countPosts, getPosts } from "@/lib/queries";
import { POST_CATEGORIES } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { PageHero } from "@/components/ui";
import { PostCard, PostCover } from "@/components/PostCard";

export const revalidate = 300;
const PER_PAGE = 9;

export const metadata: Metadata = {
  title: "Blog — Nursing, NCLEX, CELPIP & Career Guides",
  description: "Practical guides for nursing students, nurses and exam candidates: NCLEX and CELPIP tips, English for work, and moving abroad as a nurse.",
  alternates: { canonical: "/blog" },
};

type Props = { searchParams: Promise<{ category?: string; q?: string; page?: string }> };

export default async function BlogPage({ searchParams }: Props) {
  const sp = await searchParams;
  const category = POST_CATEGORIES.includes(sp.category as (typeof POST_CATEGORIES)[number]) ? sp.category : undefined;
  const q = sp.q?.trim() || undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const [posts, total] = await Promise.all([getPosts({ category, q, limit: PER_PAGE, skip: (page - 1) * PER_PAGE }), countPosts({ category, q })]);
  const pages = Math.ceil(total / PER_PAGE);
  const [featured, ...rest] = page === 1 && !q && !category ? posts : [undefined, ...posts];
  const href = (p: Record<string, string | number | undefined>) => {
    const u = new URLSearchParams();
    for (const [k, v] of Object.entries({ category, q, ...p })) if (v) u.set(k, String(v));
    return `/blog${u.size ? `?${u}` : ""}`;
  };

  return (
    <>
      <PageHero crumb="Blog" title="Guides, tips & updates" intro="Practical guidance for nursing students, nurses and exam candidates.">
        <form action="/blog" className="mt-2 flex w-full max-w-md gap-2" role="search">
          <label htmlFor="q" className="sr-only">Search articles</label>
          <input id="q" name="q" type="search" defaultValue={q} placeholder="Search articles…" className="input rounded-full" />
          <button className="btn-primary" type="submit">Search</button>
        </form>
      </PageHero>
      <section className="py-14">
        <div className="container-x flex flex-col gap-12">
          <nav aria-label="Categories" className="flex flex-wrap gap-2">
            {[undefined, ...POST_CATEGORIES].map((c) => (
              <Link key={c ?? "all"} href={href({ category: c, page: undefined })} aria-current={c === category ? "page" : undefined}
                className={`flex min-h-11 items-center rounded-full border px-4 text-sm font-medium no-underline ${c === category ? "border-burgundy bg-burgundy text-white" : "border-line text-charcoal hover:border-gold"}`}>
                {c ?? "All"}
              </Link>
            ))}
          </nav>

          {featured && (
            <Link href={`/blog/${featured.slug}`} className="group grid items-center gap-8 text-charcoal no-underline lg:grid-cols-[1.2fr_1fr]">
              <PostCover post={featured} className="aspect-[16/9]" />
              <div className="flex flex-col gap-4">
                <span className="pill self-start bg-gold text-charcoal">Featured · {featured.category}</span>
                <h2 className="text-3xl leading-tight group-hover:underline sm:text-4xl">{featured.title}</h2>
                {featured.excerpt && <p className="text-lg text-muted">{featured.excerpt}</p>}
                <span className="text-sm text-muted">{featured.author} · {formatDate(featured.publishedAt)}</span>
              </div>
            </Link>
          )}

          {rest.length > 0 ? (
            <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">{rest.map((p) => p && <PostCard key={String(p._id)} post={p} />)}</div>
          ) : (
            !featured && <p className="text-center text-muted">{q || category ? "No articles match — try another search." : "The first articles are coming soon."}</p>
          )}

          {pages > 1 && (
            <nav aria-label="Pagination" className="flex justify-center gap-2">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <Link key={n} href={href({ page: n })} aria-current={n === page ? "page" : undefined}
                  className={`grid size-11 place-items-center rounded-full border no-underline ${n === page ? "border-burgundy bg-burgundy text-white" : "border-line text-charcoal"}`}>{n}</Link>
              ))}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
