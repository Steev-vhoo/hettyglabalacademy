import "server-only";
import nodemailer from "nodemailer";
import { site } from "./site";

let transport: nodemailer.Transporter | null = null;

function getTransport() {
  if (!process.env.SMTP_HOST) return null;
  transport ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  return transport;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Sends an email, or logs it when SMTP isn't configured. Never throws — email must not break a booking. */
export async function sendMail(to: string, subject: string, lines: string[]) {
  const text = lines.join("\n");
  const html = `<div style="font-family:Georgia,serif;color:#2A2A2A;max-width:560px">
<h2 style="color:#4A2832;margin:0 0 4px">${esc(site.name)}</h2>
<p style="color:#8A6A32;margin:0 0 20px;font-size:13px">${esc(site.tagline)}</p>
${lines.map((l) => `<p style="margin:0 0 10px;line-height:1.5">${esc(l)}</p>`).join("")}
</div>`;
  const t = getTransport();
  if (!t) {
    console.info(`[mail:not-configured] to=${to} subject=${subject}\n${text}`);
    return;
  }
  try {
    await t.sendMail({ from: process.env.MAIL_FROM || site.email, to, subject, text, html });
  } catch (e) {
    console.error("[mail] failed", e);
  }
}

export const adminEmail = () => process.env.ADMIN_NOTIFY_EMAIL || site.email;
