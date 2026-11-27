# Going live: domain, hosting, payments

Everything below should be registered **in Hetty Global Academy's / Harriet's own name and email**, so she owns it outright. Mos EdTech can be added as a collaborator.

## 1. Domain ownership

1. Choose a name, e.g. `hettyglobalacademy.com` (check availability first).
2. Register it at a registrar such as Cloudflare Registrar, Namecheap or Porkbun (about USD 10–15/year for a `.com`). Turn on **auto-renew** and **WHOIS privacy**, and enable 2-step login on the registrar account.
3. Keep the registrar login with Harriet. Point DNS to the host in step 3 (the host shows the exact records to add).

## 2. Database — MongoDB Atlas

1. Create a free account at mongodb.com/atlas and an **M0 (free)** cluster. A region near the host (e.g. AWS `us-east-1`) keeps the site fast.
2. *Database Access* → add a user with a long random password.
3. *Network Access* → allow the host (for Vercel, `0.0.0.0/0` is normal; the password protects it).
4. *Connect → Drivers* → copy the connection string into `MONGODB_URI` (add a database name, e.g. `/hetty`).
5. Atlas M0 has no automatic backups — upgrade to M10 when bookings become regular, or export data monthly.

## 3. Hosting

**Recommended: Vercel** (made by the Next.js team; HTTPS and global CDN included).

- Note: Vercel's free *Hobby* plan is for non-commercial use only. Since the academy takes payments, use **Vercel Pro** (about USD 20/month), or a host such as **Render** or **Railway** (Node web service, roughly USD 5–7/month), which also run this app with no code changes (`npm run build` then `npm start`).

Steps on Vercel:
1. Push this project to a GitHub repository owned by the academy.
2. vercel.com → *Add New Project* → import the repo.
3. Add every variable from `.env.example` under *Settings → Environment Variables*. Set `NEXT_PUBLIC_SITE_URL` to `https://yourdomain.com`.
4. Deploy, then *Settings → Domains* → add the domain and follow the DNS instructions.
5. Run `npm run seed` and `npm run create-admin` once from a computer with `.env.local` pointing at the production database.

## 4. Payments

### Paystack (Ghana: MTN MoMo, Telecel Cash, AirtelTigo, cards in GHS)
1. Sign up at paystack.com as a Ghana business and complete verification (business documents and a settlement bank or mobile-money account).
2. *Settings → API Keys & Webhooks*: copy the **secret key** into `PAYSTACK_SECRET_KEY`.
3. Set the **Webhook URL** to `https://yourdomain.com/api/payments/paystack/webhook`.
4. Test with the test secret key first, then switch to the live key.

### Stripe (international cards, Apple Pay and Google Pay, in CAD)
1. Sign up at stripe.com. Stripe needs a business registered in a supported country such as Canada. If Harriet operates from Canada this is straightforward; if not, use Paystack only and leave the Stripe keys empty — the site hides that option automatically.
2. *Developers → API keys*: copy the **secret key** into `STRIPE_SECRET_KEY`.
3. *Developers → Webhooks → Add endpoint*: `https://yourdomain.com/api/payments/stripe/webhook`, events `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.expired`. Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

How it works: a paid booking holds the time slot for 30 minutes while the client pays on the provider's page. The webhook (or the return page) confirms it, checks the amount and currency, and emails both the client and Harriet. Abandoned checkouts release the slot automatically.

Prices are set per service in *Admin → Services* (GHS and/or CAD). **The seeded prices are only examples.**

## 5. Email

Confirmation and notification emails use SMTP. Any provider works: Google Workspace, Zoho Mail, or a sending service such as Resend, Postmark or Brevo (best for reliable delivery; set up SPF/DKIM on the domain as they instruct). Fill in `SMTP_*`, `MAIL_FROM` and `ADMIN_NOTIFY_EMAIL`. Without SMTP the site still works, and emails are written to the server log instead.

## 6. Launch checklist

- [ ] Domain registered in the academy's name, DNS pointing at the host, HTTPS working
- [ ] `AUTH_SECRET` set to a fresh random value (`openssl rand -base64 48`)
- [ ] Admin account created; `ADMIN_PASSWORD` removed from env files afterwards
- [ ] Real services and prices in *Admin → Services*; example services deleted or hidden
- [ ] Availability and timezone set in *Admin → Availability*
- [ ] Paystack and/or Stripe **live** keys and webhooks set; one real low-value test payment made and refunded
- [ ] `NEXT_PUBLIC_WHATSAPP_NUMBER` set (WhatsApp button falls back to the contact page until then)
- [ ] Popular TikTok videos added in *Admin → TikTok videos*
- [ ] Privacy policy and booking terms reviewed (pages are marked *Draft*)
- [ ] Site submitted in Google Search Console with `https://yourdomain.com/sitemap.xml`

## 7. Content still needed from Harriet (`TODO(client)`)

- Logo as a transparent PNG or SVG (the current file has a cream background)
- Photos: Harriet, classes, students — save them in `public/images/` and set each `src` in `src/lib/media.ts` (until then the site shows designed brand panels in those spots)
- Her story for the About page; testimonials with permission (`src/lib/content.ts` — the section stays hidden until added)
- Final prices, course dates and seat numbers
- WhatsApp number, Instagram/Facebook links
- Confirmation of the refund and rescheduling policy

The exam facts on the NCLEX and CELPIP pages (`src/lib/programs.ts`) follow the official NCSBN and CELPIP descriptions. Re-check them against the official sites linked on each page before launch.
