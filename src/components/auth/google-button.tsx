"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/providers/toast-provider";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4.5" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.72 4.1-5.5 4.1-3.31 0-6.02-2.74-6.02-6.2S8.69 5.8 12 5.8c1.89 0 3.16.8 3.89 1.5l2.65-2.55C16.9 3.15 14.65 2.2 12 2.2 6.9 2.2 2.77 6.4 2.77 12s4.13 9.8 9.23 9.8c5.33 0 8.86-3.75 8.86-9.03 0-.6-.07-1.06-.15-1.52H12z"
      />
    </svg>
  );
}

export function GoogleAuthButton() {
  const [pending, setPending] = useState(false);
  const { showToast } = useToast();

  async function handleClick() {
    setPending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    // A successful call navigates the browser away to Google immediately,
    // so reaching this line at all means it failed - without this, a
    // rejected/misconfigured provider left the button stuck on "pending"
    // forever since nothing ever reset it.
    if (error) {
      setPending(false);
      showToast("تسجيل الدخول عبر Google غير متاح حالياً، الرجاء استخدام البريد الإلكتروني.", "error");
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-medium text-cream transition hover:border-gold-500/40 disabled:opacity-60"
    >
      <GoogleIcon />
      {pending ? "جارٍ التحويل..." : "المتابعة عبر حساب Google"}
    </button>
  );
}
