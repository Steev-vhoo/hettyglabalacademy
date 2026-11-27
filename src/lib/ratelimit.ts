import "server-only";
import { headers } from "next/headers";

/**
 * Small in-memory limiter for sign-in, registration and form spam.
 * Per server instance only — enough for a small site; move to Redis/Upstash if traffic grows.
 */
const hits = new Map<string, number[]>();

export async function rateLimited(bucket: string, max: number, windowMs: number) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "local";
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > max;
}
