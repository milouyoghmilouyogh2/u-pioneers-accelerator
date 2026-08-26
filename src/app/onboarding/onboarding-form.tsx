"use client";

import { useActionState } from "react";
import { completeOnboarding, type OnboardingState } from "@/app/actions/onboarding";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UNIVERSITIES } from "@/lib/universities";
import { TriangleAlert } from "lucide-react";

export function OnboardingForm({ fullName }: { fullName: string }) {
  const [state, action, pending] = useActionState<OnboardingState, FormData>(
    completeOnboarding,
    undefined
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      <p className="text-sm text-muted">
        أهلاً {fullName}! أكمل بياناتك الأساسية لبدء مسارك في المسرعة.
      </p>

      <Field label="الجامعة الجزائرية المنتسب إليها">
        <Select name="university" required defaultValue="">
          <option value="" disabled>
            اختر جامعتك...
          </option>
          {UNIVERSITIES.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </Select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="التخصص الدراسي الدقيق">
          <Input name="major" required placeholder="هندسة إعلام آلي" />
        </Field>
        <Field label="رقم الواتساب (مع رمز الدولة)">
          <Input name="whatsapp" required placeholder="+213555xxxxxx" />
        </Field>
      </div>

      <Field label="عنوان فكرة المشروع في سطر واحد">
        <Textarea name="project_title" required rows={2} placeholder="منصة رقمية تربط..." />
      </Field>

      {state?.error && (
        <p className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-cream">
          <TriangleAlert className="size-4 shrink-0 translate-y-0.5" />
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending} className="mt-2 w-full">
        {pending ? "جارٍ الحفظ..." : "ابدأ مسارك الآن"}
      </Button>
    </form>
  );
}
