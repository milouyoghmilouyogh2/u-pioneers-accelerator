"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service (Sentry, etc.) in production
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-4 text-center">
      <div className="card-luxury flex max-w-md flex-col items-center gap-6 rounded-2xl p-10">
        <span className="flex size-16 items-center justify-center rounded-full bg-red-500/10">
          <AlertTriangle className="size-8 text-red-500" />
        </span>
        <h1 className="text-2xl font-bold text-cream">حدث خطأ غير متوقع</h1>
        <p className="text-sm text-muted">
          عذراً، حدث خطأ في الخادم. لا تقلق — فريقنا يعمل على إصلاح المشكلة.
        </p>
        {error.digest && (
          <p className="rounded-lg bg-white/5 px-3 py-1.5 font-mono text-xs text-muted">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-gold-400 active:scale-95"
          >
            <RefreshCw className="size-4" />
            حاول مرة أخرى
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-cream transition hover:bg-white/5 active:scale-95"
          >
            <Home className="size-4" />
            الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
