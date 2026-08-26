"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

const COOKIE_KEY = "up_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-4 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3 text-center sm:text-start">
          <Cookie className="size-5 shrink-0 text-gold-400" />
          <p className="text-sm text-cream-dim">
            نستخدم ملفات تعريف الارتباط (Cookies) لتحسين تجربتك وتمكين تسجيل الدخول.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/privacy" className="text-xs text-muted hover:text-cream">
            المزيد
          </Link>
          <button
            onClick={accept}
            className="shrink-0 rounded-full bg-gold-500 px-5 py-2 text-sm font-semibold text-ink transition hover:bg-gold-400 active:scale-95"
          >
            موافق
          </button>
        </div>
      </div>
    </div>
  );
}
