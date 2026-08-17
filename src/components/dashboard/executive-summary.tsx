"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/lib/supabase/database.types";

export function ExecutiveSummary({
  projectTitle,
  weapons,
  answers,
}: {
  projectTitle: string;
  weapons: Tables<"weapons">[];
  answers: Record<number, string>;
}) {
  return (
    <div className="card-luxury rounded-2xl p-6 sm:p-8 print:border-0 print:bg-white print:text-black print:shadow-none">
      <div className="flex items-center justify-between print:hidden">
        <h2 className="text-lg font-bold text-cream">الملخص التنفيذي للمشروع</h2>
        <Button variant="secondary" size="sm" onClick={() => window.print()}>
          <Printer className="size-4" /> طباعة / حفظ كـ PDF
        </Button>
      </div>

      <h1 className="mt-4 hidden text-2xl font-bold print:block">
        الملف التنفيذي: {projectTitle}
      </h1>
      <p className="mt-1 hidden text-sm text-gray-500 print:block">
        وفق مسار الأسلحة الـ16 — مسرعة U-Pioneers، متوافق مع القرار الوزاري 1275
      </p>

      <div className="mt-6 flex flex-col gap-5">
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
      </div>
    </div>
  );
}
