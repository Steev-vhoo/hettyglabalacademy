import type { Metadata } from "next";
import { getVideos } from "@/lib/queries";
import { site, tiktokProfileUrl } from "@/lib/site";
import { JsonLd, PageHero } from "@/components/ui";
import { TikTokCard } from "@/components/TikTokCard";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Videos — Popular on TikTok",
  description: `Popular videos from ${site.founder.name} (@${site.social.tiktokHandle}) on nursing, NCLEX, CELPIP and life abroad.`,
  alternates: { canonical: "/videos" },
};

export default async function VideosPage() {
  const videos = await getVideos();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: videos.map((v, i) => ({ "@type": "ListItem", position: i + 1, url: v.url, name: v.title || `Video ${i + 1}` })),
        }}
      />
      <PageHero crumb="Videos" title="Popular on TikTok" intro={`Short, practical videos from @${site.social.tiktokHandle} — nursing tips, exam advice and life abroad.`}>
        <a href={tiktokProfileUrl} className="btn-primary mt-2" target="_blank" rel="noopener noreferrer">Follow @{site.social.tiktokHandle}</a>
      </PageHero>
      <section className="py-16">
        <div className="container-x">
          {videos.length > 0 ? (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
              {videos.map((v) => <TikTokCard key={v.videoId} videoId={v.videoId} title={v.title} coverImage={v.coverImage} url={v.url} />)}
            </div>
          ) : (
            <p className="text-center text-muted">No videos yet — <a href={tiktokProfileUrl} target="_blank" rel="noopener noreferrer">watch on TikTok</a>.</p>
          )}
          <p className="mt-10 text-center text-xs text-muted">Videos play from TikTok and load only when you press play.</p>
        </div>
      </section>
    </>
  );
}
