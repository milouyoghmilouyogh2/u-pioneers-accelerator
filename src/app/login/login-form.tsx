"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signInAction, type AuthState } from "@/app/actions/auth";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoogleAuthButton } from "@/components/auth/google-button";
import { TriangleAlert } from "lucide-react";

export function LoginForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    signInAction,
    undefined
  );

  return (
    <div className="flex flex-col gap-5">
      <GoogleAuthButton />
      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-border" />
        أو عبر البريد الإلكتروني
        <span className="h-px flex-1 bg-border" />
      </div>

      <form action={action} className="flex flex-col gap-4">
        <Field label="البريد الإلكتروني">
          <Input type="email" name="email" required placeholder="you@example.com" />
        </Field>
        <Field label="كلمة المرور">
          <Input type="password" name="password" required />
        </Field>

        {state?.error && (
          <p className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-cream">
            <TriangleAlert className="size-4 shrink-0 translate-y-0.5" />
            {state.error}
          </p>
        )}

        <Button type="submit" size="lg" disabled={pending} className="mt-2 w-full">
          {pending ? "جارٍ الدخول..." : "دخول للوحة التحكم"}
        </Button>

        <p className="text-center text-sm text-muted">
          ليس لديك حساب؟{" "}
          <Link href="/register" className="font-medium text-gold-400 hover:underline">
            سجل حساباً جديداً
          </Link>
        </p>
      </form>
    </div>
  );
}
