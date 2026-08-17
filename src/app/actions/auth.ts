"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = {
  error?: string;
  info?: string;
} | undefined;

export async function signUpAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const full_name = String(formData.get("full_name") || "").trim();
  const university = String(formData.get("university") || "").trim();
  const major = String(formData.get("major") || "").trim();
  const whatsapp = String(formData.get("whatsapp") || "").trim();
  const project_title = String(formData.get("project_title") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!full_name || !university || !major || !whatsapp || !project_title) {
    return { error: "الرجاء تعبئة جميع الحقول المطلوبة." };
  }
  if (password.length < 8) {
    return { error: "كلمة المرور يجب أن تتكون من 8 خانات على الأقل." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name, university, major, whatsapp, project_title },
    },
  });

  if (error) {
    return { error: translateAuthError(error.message) };
  }

  if (data.session) {
    redirect("/dashboard");
  }

  return {
    info: "تم إنشاء حسابك بنجاح! تحقق من بريدك الإلكتروني لتأكيد الحساب قبل تسجيل الدخول.",
  };
}

export async function signInAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: translateAuthError(error.message) };
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

function translateAuthError(message: string): string {
  if (message.includes("Invalid login credentials")) {
    return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
  }
  if (message.includes("already registered") || message.includes("already exists")) {
    return "هذا البريد الإلكتروني مسجل بالفعل. سجل الدخول بدلاً من ذلك.";
  }
  if (message.includes("Email not confirmed")) {
    return "الرجاء تأكيد بريدك الإلكتروني أولاً عبر الرابط المرسل إليك.";
  }
  return message;
}
