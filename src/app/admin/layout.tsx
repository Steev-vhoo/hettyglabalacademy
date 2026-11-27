import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "@/actions/auth";
import { AdminNav } from "./AdminNav";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin" }, robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const s = await requireAdmin();
  return (
    <div className="flex min-h-screen flex-wrap bg-ivory">
      <aside className="flex w-full flex-col gap-6 bg-burgundy px-4 py-6 text-white lg:sticky lg:top-0 lg:h-screen lg:w-64">
        <Link href="/admin" className="flex items-center gap-3 px-2 text-white no-underline">
          <Image src="/brand/crest-transparent.webp" alt="" width={56} height={41} className="h-[41px] w-14 object-contain" />
          <span className="font-display font-bold tracking-wide">Admin</span>
        </Link>
        <AdminNav />
        <div className="mt-auto flex flex-col gap-2 border-t border-white/15 px-2 pt-4 text-sm">
          <span><strong>{s.name}</strong><br /><span className="text-white/70">{s.email}</span></span>
          <div className="flex gap-3">
            <Link href="/" className="text-gold">View site ↗</Link>
            <form action={logout}><button type="submit" className="text-white/80 underline">Sign out</button></form>
          </div>
        </div>
      </aside>
      <div className="min-w-0 flex-1 p-5 sm:p-8">{children}</div>
    </div>
  );
}
