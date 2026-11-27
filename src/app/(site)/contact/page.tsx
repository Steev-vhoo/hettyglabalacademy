import type { Metadata } from "next";
import { generalFaqs } from "@/lib/content";
import { site, tiktokProfileUrl, whatsappLink } from "@/lib/site";
import { JsonLd, PageHero, SectionHeading } from "@/components/ui";
import { Chat } from "@/components/icons";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact & FAQ",
  description: "Questions about NCLEX or CELPIP preparation, booking or payments? Message Hetty Global Academy on WhatsApp or send us a note.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: generalFaqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
      <PageHero crumb="Contact" title="Get in touch" intro="Questions about a program or booking? WhatsApp is the fastest way to reach us." />

      <section className="py-16">
        <div className="container-x grid gap-10 lg:grid-cols-[360px_1fr]">
          <div className="flex flex-col gap-4">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-2xl bg-[#25D366] p-5 text-[#0b2914] no-underline">
              <span className="grid size-12 place-items-center rounded-full bg-white text-[#128c4a]"><Chat /></span>
              <span><strong className="block text-lg">Chat on WhatsApp</strong><span className="text-sm">Usually the quickest reply</span></span>
            </a>
            <div className="card"><h2 className="font-sans text-sm font-semibold text-charcoal">Email</h2><a href={`mailto:${site.email}`} className="break-all">{site.email}</a></div>
            <div className="card"><h2 className="font-sans text-sm font-semibold text-charcoal">Where we teach</h2><p className="text-muted">Online — serving learners in Ghana, Canada and worldwide.</p></div>
            <div className="card">
              <h2 className="mb-2 font-sans text-sm font-semibold text-charcoal">Follow us</h2>
              <div className="flex flex-wrap gap-2">
                <a className="btn-outline btn-sm border-line" href={tiktokProfileUrl} target="_blank" rel="noopener noreferrer">TikTok</a>
                {site.social.instagram && <a className="btn-outline btn-sm border-line" href={site.social.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
                {site.social.facebook && <a className="btn-outline btn-sm border-line" href={site.social.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>}
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-line p-6 sm:p-10">
            <h2 className="mb-6 text-2xl">Send a message</h2>
            <ContactForm />
          </div>
        </div>
      </section>

      <section id="faq" className="bg-ivory py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading eyebrow="FAQ" title="Frequently asked questions">
            <p className="text-muted">Can&apos;t find your answer? <a href={whatsappLink()}>Message us on WhatsApp</a>.</p>
          </SectionHeading>
          <div className="rounded-3xl bg-white px-6 sm:px-8">
            {generalFaqs.map((f, i) => (
              <details key={f.q} className={`group py-5 ${i < generalFaqs.length - 1 ? "border-b border-line" : ""}`} open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
                  {f.q}<span aria-hidden="true" className="text-2xl text-gold-dark transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="pt-3 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
