"use client";

import Link from "next/link";
import { Lock, ArrowLeft, X } from "lucide-react";

export function PaywallPopup({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-gold-500/30 bg-surface p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute left-4 top-4 text-muted transition hover:text-cream"
          aria-label="إغلاق"
        >
          <X className="size-5" />
        </button>

        {/* Icon */}
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-gold-500/15">
          <Lock className="size-7 text-gold-500" />
        </div>

        {/* Text */}
        <h2 className="mt-5 text-center text-xl font-bold text-cream">
          اشترك للحصول على الملفات المطلوبة
        </h2>
        <p className="mt-2 text-center text-sm leading-relaxed text-muted">
          لتحميل الشهادة والملف التنفيذي، يجب تفعيل النسخة الاحترافية.
          <br />
          حوّل رسوم الترقية عبر BaridiMob/CCP ثم ارفع الوصل.
        </p>

        {/* CTA Button */}
        <Link
          href="/dashboard/billing"
          className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#E8720C] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#d46800] hover:shadow-xl active:scale-95"
        >
          الذهاب لصفحة الدفع
          <ArrowLeft className="size-4" />
        </Link>

        {/* Cancel */}
        <button
          onClick={onClose}
          className="mt-3 w-full text-center text-sm text-muted transition hover:text-cream"
        >
          إلغاء
        </button>
      </div>
    </div>
  );
}
