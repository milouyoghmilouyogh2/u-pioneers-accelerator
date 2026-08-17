"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function submitPaymentRequest(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "الرجاء تسجيل الدخول أولاً." };

  const file = formData.get("receipt") as File | null;
  if (!file || file.size === 0) {
    return { error: "الرجاء رفع صورة وصل التحويل المالي أولاً." };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { error: "حجم الملف كبير جداً (الحد الأقصى 5 ميغابايت)." };
  }

  const { data: startup } = await supabase
    .from("startups")
    .select("id")
    .eq("owner_id", user.id)
    .single();
  if (!startup) return { error: "لا يوجد مشروع مرتبط بحسابك." };

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${user.id}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("receipts")
    .upload(path, file, { contentType: file.type });
  if (uploadError) return { error: uploadError.message };

  const { error: insertError } = await supabase.from("payment_requests").insert({
    startup_id: startup.id,
    receipt_path: path,
  });
  if (insertError) return { error: insertError.message };

  revalidatePath("/dashboard/billing");
  return { success: true };
}
