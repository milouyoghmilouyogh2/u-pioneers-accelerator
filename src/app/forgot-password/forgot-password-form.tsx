"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordResetAction, type AuthState } from "@/app/actions/auth";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, TriangleAlert } from "lucide-react";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    requestPasswordResetAction,
    undefined
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      <Field label="البريد الإلكتروني">
        <Input type="email" name="email" required placeholder="you@example.com" />
      </Field>

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
        {pending ? "جارٍ الإرسال..." : "إرسال رابط إعادة التعيين"}
      </Button>

      <p className="text-center text-sm text-muted">
        تذكرت كلمة المرور؟{" "}
        <Link href="/login" className="font-medium text-gold-400 hover:underline">
          تسجيل الدخول
        </Link>
      </p>
      <p className="text-center text-sm text-muted">
        ليس لديك حساب أصلاً؟{" "}
        <Link href="/register" className="font-medium text-gold-400 hover:underline">
          سجل حساباً جديداً مباشرة
        </Link>
      </p>
    </form>
  );
}
