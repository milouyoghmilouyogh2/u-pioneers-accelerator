"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function submitWeaponAnswer(weaponNumber: number, answer: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "الرجاء تسجيل الدخول أولاً." };

  const trimmed = answer.trim();
  if (!trimmed) return { error: "الرجاء كتابة إجابة المهمة التطبيقية أولاً." };

  const { data, error } = await supabase.rpc("submit_weapon_answer", {
    p_weapon_number: weaponNumber,
    p_answer: trimmed,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/weapons");
  revalidatePath("/dashboard/graduation");

  return { success: true, startup: data };
}
