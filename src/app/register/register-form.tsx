"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUpAction, type AuthState } from "@/app/actions/auth";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UNIVERSITIES } from "@/lib/universities";
import { GoogleAuthButton } from "@/components/auth/google-button";
import { CheckCircle2, TriangleAlert, CircleCheck } from "lucide-react";

const PASSWORD_RULES = [
  { test: (p: string) => p.length >= 8, label: "8 خانات على الأقل" },
  { test: (p: string) => /[A-Z]/.test(p), label: "حرف كبير (A-Z)" },
  { test: (p: string) => /[0-9]/.test(p), label: "رقم (0-9)" },
  { test: (p: string) => /[^A-Za-z0-9]/.test(p), label: "رمز خاص (!@#$)" },
];

export function RegisterForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    signUpAction,
    undefined
  );
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    if (state?.info) {
      router.push("/register/success");
    }
  }, [state, router]);

  const passwordChecks = PASSWORD_RULES.map((r) => ({ ...r, passed: r.test(password) }));
  const allPassed = passwordChecks.every((c) => c.passed);

  return (
    <div className="flex flex-col gap-5">
      <GoogleAuthButton />
      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-border" />
        أو سجل بريدك الإلكتروني
        <span className="h-px flex-1 bg-border" />
      </div>

      <form action={action} className="flex flex-col gap-4">
      <Field label="الاسم الكامل للطالب (ثلاثي باللاتينية للشهادة)">
        <Input name="full_name" required placeholder="Mohamed Amine Belkacem" maxLength={100} />
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
          <Input name="major" required placeholder="هندسة إعلام آلي" maxLength={100} />
        </Field>
        <Field label="رقم الواتساب">
          <Input
            name="whatsapp"
            required
            placeholder="0555123456"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
        </Field>
      </div>

      <Field label="عنوان فكرة المشروع في سطر واحد">
        <Textarea name="project_title" required rows={2} placeholder="منصة رقمية تربط..." maxLength={200} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="البريد الإلكتروني الجامعي أو الشخصي">
          <Input type="email" name="email" required placeholder="you@example.com" />
        </Field>
        <Field label="كلمة المرور السرية">
          <Input
            type="password"
            name="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {password.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {passwordChecks.map((check) => (
                <span
                  key={check.label}
                  className={`flex items-center gap-1 text-xs transition ${
                    check.passed ? "text-emerald-500" : "text-muted"
                  }`}
                >
                  <CircleCheck className="size-3" />
                  {check.label}
                </span>
              ))}
            </div>
          )}
        </Field>
      </div>

      {state?.error && (
        <p className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-cream">
          <TriangleAlert className="size-4 shrink-0 translate-y-0.5" />
          {state.error}
        </p>
      )}
      {state?.info && (
        <p className="flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-cream">
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
