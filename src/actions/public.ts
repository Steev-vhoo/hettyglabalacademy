"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { Message, Subscriber } from "@/lib/models";
import { adminEmail, sendMail } from "@/lib/mail";
import { rateLimited } from "@/lib/ratelimit";
import { fieldErrors, type FormState } from "./types";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  phone: z.string().trim().max(30).optional(),
  topic: z.string().trim().max(60).optional(),
  message: z.string().trim().min(10, "Please write a little more").max(4000),
  website: z.string().max(0).optional(), // honeypot: real people leave it empty
});

export async function sendContact(_: FormState, form: FormData): Promise<FormState> {
  if (await rateLimited("contact", 5, 60 * 60_000)) return { error: "Too many messages. Please try WhatsApp instead." };
  const parsed = contactSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Please check the highlighted fields.", fields: fieldErrors(parsed.error.issues) };
  const { website: _hp, ...data } = parsed.data;
  await db();
  await Message.create(data);
  await sendMail(adminEmail(), `[HGA] New message: ${data.topic || "General"} — ${data.name}`, [
    `${data.name} <${data.email}> ${data.phone ?? ""}`,
    data.message,
  ]);
  return { ok: true, message: "Thank you — your message has been sent. We'll reply by email or WhatsApp." };
}

export async function subscribe(_: FormState, form: FormData): Promise<FormState> {
  if (await rateLimited("subscribe", 5, 60 * 60_000)) return { error: "Please try again later." };
  const email = z.string().trim().toLowerCase().email().safeParse(form.get("email"));
  if (!email.success) return { error: "Enter a valid email address." };
  await db();
  await Subscriber.updateOne({ email: email.data }, { $setOnInsert: { email: email.data } }, { upsert: true });
  return { ok: true, message: "You're subscribed. Thank you!" };
}
