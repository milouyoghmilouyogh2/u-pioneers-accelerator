import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/admin"];
const AUTH_PAGES = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  // CSRF protection: verify Origin header on POST requests
  if (request.method === "POST") {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host && !origin.includes(host)) {
      return NextResponse.json({ error: "CSRF validation failed" }, { status: 403 });
    }
  }

  let response = NextResponse.next({ request });

  // Check if Supabase session cookie exists (instant, local — no network call).
  // Real authorization (role, ownership) is verified server-side in layouts/actions.
  const hasSession = request.cookies.getAll().some((c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token"));

  // Sync a lightweight flag so layouts/navbars can read auth status without
  // creating their own Supabase client.
  if (hasSession) {
    response.cookies.set("logged-in", "1", { path: "/", httpOnly: false, sameSite: "lax", maxAge: 60 * 60 * 24 * 7 });
  } else {
    response.cookies.delete("logged-in");
  }

  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((p) => path.startsWith(p));
  const isAuthPage = AUTH_PAGES.includes(path);

  if (isProtected && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
