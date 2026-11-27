"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/availability", label: "Availability" },
  { href: "/admin/services", label: "Services & courses" },
  { href: "/admin/blog", label: "Blog posts" },
  { href: "/admin/resources", label: "Resources" },
  { href: "/admin/videos", label: "TikTok videos" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/students", label: "Students" },
];

export function AdminNav() {
  const path = usePathname();
  return (
    <nav aria-label="Admin" className="flex flex-row flex-wrap gap-1 lg:flex-col">
      {items.map((i) => {
        const active = i.href === "/admin" ? path === "/admin" : path.startsWith(i.href);
        return (
          <Link key={i.href} href={i.href} aria-current={active ? "page" : undefined}
            className={`flex min-h-11 items-center rounded-xl px-3.5 text-[15px] font-medium no-underline ${active ? "bg-white/15 text-white" : "text-[#efe2e5] hover:bg-white/10 hover:text-white"}`}>
            {i.label}
          </Link>
        );
      })}
    </nav>
  );
}
