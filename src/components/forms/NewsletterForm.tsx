"use client";

import { useActionState } from "react";
import { subscribe } from "@/actions/public";
import { initialState } from "@/actions/types";
import { SubmitButton } from "./SubmitButton";

export function NewsletterForm() {
  const [state, action] = useActionState(subscribe, initialState);
  if (state.ok) return <p role="status" className="font-semibold text-gold">{state.message}</p>;
  return (
    <form action={action} className="flex flex-col gap-2">
      <label htmlFor="nl-email" className="sr-only">Email address</label>
      <div className="flex gap-2 rounded-full bg-white p-1.5">
        <input id="nl-email" name="email" type="email" required autoComplete="email" placeholder="Your email address" className="min-h-11 min-w-0 flex-1 rounded-full border-0 bg-transparent px-4 text-charcoal outline-none" />
        <SubmitButton className="btn-gold" pendingText="…">Subscribe</SubmitButton>
      </div>
      {state.error && <p role="alert" className="text-sm text-[#f3b7b7]">{state.error}</p>}
    </form>
  );
}
