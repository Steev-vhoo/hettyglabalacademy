import { db } from "@/lib/db";
import { Service, type ServiceDoc } from "@/lib/models";
import { availableSlots } from "@/lib/booking";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("service") ?? "";
  if (!/^[a-f0-9]{24}$/.test(id)) return Response.json({ error: "Invalid service" }, { status: 400 });
  try {
    await db();
    const service = await Service.findOne({ _id: id, active: true, kind: "consultation" }).lean<ServiceDoc>();
    if (!service) return Response.json({ error: "Not found" }, { status: 404 });
    const slots = await availableSlots(service);
    return Response.json({ slots }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("[slots]", e);
    return Response.json({ error: "Unavailable" }, { status: 503 });
  }
}
