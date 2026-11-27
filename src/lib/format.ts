export function money(minor: number | null | undefined, currency: string) {
  if (minor == null) return "";
  if (minor === 0) return "Free";
  return new Intl.NumberFormat("en", { style: "currency", currency, currencyDisplay: currency === "GHS" ? "code" : "symbol" }).format(minor / 100);
}

export function formatDate(d: Date | string | undefined | null, opts: Intl.DateTimeFormatOptions = { dateStyle: "medium" }, timeZone?: string) {
  if (!d) return "";
  return new Intl.DateTimeFormat("en-GB", { ...opts, timeZone }).format(new Date(d));
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export const STATUS_LABEL: Record<string, string> = {
  pending_payment: "Awaiting payment",
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};
