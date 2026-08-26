"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type OnboardingState = { error?: string } | undefined;

export async function completeOnboarding(
  _prevState: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  const university = String(formData.get("university") || "").trim();
  const major = String(formData.get("major") || "").trim();
  const whatsapp = String(formData.get("whatsapp") || "").trim();
  const project_title = String(formData.get("project_title") || "").trim();

  if (!university || !major || !whatsapp || !project_title) {
    return { error: "الرجاء تعبئة جميع الحقول." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "الرجاء تسجيل الدخول أولاً." };

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ university, major, whatsapp })
    .eq("id", user.id);
  if (profileError) return { error: profileError.message };

  const { error: startupError } = await supabase
    .from("startups")
    .update({ project_title })
    .eq("owner_id", user.id);
  if (startupError) return { error: startupError.message };

  redirect("/dashboard");
}
