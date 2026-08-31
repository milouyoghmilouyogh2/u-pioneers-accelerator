"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { validate } from "@/lib/validations";
import { z } from "zod";

const onboardingSchema = z.object({
  university: z.string().min(1, "الرجاء اختيار الجامعة").max(200),
  major: z.string().min(1, "الرجاء إدخال التخصص").max(100),
  whatsapp: z.string().min(1, "الرجاء إدخال رقم الواتساب").max(20),
  project_title: z.string().min(1, "الرجاء إدخال عنوان المشروع").max(200),
});

export type OnboardingState = { error?: string } | undefined;

export async function completeOnboarding(
  _prevState: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  const parsed = validate(onboardingSchema, {
    university: String(formData.get("university") || "").trim(),
    major: String(formData.get("major") || "").trim(),
    whatsapp: String(formData.get("whatsapp") || "").trim(),
    project_title: String(formData.get("project_title") || "").trim(),
  });
  if (!parsed.success) return { error: parsed.error };

  const { university, major, whatsapp, project_title } = parsed.data;

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
