"use client";

import { useActionState, useEffect, useRef } from "react";
import { addResource } from "@/actions/admin";
import { initialState } from "@/actions/types";
import { RESOURCE_CATEGORIES } from "@/lib/constants";
import { Notice } from "@/components/ui";
import { FieldError, SubmitButton } from "@/components/forms/SubmitButton";

export function AddResourceForm() {
  const [state, action] = useActionState(addResource, initialState);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => { if (state.ok) form.current?.reset(); }, [state]);
  const f = state.fields ?? {};
  return (
    <form ref={form} action={action} className="flex flex-col gap-4 self-start rounded-2xl border border-line bg-white p-6">
      <h2 className="text-xl">Add a resource</h2>
      {state.error && <Notice tone="error">{state.error}</Notice>}
      {state.ok && <Notice tone="success">{state.message}</Notice>}
      <div><label className="label" htmlFor="r-title">Title</label><input className="input" id="r-title" name="title" required placeholder="e.g. NCLEX-RN pharmacology cheat sheet" /><FieldError id="r-title-e" msg={f.title} /></div>
      <div>
        <label className="label" htmlFor="r-cat">Section</label>
        <select className="input" id="r-cat" name="category">{RESOURCE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
      </div>
      <div><label className="label" htmlFor="r-url">Link</label><input className="input" id="r-url" name="url" type="url" required placeholder="https://drive.google.com/…" /><FieldError id="r-url-e" msg={f.url} /></div>
      <div>
        <label className="label" htmlFor="r-kind">Type</label>
        <select className="input" id="r-kind" name="kind"><option value="download">Download (PDF, guide)</option><option value="link">Link (article, website)</option><option value="video">Video</option></select>
      </div>
      <div><label className="label" htmlFor="r-desc">Short description (optional)</label><textarea className="input min-h-20" id="r-desc" name="description" maxLength={400} /></div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="free" defaultChecked className="size-4 accent-[#4a2832]" />Free for everyone (untick to label it “Students”)</label>
      <SubmitButton pendingText="Adding…">Add resource</SubmitButton>
    </form>
  );
}
