import "server-only";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { tiktokId } from "./tiktok";

/**
 * Blog posts are written in Markdown. A line containing only `::tiktok <video url>` becomes an embedded TikTok player.
 * Output is sanitised, so even a compromised admin account can't inject scripts into public pages.
 */
export function renderMarkdown(md: string) {
  const withEmbeds = md.replace(/^::tiktok\s+(\S+)\s*$/gm, (line, url: string) => {
    const id = tiktokId(url);
    return id
      ? `<div class="embed-tiktok"><iframe src="https://www.tiktok.com/player/v1/${id}" title="TikTok video" allow="encrypted-media; fullscreen" loading="lazy"></iframe></div>`
      : line;
  });
  const html = marked.parse(withEmbeds, { async: false, gfm: true, breaks: false });
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "iframe"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title", "width", "height", "loading"],
      iframe: ["src", "title", "allow", "loading"],
      div: ["class"],
    },
    allowedIframeHostnames: ["www.tiktok.com", "www.youtube.com", "www.youtube-nocookie.com"],
    allowedSchemes: ["https", "mailto", "tel"],
    transformTags: {
      a: (tag, attribs) => ({
        tagName: "a",
        attribs: /^https?:/.test(attribs.href ?? "") ? { ...attribs, rel: "noopener noreferrer", target: "_blank" } : attribs,
      }),
      img: (tag, attribs) => ({ tagName: "img", attribs: { ...attribs, loading: "lazy" } }),
    },
  });
}

export function readingMinutes(md: string) {
  return Math.max(1, Math.round(md.split(/\s+/).filter(Boolean).length / 220));
}
