"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { ACADEMIES, Booking, BOOKING_STATUSES, Message, POST_CATEGORIES, Post, Service, Settings, Video } from "@/lib/models";
import { notifyBooking } from "@/lib/booking";
import { slugify } from "@/lib/format";
import { hhmmToMinutes } from "@/lib/slots";
import { tiktokId, tiktokTitle } from "@/lib/tiktok";
import { fieldErrors, type FormState } from "./types";

const objectId = z.string().regex(/^[a-f0-9]{24}$/);
const optionalUrl = z.union([z.literal(""), z.string().trim().url().startsWith("https://", "Use an https:// link")]);
const toMinor = (v: string) => (v.trim() === "" ? null : Math.round(Number(v) * 100));

async function admin() {
  await requireAdmin();
  await db();
}

/* ---------------- Bookings ---------------- */

const bookingUpdate = z.object({
  id: objectId,
  status: z.enum(BOOKING_STATUSES),
  meetingLink: optionalUrl,
  adminNotes: z.string().max(4000),
  notify: z.string().optional(),
});

export async function updateBooking(_: FormState, form: FormData): Promise<FormState> {
  await admin();
  const parsed = bookingUpdate.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Please check the fields.", fields: fieldErrors(parsed.error.issues) };
  const d = parsed.data;
  const b = await Booking.findById(d.id);
  if (!b) return { error: "Booking not found." };
  const before = b.status;
  b.status = d.status;
  b.meetingLink = d.meetingLink || undefined;
  b.adminNotes = d.adminNotes;
  if (d.status === "cancelled") b.slotKey = undefined;
  else if (b.startsAt && !b.slotKey) b.slotKey = b.startsAt.toISOString();
  try {
    await b.save();
  } catch {
    return { error: "That time is now held by another booking. Cancel or move the other booking first." };
  }
  if (d.notify && before !== d.status && (d.status === "confirmed" || d.status === "cancelled")) {
    await notifyBooking(b.toObject(), d.status);
  }
  revalidatePath("/admin/bookings");
  return { ok: true, message: "Booking updated." };
}

/* ---------------- Availability ---------------- */

export async function saveAvailability(_: FormState, form: FormData): Promise<FormState> {
  await admin();
  const weekly: { day: number; start: number; end: number }[] = [];
  for (let day = 0; day < 7; day++) {
    if (form.get(`on-${day}`) !== "on") continue;
    const ranges = String(form.get(`hours-${day}`) ?? "").split(",").map((r) => r.trim()).filter(Boolean);
    for (const r of ranges) {
      const m = r.match(/^(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/);
      if (!m) return { error: `Day ${day}: use hours like 09:00-12:00, 14:00-17:00` };
      const start = hhmmToMinutes(m[1]);
      const end = hhmmToMinutes(m[2]);
      if (end <= start || end > 24 * 60) return { error: `Check the hours "${r}"` };
      weekly.push({ day, start, end });
    }
  }
  const timezone = String(form.get("timezone") ?? "");
  try {
    new Intl.DateTimeFormat("en", { timeZone: timezone });
  } catch {
    return { error: "Unknown timezone." };
  }
  const blockedDates = String(form.get("blockedDates") ?? "").split(/[\s,]+/).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));
  const num = (k: string, min: number, max: number, def: number) => Math.min(max, Math.max(min, Number(form.get(k)) || def));
  await Settings.updateOne(
    { key: "main" },
    {
      $set: {
        timezone,
        weekly,
        blockedDates,
        slotStepMin: num("slotStepMin", 5, 240, 30),
        bufferMin: num("bufferMin", 0, 240, 15),
        minNoticeHours: num("minNoticeHours", 0, 336, 12),
        maxDaysAhead: num("maxDaysAhead", 1, 365, 45),
      },
    },
    { upsert: true },
  );
  revalidatePath("/admin/availability");
  return { ok: true, message: "Availability saved. New times show on the booking page immediately." };
}

/* ---------------- Services ---------------- */

const serviceSchema = z.object({
  id: z.union([objectId, z.literal("")]),
  name: z.string().trim().min(2).max(120),
  kind: z.enum(["consultation", "course"]),
  academy: z.enum(ACADEMIES),
  summary: z.string().trim().max(300),
  durationMin: z.coerce.number().int().min(10).max(480),
  priceGHS: z.string().regex(/^(\d+(\.\d{1,2})?)?$/, "Use a number like 150 or 150.00"),
  priceCAD: z.string().regex(/^(\d+(\.\d{1,2})?)?$/, "Use a number like 60 or 60.00"),
  startDate: z.string().optional(),
  schedule: z.string().trim().max(200),
  seats: z.coerce.number().int().min(0).max(10000),
  order: z.coerce.number().int(),
  active: z.string().optional(),
});

export async function saveService(_: FormState, form: FormData): Promise<FormState> {
  await admin();
  const parsed = serviceSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Please check the highlighted fields.", fields: fieldErrors(parsed.error.issues) };
  const d = parsed.data;
  const data = {
    name: d.name,
    kind: d.kind,
    academy: d.academy,
    summary: d.summary,
    durationMin: d.durationMin,
    priceGHS: toMinor(d.priceGHS),
    priceCAD: toMinor(d.priceCAD),
    startDate: d.startDate ? new Date(d.startDate) : undefined,
    schedule: d.schedule,
    seats: d.seats,
    order: d.order,
    active: d.active === "on",
  };
  if (d.id) await Service.updateOne({ _id: d.id }, { $set: data });
  else {
    let slug = slugify(d.name);
    if (await Service.exists({ slug })) slug = `${slug}-${Date.now().toString(36)}`;
    await Service.create({ ...data, slug });
  }
  revalidatePath("/admin/services");
  revalidatePath("/programs", "layout");
  redirect("/admin/services?saved=1");
}

/* ---------------- Blog ---------------- */

const postSchema = z.object({
  id: z.union([objectId, z.literal("")]),
  title: z.string().trim().min(3, "Add a title").max(160),
  slug: z.string().trim().max(90),
  excerpt: z.string().trim().max(300),
  content: z.string().max(100_000),
  coverImage: optionalUrl,
  coverAlt: z.string().trim().max(200),
  category: z.enum(POST_CATEGORIES),
  tags: z.string().max(300),
  status: z.enum(["draft", "published"]),
  publishedAt: z.string().optional(),
  featured: z.string().optional(),
  metaTitle: z.string().trim().max(70, "Keep under 70 characters"),
  metaDescription: z.string().trim().max(170, "Keep under 170 characters"),
  author: z.string().trim().max(80),
});

export async function savePost(_: FormState, form: FormData): Promise<FormState> {
  await admin();
  const parsed = postSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Please check the highlighted fields.", fields: fieldErrors(parsed.error.issues) };
  const d = parsed.data;
  const slug = slugify(d.slug || d.title);
  if (!slug) return { error: "Add a title.", fields: { title: "Add a title" } };
  if (await Post.exists({ slug, _id: { $ne: d.id || undefined } })) return { error: "Another post uses this URL.", fields: { slug: "Choose a different URL slug" } };

  const data = {
    title: d.title,
    slug,
    excerpt: d.excerpt || d.content.replace(/[#>*_`[\]()!-]/g, "").trim().slice(0, 200),
    content: d.content,
    coverImage: d.coverImage,
    coverAlt: d.coverAlt,
    category: d.category,
    tags: d.tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 10),
    status: d.status,
    featured: d.featured === "on",
    publishedAt: d.status === "published" ? (d.publishedAt ? new Date(d.publishedAt) : new Date()) : d.publishedAt ? new Date(d.publishedAt) : undefined,
    metaTitle: d.metaTitle,
    metaDescription: d.metaDescription,
    author: d.author || "Harriet K, RN",
  };
  if (data.featured) await Post.updateMany({ featured: true }, { $set: { featured: false } });
  const post = d.id ? await Post.findByIdAndUpdate(d.id, { $set: data }, { new: true }) : await Post.create(data);
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  if (!d.id) redirect(`/admin/blog/${post!._id}?saved=1`);
  return { ok: true, message: d.status === "published" ? "Saved and published." : "Draft saved." };
}

export async function deletePost(id: string) {
  await admin();
  if (!objectId.safeParse(id).success) return;
  const p = await Post.findByIdAndDelete(id);
  revalidatePath("/blog");
  if (p) revalidatePath(`/blog/${p.slug}`);
  redirect("/admin/blog?deleted=1");
}

/* ---------------- TikTok videos ---------------- */

export async function addVideo(_: FormState, form: FormData): Promise<FormState> {
  await admin();
  const url = String(form.get("url") ?? "").trim();
  const id = tiktokId(url);
  if (!id) return { error: "Paste the full TikTok video link, e.g. https://www.tiktok.com/@stylenurse1/video/7312345678901234567 (open the video, then Share › Copy link)." };
  if (await Video.exists({ videoId: id })) return { error: "That video is already on the site." };
  const title = String(form.get("title") ?? "").trim().slice(0, 200) || (await tiktokTitle(url));
  const coverImage = String(form.get("coverImage") ?? "").trim();
  if (coverImage && !/^https:\/\//.test(coverImage)) return { error: "Cover image must be an https:// link." };
  const last = await Video.findOne().sort({ order: -1 }).lean();
  await Video.create({ url, videoId: id, title, coverImage, featured: form.get("featured") === "on", order: (last?.order ?? 0) + 1 });
  revalidatePath("/videos");
  revalidatePath("/");
  return { ok: true, message: "Video added." };
}

export async function updateVideo(id: string, patch: { featured?: boolean; move?: "up" | "down"; title?: string }) {
  await admin();
  if (!objectId.safeParse(id).success) return;
  if (patch.move) {
    const all = await Video.find().sort({ order: 1, createdAt: -1 });
    const i = all.findIndex((v) => String(v._id) === id);
    const j = patch.move === "up" ? i - 1 : i + 1;
    if (i >= 0 && j >= 0 && j < all.length) {
      [all[i], all[j]] = [all[j], all[i]];
      await Promise.all(all.map((v, k) => Video.updateOne({ _id: v._id }, { $set: { order: k } })));
    }
  } else {
    const set: Record<string, unknown> = {};
    if (patch.featured !== undefined) set.featured = patch.featured;
    if (patch.title !== undefined) set.title = patch.title.slice(0, 200);
    await Video.updateOne({ _id: id }, { $set: set });
  }
  revalidatePath("/videos");
  revalidatePath("/");
  revalidatePath("/admin/videos");
}

export async function deleteVideo(id: string) {
  await admin();
  if (!objectId.safeParse(id).success) return;
  await Video.deleteOne({ _id: id });
  revalidatePath("/videos");
  revalidatePath("/");
  revalidatePath("/admin/videos");
}

/* ---------------- Messages ---------------- */

export async function setMessageRead(id: string, read: boolean) {
  await admin();
  if (!objectId.safeParse(id).success) return;
  await Message.updateOne({ _id: id }, { $set: { read } });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessage(id: string) {
  await admin();
  if (!objectId.safeParse(id).success) return;
  await Message.deleteOne({ _id: id });
  revalidatePath("/admin/messages");
}
