"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Allowed file types — extension + MIME pairs
const ALLOWED_TYPES: Record<string, string[]> = {
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  png: ["image/png"],
  pdf: ["application/pdf"],
};
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function validateFile(file: File): string | null {
  // Check file size
  if (file.size === 0) return "الرجاء رفع صورة وصل التحويل المالي أولاً.";
  if (file.size > MAX_SIZE) return "حجم الملف كبير جداً (الحد الأقصى 5 ميغابايت).";

  // Check extension
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  if (!ALLOWED_TYPES[ext]) {
    return "نوع الملف غير مسموح. الرجاء رفع صورة (JPG, PNG) أو ملف PDF فقط.";
  }

  // Check MIME type matches extension
  const allowedMimes = ALLOWED_TYPES[ext];
  if (!allowedMimes.includes(file.type)) {
    return "نوع الملف غير صحيح. الرجاء رفع ملف من النوع الصحيح.";
  }

  return null; // valid
}

export async function submitPaymentRequest(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "الرجاء تسجيل الدخول أولاً." };

  const file = formData.get("receipt") as File | null;
  if (!file) return { error: "الرجاء رفع صورة وصل التحويل المالي أولاً." };

  // Server-side file validation
  const validationError = validateFile(file);
  if (validationError) return { error: validationError };

  const { data: startup } = await supabase
    .from("startups")
    .select("id")
    .eq("owner_id", user.id)
    .single();
  if (!startup) return { error: "لا يوجد مشروع مرتبط بحسابك." };

  // Use validated extension, not raw file.name
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
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
