"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Shield } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin panel error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-red-500/10">
        <AlertTriangle className="size-7 text-red-500" />
      </span>
      <h1 className="mt-4 text-xl font-bold text-cream">حدث خطأ في لوحة الإدارة</h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        عذراً، حدث خطأ في لوحة التحكم الإدارية. حاول مرة أخرى.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-gold-400 active:scale-95"
        >
          <RefreshCw className="size-4" />
          حاول مرة أخرى
        </button>
        <Link
          href="/admin"
          className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-cream transition hover:bg-white/5 active:scale-95"
        >
          <Shield className="size-4" />
          لوحة الإدارة
        </Link>
      </div>
    </div>
  );
}
