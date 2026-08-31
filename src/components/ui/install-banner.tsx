"use client";

import { usePwaInstall } from "@/hooks/use-pwa-install";

export function InstallBanner() {
  const { showInstall, install, dismiss } = usePwaInstall();

  if (!showInstall) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={dismiss} />

      <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-surface p-6 pb-8 shadow-2xl animate-slide-up">
        <div className="mx-auto max-w-md">
          <div className="mb-5 flex items-center gap-4">
            <div className="size-14 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg">
              <img src="/icons/icon-512.png" alt="U-Pioneers" className="size-full object-cover" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-cream">تثبيت U-Pioneers</h3>
              <p className="text-sm text-cream-dim">أضف المنصة لشاشة هاتفك للوصول السريع</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={install}
              className="flex-1 rounded-2xl bg-gold-500 py-3.5 text-[15px] font-bold text-white transition hover:bg-gold-600 active:scale-[0.98]"
            >
              تثبيت الآن
            </button>
            <button
              onClick={dismiss}
              className="flex-1 rounded-2xl border border-border py-3.5 text-[15px] font-semibold text-cream-dim transition hover:bg-white/5"
            >
              لاحقاً
            </button>
          </div>

          <p className="mt-3 text-center text-xs text-muted">
            يمكنك التثبيت لاحقاً من قائمة متصفحك
          </p>
        </div>
      </div>
    </>
  );
}
