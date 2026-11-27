/** Extracts the numeric video id from a full TikTok video URL (https://www.tiktok.com/@user/video/123…). */
export function tiktokId(url: string): string | null {
  try {
    const u = new URL(url.trim());
    if (!/(^|\.)tiktok\.com$/.test(u.hostname)) return null;
    const m = u.pathname.match(/\/(?:video|photo|v|embed\/v2|player\/v1)\/(\d{8,25})/);
    return m ? m[1] : null;
  } catch {
    return /^\d{8,25}$/.test(url.trim()) ? url.trim() : null;
  }
}

export const tiktokPlayerUrl = (id: string) => `https://www.tiktok.com/player/v1/${id}?autoplay=1&rel=0`;

/** Best-effort title lookup via TikTok's public oEmbed endpoint (no API key needed). */
export async function tiktokTitle(url: string): Promise<string> {
  try {
    const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return "";
    const json = (await res.json()) as { title?: string };
    return (json.title ?? "").slice(0, 200);
  } catch {
    return "";
  }
}
