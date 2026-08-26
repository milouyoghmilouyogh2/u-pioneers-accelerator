import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Validate that a redirect path is safe (relative, no protocol, no double slashes) */
function isSafeRedirect(path: string): boolean {
  // Must start with / (relative path)
  if (!path.startsWith("/")) return false;
  // Must not start with // (protocol-relative URL like //evil.com)
  if (path.startsWith("//")) return false;
  // Must not contain a full URL
  if (path.includes("://")) return false;
  return true;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawRedirect = searchParams.get("redirect") || "/dashboard";
  const redirectTarget = isSafeRedirect(rawRedirect) ? rawRedirect : "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Use plain Response to redirect — this preserves the session cookies
      // that exchangeCodeForSession() set via the cookie store.
      // NextResponse.redirect() creates a fresh response that loses those cookies.
      return new Response(null, {
        status: 302,
        headers: { Location: `${origin}${redirectTarget}` },
      });
    }
  }

  return new Response(null, {
    status: 302,
    headers: { Location: `${origin}/login?error=auth` },
  });
}
