"use client";

import { useState } from "react";
import { Printer, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaywallPopup } from "./paywall-popup";
import type { Tables } from "@/lib/supabase/database.types";

export function ExecutiveSummary({
  projectTitle,
  weapons,
  answers,
  isPremium,
}: {
  projectTitle: string;
  weapons: Tables<"weapons">[];
  answers: Record<number, string>;
  isPremium: boolean;
}) {
  const [showPaywall, setShowPaywall] = useState(false);

  function handlePrint() {
    if (!isPremium) {
      setShowPaywall(true);
      return;
    }
    window.print();
  }

  return (
    <div className="card-luxury rounded-2xl p-6 sm:p-8 print:border-0 print:bg-white print:text-black print:shadow-none">
      <PaywallPopup open={showPaywall} onClose={() => setShowPaywall(false)} />
      <div className="flex items-center justify-between print:hidden">
        <h2 className="text-lg font-bold text-cream">الملخص التنفيذي للمشروع</h2>
        <Button variant="secondary" size="sm" onClick={handlePrint}>
          <Printer className="size-4" /> طباعة / حفظ كـ PDF
        </Button>
      </div>

      <h1 className="mt-4 hidden text-2xl font-bold print:block">
        الملف التنفيذي: {projectTitle}
      </h1>
      <p className="mt-1 hidden text-sm text-gray-500 print:block">
        وفق مسار الأسلحة الـ16 — مسرعة U-Pioneers، متوافق مع القرار الوزاري 1275
      </p>

      <div className={`mt-6 flex flex-col gap-5 ${!isPremium ? "max-h-40 overflow-hidden relative" : ""}`}>
        {weapons.map((w) => (
          <div key={w.number} className="border-b border-border pb-4 last:border-0 print:border-gray-200">
            <p className="text-xs font-bold text-gold-500 print:text-gray-500">
              {String(w.number).padStart(2, "0")} — {w.title}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-cream-dim print:text-black">
              {answers[w.number] || "—"}
            </p>
          </div>
        ))}

        {!isPremium && (
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-center bg-gradient-to-t from-surface via-surface/95 to-transparent pt-16 pb-4 print:hidden">
            <div
              onClick={() => setShowPaywall(true)}
              className="flex size-12 cursor-pointer items-center justify-center rounded-xl bg-gold-500/15 border border-gold-500/30 transition hover:scale-105 hover:bg-gold-500/25"
            >
              <Lock className="size-5 text-gold-500" />
            </div>
            <p className="mt-2 text-xs font-semibold text-cream">اشترك لفتح الملف</p>
          </div>
        )}
      </div>
    </div>
  );
}
