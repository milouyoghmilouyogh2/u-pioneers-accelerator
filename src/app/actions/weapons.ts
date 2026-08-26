"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { weaponAnswerSchema, validate } from "@/lib/validations";

export async function submitWeaponAnswer(weaponNumber: number, answer: string) {
  // Validate inputs with zod
  const parsed = validate(weaponAnswerSchema, {
    weaponNumber,
    answer: answer.trim(),
  });
  if (!parsed.success) return { error: parsed.error };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "الرجاء تسجيل الدخول أولاً." };

  const { data, error } = await supabase.rpc("submit_weapon_answer", {
    p_weapon_number: parsed.data.weaponNumber,
    p_answer: parsed.data.answer,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/weapons");
  revalidatePath("/dashboard/graduation");

  return { success: true, startup: data };
}
