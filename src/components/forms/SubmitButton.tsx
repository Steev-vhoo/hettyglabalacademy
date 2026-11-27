"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children, pendingText = "Please wait…", className = "btn-primary" }: { children: React.ReactNode; pendingText?: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending} aria-disabled={pending}>
      {pending ? pendingText : children}
    </button>
  );
}

export function FieldError({ msg, id }: { msg?: string; id: string }) {
  if (!msg) return null;
  return <p id={id} className="mt-1.5 text-sm text-[#8a1c1c]">{msg}</p>;
}
