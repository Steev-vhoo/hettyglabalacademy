export type FormState = { ok?: boolean; message?: string; error?: string; fields?: Record<string, string> };
export const initialState: FormState = {};

/** Turns zod issues into { fieldName: message }. */
export function fieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string> = {};
  for (const i of issues) {
    const k = String(i.path[0] ?? "form");
    out[k] ??= i.message;
  }
  return out;
}
