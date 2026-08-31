"use client";

import { usePwaInstall } from "@/hooks/use-pwa-install";

export function InstallBanner() {
  const { showInstall, install } = usePwaInstall();

  if (!showInstall) return null;

  return (
    <>
      {/* Backdrop — no click to dismiss */}
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />

      {/* Banner */}
      <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-surface p-6 pb-8 shadow-2xl animate-slide-up">
        <div className="mx-auto max-w-md">
          {/* Header */}
          <div className="mb-5 flex items-center gap-4">
            <div className="size-14 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg">
              <img src="/icons/icon-512.png" alt="U-Pioneers" className="size-full object-cover" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-cream">تثبيت U-Pioneers</h3>
              <p className="text-sm text-cream-dim">أضف المنصة لشاشة هاتفك للوصول السريع</p>
            </div>
          </div>

          {/* Single install button */}
          <button
            onClick={install}
            className="w-full rounded-2xl bg-gold-500 py-4 text-[16px] font-bold text-white shadow-lg transition hover:bg-gold-600 active:scale-[0.98]"
          >
            تثبيت الآن
          </button>
        </div>
      </div>
    </>
  );
}
