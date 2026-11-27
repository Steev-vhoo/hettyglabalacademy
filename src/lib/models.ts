import mongoose, { Schema, type Model, type Types } from "mongoose";

// Explicit interfaces (rather than InferSchemaType) keep the TypeScript compiler fast and the shapes easy to read.
function model<T>(name: string, schema: Schema): Model<T> {
  return (mongoose.models[name] as Model<T>) ?? mongoose.model<T>(name, schema as Schema<T>);
}
import { ACADEMIES, BOOKING_STATUSES, type Academy, type BookingStatus } from "./constants";
export { ACADEMIES, BOOKING_STATUSES, POST_CATEGORIES, type Academy, type BookingStatus } from "./constants";

type Base = { _id: Types.ObjectId; createdAt: Date; updatedAt: Date };

/* ---------- Users (students + admins) ---------- */
const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    country: { type: String, trim: true },
    stage: { type: String, trim: true },
    interests: [{ type: String }],
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["student", "admin"], default: "student", index: true },
  },
  { timestamps: true },
);
export interface UserDoc extends Base {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  stage?: string;
  interests: string[];
  passwordHash: string;
  role: "student" | "admin";
}
export const User = model<UserDoc>("User", userSchema);

/* ---------- Services: bookable consultations + courses ---------- */

const serviceSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    kind: { type: String, enum: ["consultation", "course"], required: true },
    academy: { type: String, enum: ACADEMIES, default: "general" },
    summary: { type: String, default: "" },
    durationMin: { type: Number, default: 60 }, // consultations
    // Prices in minor units (pesewas / cents). null = not offered in that currency; 0 = free.
    priceGHS: { type: Number, default: null },
    priceCAD: { type: Number, default: null },
    // Courses
    startDate: { type: Date },
    schedule: { type: String, default: "" },
    seats: { type: Number, default: 0 }, // 0 = unlimited
    active: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export interface ServiceDoc extends Base {
  name: string;
  slug: string;
  kind: "consultation" | "course";
  academy: Academy;
  summary?: string;
  durationMin?: number;
  priceGHS?: number | null;
  priceCAD?: number | null;
  startDate?: Date;
  schedule?: string;
  seats?: number;
  active: boolean;
  order: number;
}
export const Service = model<ServiceDoc>("Service", serviceSchema);

/* ---------- Availability / booking settings (single document) ---------- */
const settingsSchema = new Schema({
  key: { type: String, default: "main", unique: true },
  timezone: { type: String, default: "America/Toronto" },
  // Weekly opening hours in the admin's timezone, minutes from midnight. Several ranges per day allowed.
  weekly: [{ day: Number, start: Number, end: Number, _id: false }],
  blockedDates: [{ type: String }], // YYYY-MM-DD in admin timezone
  slotStepMin: { type: Number, default: 30 },
  bufferMin: { type: Number, default: 15 },
  minNoticeHours: { type: Number, default: 12 },
  maxDaysAhead: { type: Number, default: 45 },
});
export interface SettingsDoc {
  key: string;
  timezone?: string;
  weekly?: { day: number; start: number; end: number }[];
  blockedDates?: string[];
  slotStepMin?: number;
  bufferMin?: number;
  minNoticeHours?: number;
  maxDaysAhead?: number;
}
export const Settings = model<SettingsDoc>("Settings", settingsSchema);

/* ---------- Bookings ---------- */

const bookingSchema = new Schema(
  {
    service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    serviceName: { type: String, required: true },
    kind: { type: String, enum: ["consultation", "course"], required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, index: true },
    phone: String,
    country: String,
    stage: String,
    notes: String,
    timezone: String, // client's timezone, for display in emails
    startsAt: { type: Date, index: true },
    endsAt: Date,
    // Set only while the booking holds a time slot; unique so two people can never hold the same slot.
    slotKey: { type: String },
    holdExpiresAt: Date,
    status: { type: String, enum: BOOKING_STATUSES, default: "pending", index: true },
    payment: {
      provider: { type: String, enum: ["none", "paystack", "stripe"], default: "none" },
      amount: { type: Number, default: 0 },
      currency: { type: String, default: "" },
      reference: { type: String, index: true },
      status: { type: String, enum: ["free", "unpaid", "paid", "refunded"], default: "free" },
      paidAt: Date,
    },
    meetingLink: String,
    adminNotes: String,
  },
  { timestamps: true },
);
bookingSchema.index({ slotKey: 1 }, { unique: true, partialFilterExpression: { slotKey: { $type: "string" } } });
export interface BookingDoc extends Base {
  service: Types.ObjectId;
  serviceName: string;
  kind: "consultation" | "course";
  user?: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  stage?: string;
  notes?: string;
  timezone?: string;
  startsAt?: Date;
  endsAt?: Date;
  slotKey?: string;
  holdExpiresAt?: Date;
  status: BookingStatus;
  payment: {
    provider: "none" | "paystack" | "stripe";
    amount: number;
    currency: string;
    reference?: string;
    status: "free" | "unpaid" | "paid" | "refunded";
    paidAt?: Date;
  };
  meetingLink?: string;
  adminNotes?: string;
}
export const Booking = model<BookingDoc>("Booking", bookingSchema);

/* ---------- Blog ---------- */

const postSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" }, // Markdown
    coverImage: { type: String, default: "" },
    coverAlt: { type: String, default: "" },
    category: { type: String, default: "Academy News" },
    tags: [{ type: String }],
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    featured: { type: Boolean, default: false },
    publishedAt: { type: Date, index: true },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    author: { type: String, default: "Harriet K, RN" },
  },
  { timestamps: true },
);
export interface PostDoc extends Base {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverAlt: string;
  category: string;
  tags: string[];
  status: "draft" | "published";
  featured: boolean;
  publishedAt?: Date;
  metaTitle: string;
  metaDescription: string;
  author: string;
}
export const Post = model<PostDoc>("Post", postSchema);

/* ---------- TikTok videos ---------- */
const videoSchema = new Schema(
  {
    url: { type: String, required: true },
    videoId: { type: String, required: true, unique: true },
    title: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    featured: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export interface VideoDoc extends Base {
  url: string;
  videoId: string;
  title: string;
  coverImage: string;
  featured: boolean;
  order: number;
}
export const Video = model<VideoDoc>("Video", videoSchema);

/* ---------- Contact messages + newsletter ---------- */
const messageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    topic: String,
    message: { type: String, required: true },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);
export interface MessageDoc extends Base {
  name: string;
  email: string;
  phone?: string;
  topic?: string;
  message: string;
  read: boolean;
}
export const Message = model<MessageDoc>("Message", messageSchema);

const subscriberSchema = new Schema({ email: { type: String, required: true, unique: true, lowercase: true } }, { timestamps: true });
export const Subscriber = model<Base & { email: string }>("Subscriber", subscriberSchema);
