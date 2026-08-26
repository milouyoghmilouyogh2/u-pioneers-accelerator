"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Lock, CheckCircle2, Unlock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { useToast } from "@/components/providers/toast-provider";
import { submitWeaponAnswer } from "@/app/actions/weapons";
import type { Tables } from "@/lib/supabase/database.types";

type Weapon = Tables<"weapons">;

export function WeaponsGrid({
  weapons,
  currentStep,
  answers,
}: {
  weapons: Weapon[];
  currentStep: number;
  answers: Record<number, string>;
}) {
  const [activeWeapon, setActiveWeapon] = useState<Weapon | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {weapons.map((w) => {
          const isDone = answers[w.number] !== undefined;
          const isActive = w.number === currentStep;
          const isLocked = w.number > currentStep;

          return (
            <button
              key={w.number}
              disabled={isLocked}
              onClick={() => setActiveWeapon(w)}
              className={cn(
                "card-luxury flex flex-col items-start gap-3 rounded-xl p-5 text-start transition",
                isLocked
                  ? "cursor-not-allowed opacity-50"
                  : "hover:border-gold-500/40",
                isActive && "border-gold-500/50"
              )}
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-xs font-bold text-gold-500">
                  {String(w.number).padStart(2, "0")}
                </span>
                {isDone ? (
                  <CheckCircle2 className="size-4 text-emerald-400" />
                ) : isLocked ? (
                  <Lock className="size-4 text-muted" />
                ) : (
                  <Unlock className="size-4 text-gold-400" />
                )}
              </div>
              <h3 className="text-sm font-semibold leading-snug text-cream">
                {w.title}
              </h3>
              <p className="line-clamp-2 text-xs leading-relaxed text-muted">
                {w.summary}
              </p>
              <span className="mt-auto text-xs font-medium text-gold-400">
                {isDone ? "مكتمل (اضغط للتعديل)" : isLocked ? "سلاح مغلق" : "مفتوح (ابدأ العمل)"}
              </span>
            </button>
          );
        })}
      </div>

      {activeWeapon && (
        <WeaponModal
          weapon={activeWeapon}
          initialAnswer={answers[activeWeapon.number] ?? ""}
          onClose={() => setActiveWeapon(null)}
        />
      )}
    </>
  );
}

function WeaponModal({
  weapon,
  initialAnswer,
  onClose,
}: {
  weapon: Weapon;
  initialAnswer: string;
  onClose: () => void;
}) {
  const [answer, setAnswer] = useState(initialAnswer);
  const [pending, startTransition] = useTransition();
  const { showToast } = useToast();
  const router = useRouter();

  function handleSubmit() {
    startTransition(async () => {
      const result = await submitWeaponAnswer(weapon.number, answer);
      if (result.error) {
        showToast(result.error, "error");
        return;
      }
      showToast(`تم حفظ إجابتك للسلاح ${weapon.number} بنجاح!`, "success");
      router.refresh();
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="card-luxury flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-2xl sm:max-w-2xl sm:rounded-2xl">
        <div className="flex items-start justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold text-cream">
            السلاح {weapon.number}: {weapon.title}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-cream" aria-label="إغلاق">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="rounded-lg border border-gold-500/20 bg-gold-500/5 p-4">
            <p className="text-sm leading-relaxed text-cream-dim">
              {weapon.knowledge}
            </p>
          </div>

          <p className="mt-5 text-sm font-semibold text-cream">
            {weapon.task_prompt}
          </p>
          <Textarea
            className="mt-3"
            rows={6}
            placeholder={weapon.placeholder}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
          <Button variant="ghost" onClick={onClose}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit} disabled={pending}>
            {pending ? "جارٍ الحفظ..." : "حفظ الإجابة"}
          </Button>
        </div>
      </div>
    </div>
  );
}
