import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const s = await getSession().catch(() => null);
  return Response.json({ signedIn: !!s, isAdmin: s?.role === "admin", name: s?.name ?? null }, { headers: { "Cache-Control": "no-store" } });
}
