import { redirect } from "next/navigation";
import { requireUser } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { AuthShell } from "@/components/auth/auth-shell";
import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, university, major, whatsapp")
    .eq("id", user.id)
    .single();

  if (profile && profile.university && profile.major && profile.whatsapp) {
    redirect("/dashboard");
  }

  return (
    <AuthShell
      title="أكمل ملفك الشخصي"
      subtitle="خطوة أخيرة قبل بدء مسار الأسلحة الـ16."
    >
      <OnboardingForm fullName={profile?.full_name || ""} />
    </AuthShell>
  );
}
