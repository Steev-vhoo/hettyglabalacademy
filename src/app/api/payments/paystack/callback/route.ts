import { NextResponse } from "next/server";
import { markPaid } from "@/lib/booking";
import { verifyPaystack } from "@/lib/payments";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

/** Where Paystack sends the customer after paying. Verifies server-side, then shows the confirmation page. */
export async function GET(req: Request) {
  const reference = new URL(req.url).searchParams.get("reference") ?? "";
  if (!/^HGA-[A-F0-9]{16}$/.test(reference)) return NextResponse.redirect(`${site.url}/book`);
  const tx = await verifyPaystack(reference).catch(() => null);
  if (tx?.status === "success") await markPaid(reference, tx.amount, tx.currency);
  return NextResponse.redirect(`${site.url}/book/confirmation?ref=${reference}`);
}
