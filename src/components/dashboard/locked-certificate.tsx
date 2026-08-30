"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { PaywallPopup } from "./paywall-popup";

export function LockedCertificate() {
  const [showPaywall, setShowPaywall] = useState(false);

  return (
    <div className="relative mx-auto max-w-2xl">
      <PaywallPopup open={showPaywall} onClose={() => setShowPaywall(false)} />

      {/* Blurred certificate — shape visible, text unreadable */}
      <div className="w-full rounded-xl border-4 border-[#0f5132] bg-[#fdfbf7] p-8 opacity-60 blur-[2px] select-none pointer-events-none">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full border-2 border-[#c5a03c] bg-[#0b2e1b]">
          <span className="text-lg font-bold text-[#c5a03c]">U</span>
        </div>
        <div className="h-8 w-72 mx-auto rounded bg-[#0f5132]/20 mb-3"></div>
        <div className="h-4 w-56 mx-auto rounded bg-[#c5a03c]/30 mb-8"></div>
        <div className="h-6 w-48 mx-auto rounded bg-[#071e12]/15 mb-3"></div>
        <div className="h-px w-40 mx-auto bg-[#c5a03c]/30 mb-6"></div>
        <div className="h-3 w-80 mx-auto rounded bg-[#648170]/20 mb-2"></div>
        <div className="h-3 w-72 mx-auto rounded bg-[#648170]/20 mb-8"></div>
        <div className="h-5 w-56 mx-auto rounded bg-[#0f5132]/15 mb-4"></div>
        <div className="h-3 w-32 mx-auto rounded bg-[#a3bdae]/30"></div>
      </div>

      {/* Lock badge */}
      <div className="absolute top-4 left-4 flex items-center gap-2 rounded-lg bg-black/50 px-3 py-2 backdrop-blur-sm">
        <Lock className="size-4 text-gold-400" />
        <span className="text-xs font-semibold text-white">مقفل</span>
      </div>

      {/* Download button — NOW WITH onClick */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setShowPaywall(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-l from-gold-400 to-gold-600 px-6 py-3 text-sm font-bold text-ink shadow-lg transition hover:brightness-110 active:scale-95"
        >
          <Lock className="size-4" /> تحميل الشهادة
        </button>
      </div>
    </div>
  );
}
