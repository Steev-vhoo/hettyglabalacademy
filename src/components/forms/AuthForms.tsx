"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, register } from "@/actions/auth";
import { initialState } from "@/actions/types";
import { programs } from "@/lib/programs";
import { Notice } from "../ui";
import { FieldError, SubmitButton } from "./SubmitButton";

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState(login, initialState);
  return (
    <form action={action} className="flex flex-col gap-5">
      {state.error && <Notice tone="error">{state.error}</Notice>}
      <input type="hidden" name="next" value={next ?? ""} />
      <div>
        <label className="label" htmlFor="l-email">Email</label>
        <input className="input" id="l-email" name="email" type="email" autoComplete="email" required />
      </div>
      <div>
        <label className="label" htmlFor="l-password">Password</label>
        <input className="input" id="l-password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <SubmitButton pendingText="Signing in…">Sign in</SubmitButton>
      <p className="text-center text-sm text-muted">
        New here? <Link href={`/register${next ? `?next=${encodeURIComponent(next)}` : ""}`}>Create a student account</Link>
      </p>
      <p className="text-center text-xs text-muted">Forgot your password? Message us on WhatsApp and we&apos;ll reset it for you.</p>
    </form>
  );
}

export function RegisterForm({ next }: { next?: string }) {
  const [state, action] = useActionState(register, initialState);
  const f = state.fields ?? {};
  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      {state.error && <Notice tone="error">{state.error}</Notice>}
      <input type="hidden" name="next" value={next ?? ""} />
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="r-name">Full name</label>
          <input className="input" id="r-name" name="name" autoComplete="name" required aria-invalid={!!f.name} aria-describedby="r-name-e" />
          <FieldError id="r-name-e" msg={f.name} />
        </div>
        <div>
          <label className="label" htmlFor="r-email">Email</label>
          <input className="input" id="r-email" name="email" type="email" autoComplete="email" required aria-invalid={!!f.email} aria-describedby="r-email-e" />
          <FieldError id="r-email-e" msg={f.email} />
        </div>
        <div>
          <label className="label" htmlFor="r-phone">WhatsApp number</label>
          <input className="input" id="r-phone" name="phone" type="tel" autoComplete="tel" placeholder="+233 …" />
        </div>
        <div>
          <label className="label" htmlFor="r-country">Country you live in</label>
          <input className="input" id="r-country" name="country" autoComplete="country-name" />
        </div>
        <div>
          <label className="label" htmlFor="r-stage">Where are you in your journey?</label>
          <select className="input" id="r-stage" name="stage" defaultValue="">
            <option value="">Choose one</option>
            <option>Nursing student</option>
            <option>Internationally educated nurse</option>
            <option>English learner</option>
            <option>Preparing to move abroad</option>
            <option>Already living abroad</option>
            <option>Other</option>
          </select>
        </div>
      </div>
      <fieldset>
        <legend className="label">I&apos;m interested in</legend>
        <div className="flex flex-wrap gap-2">
          {programs.map((p) => (
            <label key={p.slug} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line px-4 text-sm has-[:checked]:border-burgundy has-[:checked]:bg-burgundy-soft">
              <input type="checkbox" name="interests" value={p.slug} className="accent-[#4a2832]" /> {p.name}
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label className="label" htmlFor="r-password">Create a password</label>
        <input className="input" id="r-password" name="password" type="password" autoComplete="new-password" minLength={8} required aria-invalid={!!f.password} aria-describedby="r-password-e" />
        <FieldError id="r-password-e" msg={f.password ?? "At least 8 characters"} />
      </div>
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="consent" className="mt-0.5 size-[18px] accent-[#4a2832]" />
        <span>I agree to the <a href="/privacy" target="_blank">privacy policy</a>.</span>
      </label>
      <FieldError id="r-consent-e" msg={f.consent} />
      <SubmitButton pendingText="Creating your account…">Create account</SubmitButton>
      <p className="text-center text-sm text-muted">Already registered? <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`}>Sign in</Link></p>
    </form>
  );
}
