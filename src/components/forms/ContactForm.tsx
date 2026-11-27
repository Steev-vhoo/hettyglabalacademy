"use client";

import { useActionState } from "react";
import { sendContact } from "@/actions/public";
import { initialState } from "@/actions/types";
import { Notice } from "../ui";
import { FieldError, SubmitButton } from "./SubmitButton";

export function ContactForm() {
  const [state, action] = useActionState(sendContact, initialState);
  const f = state.fields ?? {};
  if (state.ok) return <Notice tone="success">{state.message}</Notice>;
  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      {state.error && <Notice tone="error">{state.error}</Notice>}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="c-name">Full name</label>
          <input className="input" id="c-name" name="name" autoComplete="name" required aria-invalid={!!f.name} aria-describedby="c-name-e" />
          <FieldError id="c-name-e" msg={f.name} />
        </div>
        <div>
          <label className="label" htmlFor="c-email">Email</label>
          <input className="input" id="c-email" name="email" type="email" autoComplete="email" required aria-invalid={!!f.email} aria-describedby="c-email-e" />
          <FieldError id="c-email-e" msg={f.email} />
        </div>
        <div>
          <label className="label" htmlFor="c-phone">WhatsApp / phone (optional)</label>
          <input className="input" id="c-phone" name="phone" type="tel" autoComplete="tel" />
        </div>
        <div>
          <label className="label" htmlFor="c-topic">Topic</label>
          <select className="input" id="c-topic" name="topic">
            <option>Course information</option>
            <option>Registration help</option>
            <option>Booking support</option>
            <option>Nursing Education / NCLEX-RN</option>
            <option>English Language Academy / CELPIP</option>
            <option>Global mentorship &amp; careers</option>
            <option>General enquiry</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label" htmlFor="c-message">Message</label>
        <textarea className="input min-h-36" id="c-message" name="message" required aria-invalid={!!f.message} aria-describedby="c-message-e" />
        <FieldError id="c-message-e" msg={f.message} />
      </div>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="c-website">Leave this empty</label>
        <input id="c-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div><SubmitButton pendingText="Sending…">Send message</SubmitButton></div>
    </form>
  );
}
