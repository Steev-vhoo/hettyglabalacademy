# Hetty Global Academy — website

*Empowering Minds. Elevating Careers. Transforming Futures.*

A Next.js 15 + MongoDB website for Hetty Global Academy: NCLEX and CELPIP education pages, student registration, course and consultation booking with online payment, a blog with SEO, popular TikTok videos, and an admin dashboard for Harriet.

## What's included

| Area | Where |
| --- | --- |
| Home, About (story, mission, vision), three departments — Nursing Education (NCLEX-RN), English Language Academy (beginners + CELPIP), Global Mentorship & Career Development — Resources, Videos, Blog, Contact & FAQ | `src/app/(site)` |
| Student registration, sign in, "My account" (bookings, cancel, meeting links) | `/register`, `/login`, `/account` |
| Booking: individual or group sessions on Zoom or WhatsApp, live availability (default 8–9am Ghana time) shown in the visitor's timezone, or course enrolment with seat limits | `/book`, `src/lib/booking.ts`, `src/lib/slots.ts` |
| Payments: **Paystack** (GHS — Mobile Money + cards) and **Stripe** (CAD — international cards). Card pages are hosted by the provider. | `src/lib/payments.ts`, `src/app/api/payments` |
| Popular TikTok videos (click-to-play, nothing loads from TikTok until pressed) | `/videos`, homepage section |
| Blog with Markdown editor, live preview, scheduling, featured post, cover images, TikTok embeds (`::tiktok <link>`) | `/blog`, `/admin/blog` |
| SEO: per-page titles/descriptions, canonical URLs, Open Graph image, `sitemap.xml`, `robots.txt`, structured data (Organization, Course, FAQ, BlogPosting) | `src/app/sitemap.ts`, `robots.ts`, `JsonLd` |
| Admin dashboard: overview, bookings (confirm/cancel/meeting link/notes/CSV export), weekly availability and days off, services & prices, blog, TikTok videos, messages, students | `/admin` |
| Chat widget (WhatsApp topics + leave-a-message), one-on-one booking pop-up, contact form, newsletter, confirmation emails | throughout |
| Resources: study materials, downloadable guides (linked from Google Drive/Dropbox), articles, videos, FAQ | `/resources`, `/admin/resources` |

## Run it locally

```bash
npm install
cp .env.example .env.local   # then fill in the values (see docs/DEPLOYMENT.md)
npm run seed                 # starter services + default availability (example prices!)
npm run create-admin         # creates Harriet's admin login from ADMIN_EMAIL / ADMIN_PASSWORD
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build`, `npm run lint`, `npm run typecheck`, `npm test` (time-slot engine, payment-signature checks, TikTok link parsing).

## Before launch

See **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** for domain, hosting, database, payments, email and the launch checklist.

Content still needed from the client is marked `TODO(client)` in the code, and listed in the deployment guide.
