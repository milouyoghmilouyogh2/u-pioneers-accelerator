"use client";

import { useActionState } from "react";
import { updatePasswordAction, type AuthState } from "@/app/actions/auth";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    updatePasswordAction,
    undefined
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      <Field label="كلمة المرور الجديدة" hint="8 خانات على الأقل">
        <Input type="password" name="password" required minLength={8} />
      </Field>

      {state?.error && (
        <p className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-cream">
          <TriangleAlert className="size-4 shrink-0 translate-y-0.5" />
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending} className="mt-2 w-full">
        {pending ? "جارٍ الحفظ..." : "حفظ كلمة المرور والدخول"}
      </Button>
    </form>
  );
}
