import { markPaid } from "@/lib/booking";
import { paystackSignatureValid } from "@/lib/payments";

export const dynamic = "force-dynamic";

/** Paystack → Settings → API Keys & Webhooks → Webhook URL: https://YOURDOMAIN/api/payments/paystack/webhook */
export async function POST(req: Request) {
  const raw = await req.text();
  if (!paystackSignatureValid(raw, req.headers.get("x-paystack-signature"), process.env.PAYSTACK_SECRET_KEY ?? "")) {
    return new Response("Invalid signature", { status: 401 });
  }
  const event = JSON.parse(raw) as { event: string; data: { reference: string; amount: number; currency: string; status: string } };
  if (event.event === "charge.success" && event.data.status === "success") {
    await markPaid(event.data.reference, event.data.amount, event.data.currency);
  }
  return new Response("ok");
}
