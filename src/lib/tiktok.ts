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

/** True for share links such as https://vt.tiktok.com/ZSs2ASuhm/ or https://www.tiktok.com/t/ZT…/ */
export function isTikTokShortLink(url: string) {
  try {
    const u = new URL(url.trim());
    return /^(vt|vm)\.tiktok\.com$/.test(u.hostname) || (/(^|\.)tiktok\.com$/.test(u.hostname) && u.pathname.startsWith("/t/"));
  } catch {
    return false;
  }
}

/**
 * Turns a TikTok share link into the full video URL by following its redirect.
 * Full links are returned unchanged. Returns null when the link can't be resolved.
 */
export async function resolveTikTokUrl(url: string): Promise<string | null> {
  const trimmed = url.trim();
  if (tiktokId(trimmed)) return trimmed.split("?")[0];
  if (!isTikTokShortLink(trimmed)) return null;
  try {
    let next = trimmed;
    for (let i = 0; i < 5; i++) {
      const res = await fetch(next, { redirect: "manual", signal: AbortSignal.timeout(6000), headers: { "User-Agent": "Mozilla/5.0 (compatible; HGA-site)" } });
      const loc = res.headers.get("location");
      if (!loc) break;
      next = new URL(loc, next).toString();
      if (tiktokId(next)) return next.split("?")[0];
    }
  } catch {
    /* network error — fall through */
  }
  return null;
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
