"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { Booking, User, type UserDoc } from "@/lib/models";
import { endSession, startSession } from "@/lib/auth";
import { rateLimited } from "@/lib/ratelimit";
import { sendMail } from "@/lib/mail";
import { site } from "@/lib/site";
import { fieldErrors, type FormState } from "./types";

const safeNext = (n: FormDataEntryValue | null) => {
  const s = String(n ?? "");
  return s.startsWith("/") && !s.startsWith("//") ? s : "";
};

const registerSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  phone: z.string().trim().max(30).optional(),
  country: z.string().trim().max(60).optional(),
  stage: z.string().trim().max(60).optional(),
  interests: z.array(z.string().max(30)).max(5),
  password: z.string().min(8, "Use at least 8 characters").max(200),
  consent: z.literal("on", { message: "Please accept the privacy policy" }),
});

export async function register(_: FormState, form: FormData): Promise<FormState> {
  if (await rateLimited("register", 8, 60 * 60_000)) return { error: "Too many attempts. Please try again later." };
  const parsed = registerSchema.safeParse({ ...Object.fromEntries(form), interests: form.getAll("interests") });
  if (!parsed.success) return { error: "Please check the highlighted fields.", fields: fieldErrors(parsed.error.issues) };
  const { password, consent: _consent, ...data } = parsed.data;

  await db();
  if (await User.exists({ email: data.email })) {
    return { error: "An account with this email already exists.", fields: { email: "Already registered — sign in instead" } };
  }
  const user = await User.create({ ...data, passwordHash: await bcrypt.hash(password, 12), role: "student" });
  // Link any bookings made earlier as a guest with the same email.
  await Booking.updateMany({ email: data.email, user: { $exists: false } }, { $set: { user: user._id } });
  await startSession({ sub: String(user._id), role: "student", name: user.name, email: user.email });
  await sendMail(user.email, `Welcome to ${site.name}`, [
    `Hello ${user.name},`,
    "Your student account is ready. You can book sessions, enrol in courses and see your bookings at any time.",
    `${site.url}/account`,
    site.motto,
  ]);
  redirect(safeNext(form.get("next")) || "/account?welcome=1");
}

export async function login(_: FormState, form: FormData): Promise<FormState> {
  if (await rateLimited("login", 10, 15 * 60_000)) return { error: "Too many sign-in attempts. Please wait 15 minutes." };
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  await db();
  const user = await User.findOne({ email }).select("+passwordHash").lean<UserDoc>();
  // Compare against a dummy hash when the user doesn't exist, so timing doesn't reveal which emails are registered.
  const ok = await bcrypt.compare(password, user?.passwordHash ?? "$2b$12$Zz8204AtOzoCRpxxgBKmfu5CSDLcKSBkqrwtPmOKem6t4iitDo3lW");
  if (!user || !ok) return { error: "Email or password is incorrect." };

  await startSession({ sub: String(user._id), role: user.role === "admin" ? "admin" : "student", name: user.name, email: user.email });
  redirect(safeNext(form.get("next")) || (user.role === "admin" ? "/admin" : "/account"));
}

export async function logout() {
  await endSession();
  redirect("/");
}
