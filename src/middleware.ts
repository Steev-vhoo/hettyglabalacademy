import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

/** First line of protection for the admin area and student account. Pages and actions check again on the server. */
export async function middleware(req: NextRequest) {
  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value).catch(() => null);
  const { pathname, search } = req.nextUrl;
  const toLogin = () => {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  };
  if (pathname.startsWith("/admin") && session?.role !== "admin") return toLogin();
  if (pathname.startsWith("/account") && !session) return toLogin();
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/account/:path*"] };
