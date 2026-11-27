import type { Metadata } from "next";
import { site } from "@/lib/site";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = { title: "Booking Terms", alternates: { canonical: "/terms" } };

// Draft terms: confirm the refund and rescheduling rules with Harriet before launch.
export default function TermsPage() {
  return (
    <>
      <PageHero crumb="Terms" title="Booking terms" intro="Draft — to be confirmed before launch." />
      <section className="py-14">
        <div className="container-x prose-hga max-w-3xl">
          <h2>Sessions</h2>
          <p>Sessions take place online. Your meeting link is sent by email after your booking is confirmed. Please join on time — late arrivals may not be able to extend the session.</p>
          <h2>Rescheduling &amp; cancellations</h2>
          <p>You can reschedule or cancel up to 24 hours before your session by replying to your confirmation email or messaging us on WhatsApp. Paid sessions cancelled with at least 24 hours&apos; notice can be moved to another time or refunded.</p>
          <h2>Courses</h2>
          <p>Course places are confirmed once payment is received. Places are limited and allocated in order of payment.</p>
          <h2>Results</h2>
          <p>We prepare you as thoroughly as we can, but exam results depend on many factors and cannot be guaranteed.</p>
          <h2>Contact</h2>
          <p>Questions? Email <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
        </div>
      </section>
    </>
  );
}
