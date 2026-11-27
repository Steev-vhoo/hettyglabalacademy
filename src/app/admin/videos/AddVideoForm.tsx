"use client";

import { useActionState, useEffect, useRef } from "react";
import { addVideo } from "@/actions/admin";
import { initialState } from "@/actions/types";
import { Notice } from "@/components/ui";
import { SubmitButton } from "@/components/forms/SubmitButton";

export function AddVideoForm() {
  const [state, action] = useActionState(addVideo, initialState);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => { if (state.ok) form.current?.reset(); }, [state]);
  return (
    <form ref={form} action={action} className="flex flex-col gap-4 self-start rounded-2xl border border-line bg-white p-6">
      <h2 className="text-xl">Add a video</h2>
      {state.error && <Notice tone="error">{state.error}</Notice>}
      {state.ok && <Notice tone="success">{state.message}</Notice>}
      <div>
        <label className="label" htmlFor="v-url">TikTok video link</label>
        <input className="input" id="v-url" name="url" type="url" required placeholder="https://vt.tiktok.com/… or https://www.tiktok.com/@stylenurse1/video/…" />
        <p className="mt-1 text-xs text-muted">In the TikTok app: open the video › Share › Copy link. Short vt.tiktok.com links are fine.</p>
      </div>
      <div><label className="label" htmlFor="v-title">Title (optional)</label><input className="input" id="v-title" name="title" placeholder="Filled in from TikTok if left empty" /></div>
      <div><label className="label" htmlFor="v-cover">Cover image link (optional)</label><input className="input" id="v-cover" name="coverImage" type="url" placeholder="https://…" /></div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" defaultChecked className="size-4 accent-[#4a2832]" />Feature on the homepage</label>
      <SubmitButton pendingText="Adding…">Add video</SubmitButton>
    </form>
  );
}
