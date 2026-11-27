import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { programs } from "@/lib/programs";
import { getSitemapPosts } from "@/lib/queries";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fixed = ["", "/about", "/programs", "/resources", "/videos", "/blog", "/contact", "/book", "/register", "/privacy", "/terms"].map((p) => ({
    url: `${site.url}${p}`,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
  const programPages = programs.map((p) => ({ url: `${site.url}/programs/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.9 }));
  const posts = (await getSitemapPosts()).map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 }));
  return [...fixed, ...programPages, ...posts];
}
