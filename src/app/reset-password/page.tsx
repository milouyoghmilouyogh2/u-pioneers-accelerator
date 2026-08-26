import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "./reset-password-form";

export default async function ResetPasswordPage() {
  // Only reachable with the temporary session /auth/callback establishes
  // by exchanging the recovery code - no session means this page was
  // opened directly rather than via a real reset-password email link.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/forgot-password");

  return (
    <AuthShell
      title="تعيين كلمة مرور جديدة"
      subtitle="أدخل كلمة مرور جديدة لحسابك."
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}
