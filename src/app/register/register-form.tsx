"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpAction, type AuthState } from "@/app/actions/auth";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UNIVERSITIES } from "@/lib/universities";
import { GoogleAuthButton } from "@/components/auth/google-button";
import { CheckCircle2, TriangleAlert } from "lucide-react";

export function RegisterForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    signUpAction,
    undefined
  );

  return (
    <div className="flex flex-col gap-5">
      <GoogleAuthButton />
      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-border" />
        أو سجل ببريدك الإلكتروني
        <span className="h-px flex-1 bg-border" />
      </div>

      <form action={action} className="flex flex-col gap-4">
      <Field label="الاسم الكامل للطالب (ثلاثي باللاتينية للشهادة)">
        <Input name="full_name" required placeholder="Mohamed Amine Belkacem" />
      </Field>

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

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="البريد الإلكتروني الجامعي أو الشخصي">
          <Input type="email" name="email" required placeholder="you@example.com" />
        </Field>
        <Field label="كلمة المرور السرية" hint="8 خانات على الأقل">
          <Input type="password" name="password" required minLength={8} />
        </Field>
      </div>

      {state?.error && (
        <p className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          <TriangleAlert className="size-4 shrink-0 translate-y-0.5" />
          {state.error}
        </p>
      )}
      {state?.info && (
        <p className="flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
          <CheckCircle2 className="size-4 shrink-0 translate-y-0.5" />
          {state.info}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending} className="mt-2 w-full">
        {pending ? "جارٍ الإنشاء..." : "ابدأ مسارك الآن (مجاناً)"}
      </Button>

      <p className="text-center text-sm text-muted">
        لديك حساب بالفعل؟{" "}
        <Link href="/login" className="font-medium text-gold-400 hover:underline">
          تسجيل الدخول
        </Link>
      </p>
      </form>
    </div>
  );
}
