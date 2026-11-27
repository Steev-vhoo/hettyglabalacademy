import type { Metadata } from "next";
import { LoginForm } from "@/components/forms/AuthForms";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <section className="bg-ivory py-16 sm:py-24">
      <div className="container-x max-w-md">
        <div className="rounded-3xl bg-white p-8 shadow-sm sm:p-10">
          <h1 className="mb-2 text-3xl">Welcome back</h1>
          <p className="mb-8 text-muted">Sign in to see your bookings and courses.</p>
          <LoginForm next={next} />
        </div>
      </div>
    </section>
  );
}
