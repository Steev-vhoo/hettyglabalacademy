import "server-only";
import { db, hasDb } from "./db";
import { Post, Resource, Service, Video, type PostDoc, type ResourceDoc, type ServiceDoc, type VideoDoc } from "./models";

/** Public pages should still render (without dynamic content) if the database is down or not set up yet. */
async function safe<T>(fallback: T, fn: () => Promise<T>): Promise<T> {
  if (!hasDb()) return fallback;
  try {
    await db();
    return await fn();
  } catch (e) {
    console.error("[queries]", e);
    return fallback;
  }
}

const published = () => ({ status: "published", publishedAt: { $lte: new Date() } });

export const getPosts = (opts: { limit?: number; category?: string; q?: string; skip?: number } = {}) =>
  safe<PostDoc[]>([], () => {
    const filter: Record<string, unknown> = published();
    if (opts.category) filter.category = opts.category;
    if (opts.q) filter.$or = [{ title: { $regex: escapeRegex(opts.q), $options: "i" } }, { excerpt: { $regex: escapeRegex(opts.q), $options: "i" } }];
    return Post.find(filter).sort({ featured: -1, publishedAt: -1 }).skip(opts.skip ?? 0).limit(opts.limit ?? 12).select("-content").lean<PostDoc[]>();
  });

export const countPosts = (opts: { category?: string; q?: string } = {}) =>
  safe(0, () => {
    const filter: Record<string, unknown> = published();
    if (opts.category) filter.category = opts.category;
    if (opts.q) filter.$or = [{ title: { $regex: escapeRegex(opts.q), $options: "i" } }, { excerpt: { $regex: escapeRegex(opts.q), $options: "i" } }];
    return Post.countDocuments(filter);
  });

export const getPost = (slug: string) => safe<PostDoc | null>(null, () => Post.findOne({ slug, ...published() }).lean<PostDoc>());

export const getRelatedPosts = (p: PostDoc) =>
  safe<PostDoc[]>([], () => Post.find({ ...published(), _id: { $ne: p._id }, category: p.category }).sort({ publishedAt: -1 }).limit(3).select("-content").lean<PostDoc[]>());

export const getVideos = (opts: { featuredOnly?: boolean; limit?: number } = {}) =>
  safe<VideoDoc[]>([], () => Video.find(opts.featuredOnly ? { featured: true } : {}).sort({ order: 1, createdAt: -1 }).limit(opts.limit ?? 48).lean<VideoDoc[]>());

export const getServices = (academies?: readonly string[]) =>
  safe<ServiceDoc[]>([], () => Service.find({ active: true, ...(academies ? { academy: { $in: academies } } : {}) }).sort({ order: 1, name: 1 }).lean<ServiceDoc[]>());

export const getResources = () => safe<ResourceDoc[]>([], () => Resource.find().sort({ category: 1, order: 1, createdAt: -1 }).lean<ResourceDoc[]>());

export const getSitemapPosts = () => safe<{ slug: string; updatedAt: Date }[]>([], () => Post.find(published()).select("slug updatedAt").lean());

function escapeRegex(s: string) {
  return s.slice(0, 80).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
