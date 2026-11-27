import type { Metadata } from "next";
import { site } from "@/lib/site";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

// Plain-language starting point. Have it reviewed for Ghana's Data Protection Act, 2012 (Act 843) and Canada's PIPEDA before launch.
export default function PrivacyPage() {
  return (
    <>
      <PageHero crumb="Privacy" title="Privacy policy" intro="Draft — to be reviewed before launch." />
      <section className="py-14">
        <div className="container-x prose-hga max-w-3xl">
          <h2>What we collect</h2>
          <p>When you register, book or contact us we collect your name, email, phone/WhatsApp number, country, and anything you tell us about your goals. Bookings also store the date, time and payment status.</p>
          <h2>Payments</h2>
          <p>Payments are processed by Paystack and Stripe on their own secure pages. We never see or store your card or Mobile Money details — we only receive confirmation that a payment succeeded.</p>
          <h2>How we use it</h2>
          <ul>
            <li>To arrange and run your sessions and courses</li>
            <li>To send booking confirmations and reminders by email or WhatsApp</li>
            <li>To send our newsletter, only if you subscribe (you can unsubscribe at any time)</li>
          </ul>
          <h2>Videos</h2>
          <p>TikTok videos on this site load from TikTok only when you press play. TikTok&apos;s own privacy policy then applies to that video.</p>
          <h2>Your choices</h2>
          <p>You can ask us to see, correct or delete your information at any time by emailing <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
        </div>
      </section>
    </>
  );
}
