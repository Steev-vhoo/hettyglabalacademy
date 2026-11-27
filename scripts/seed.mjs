// Adds starter services and default availability. Safe to run more than once (existing items are left alone).
// PRICES ARE EXAMPLES — set the real ones in Admin › Services before launch.
import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  console.error("Set MONGODB_URI in .env.local first.");
  process.exit(1);
}
await mongoose.connect(process.env.MONGODB_URI);
const services = mongoose.connection.collection("services");
const settings = mongoose.connection.collection("settings");
const now = new Date();

const starter = [
  { name: "Free discovery call", slug: "discovery-call", kind: "consultation", academy: "general", summary: "15 minutes to find the right department and plan for you.", durationMin: 15, priceGHS: 0, priceCAD: 0, order: 0 },
  // Nursing Education
  { name: "NCLEX-RN tutoring", slug: "nclex-tutoring", kind: "consultation", academy: "nursing", summary: "NCLEX-RN preparation and nursing exam coaching.", durationMin: 60, priceGHS: 60000, priceCAD: 6000, order: 10 },
  { name: "Nursing mentorship & IEN guidance", slug: "nursing-mentorship", kind: "consultation", academy: "nursing", summary: "Clinical knowledge, registration steps and guidance for internationally educated nurses.", durationMin: 45, priceGHS: 50000, priceCAD: 5000, order: 15 },
  // English Language Academy
  { name: "English for beginners lesson", slug: "english-lesson", kind: "consultation", academy: "english", summary: "Speaking, writing, reading and listening at your level.", durationMin: 60, priceGHS: 40000, priceCAD: 4000, order: 20 },
  { name: "CELPIP coaching", slug: "celpip-coaching", kind: "consultation", academy: "celpip", summary: "CELPIP strategies and timed practice with feedback.", durationMin: 60, priceGHS: 50000, priceCAD: 5000, order: 25 },
  // Global Mentorship & Career Development
  { name: "International career mentorship", slug: "mentorship-session", kind: "consultation", academy: "mentorship", summary: "Pathway guidance, professional development and career readiness.", durationMin: 45, priceGHS: 50000, priceCAD: 5000, order: 30 },
  { name: "Interview preparation", slug: "interview-prep", kind: "consultation", academy: "mentorship", summary: "Mock interview with feedback and a follow-up plan.", durationMin: 45, priceGHS: 50000, priceCAD: 5000, order: 35 },
  // Example course (hidden until you set dates)
  { name: "NCLEX-RN group course", slug: "nclex-group-course", kind: "course", academy: "nursing", summary: "Structured group course with weekly live classes.", durationMin: 60, priceGHS: 300000, priceCAD: 30000, schedule: "8 weeks · weekly live class, 8:00 am GMT", seats: 20, order: 50, active: false, formats: ["group"] },
];

let added = 0;
for (const s of starter) {
  const r = await services.updateOne(
    { slug: s.slug },
    { $setOnInsert: { active: true, schedule: "", seats: 0, formats: ["individual", "group"], ...s, createdAt: now, updatedAt: now } },
    { upsert: true },
  );
  added += r.upsertedCount;
}
await services.createIndex({ slug: 1 }, { unique: true });

await settings.updateOne(
  { key: "main" },
  {
    $setOnInsert: {
      key: "main",
      // 8:00–9:00 am Ghana time (GMT), Monday–Saturday = 12:00–1:00 am in Vancouver (1:00–2:00 am in summer)
      timezone: "Africa/Accra",
      weekly: [1, 2, 3, 4, 5, 6].map((day) => ({ day, start: 480, end: 540 })),
      blockedDates: [],
      slotStepMin: 30,
      bufferMin: 15,
      minNoticeHours: 12,
      maxDaysAhead: 45,
    },
  },
  { upsert: true },
);

// Popular TikTok videos from @stylenurse1 (share links are resolved to full video URLs).
const starterVideos = ["https://vt.tiktok.com/ZSs2ASuhm/", "https://vt.tiktok.com/ZSs2SoUsE/", "https://vt.tiktok.com/ZSs2SouUg/"];
const videos = mongoose.connection.collection("videos");
let order = (await videos.countDocuments()) + 1;
for (const share of starterVideos) {
  let url = share;
  try {
    for (let i = 0; i < 5 && !/\/video\/\d+/.test(url); i++) {
      const res = await fetch(url, { redirect: "manual", headers: { "User-Agent": "Mozilla/5.0 (compatible; HGA-seed)" } });
      const loc = res.headers.get("location");
      if (!loc) break;
      url = new URL(loc, url).toString();
    }
  } catch (e) {
    console.warn(`Could not reach TikTok for ${share}: ${e.message}`);
  }
  const id = url.match(/\/video\/(\d{8,25})/)?.[1];
  if (!id) {
    console.warn(`Skipped ${share} — add it in Admin › TikTok videos instead.`);
    continue;
  }
  let title = "";
  try {
    const o = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`);
    if (o.ok) title = ((await o.json()).title ?? "").slice(0, 200);
  } catch {}
  const r = await videos.updateOne(
    { videoId: id },
    { $setOnInsert: { url: url.split("?")[0], videoId: id, title, coverImage: "", featured: true, order: order++, createdAt: now, updatedAt: now } },
    { upsert: true },
  );
  if (r.upsertedCount) console.log(`Added TikTok video ${id}`);
}

// Indexes the app relies on (Mongoose also builds these on first use).
const bookings = mongoose.connection.collection("bookings");
await bookings.createIndex({ slotKey: 1 }, { unique: true, partialFilterExpression: { slotKey: { $type: "string" } } });
await mongoose.connection.collection("posts").createIndex({ slug: 1 }, { unique: true });
await mongoose.connection.collection("videos").createIndex({ videoId: 1 }, { unique: true });

console.log(`Seed complete: ${added} new service(s). Review prices in Admin › Services — the seeded prices are only examples.`);
await mongoose.disconnect();
