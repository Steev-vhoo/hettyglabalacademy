import type { Metadata } from "next";
import { RegisterForm } from "@/components/forms/AuthForms";
import { Check } from "@/components/icons";

export const metadata: Metadata = {
  title: "Student Registration",
  description: "Create a free Hetty Global Academy student account to book sessions, enrol in courses and track your bookings.",
  alternates: { canonical: "/register" },
};

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <section className="bg-ivory py-16 sm:py-24">
      <div className="container-x grid max-w-5xl items-start gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col gap-5 lg:pt-8">
          <span className="eyebrow">Student registration</span>
          <h1 className="text-4xl leading-tight">Join Hetty Global Academy</h1>
          <p className="text-lg text-muted">A free account lets you:</p>
          <ul className="flex flex-col gap-3">
            {["Book sessions and enrol in courses faster", "See all your bookings and meeting links in one place", "Get new guides and course dates first"].map((t) => (
              <li key={t} className="flex gap-3"><Check className="mt-0.5 size-5 shrink-0 text-gold-dark" />{t}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-sm sm:p-10">
          <RegisterForm next={next} />
        </div>
      </div>
    </section>
  );
}
