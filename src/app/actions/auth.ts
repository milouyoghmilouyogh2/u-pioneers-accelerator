"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type AuthState = {
  error?: string;
  info?: string;
} | undefined;

// Supabase falls back to the project's Site URL (a single fixed value, set
// to the production domain) whenever a redirect isn't given explicitly -
// which sends every confirmation/reset link to production even when
// testing locally, and points at the bare domain instead of the app's own
// callback route, so the link never actually finishes logging anyone in.
// Deriving the real origin per-request fixes both at once.
async function getOrigin() {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

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

  const origin = await getOrigin();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name, university, major, whatsapp, project_title },
      emailRedirectTo: `${origin}/auth/callback`,
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

export async function requestPasswordResetAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim();
  if (!email) {
    return { error: "الرجاء إدخال بريدك الإلكتروني." };
  }

  const origin = await getOrigin();
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect=/reset-password`,
  });

  // Never reveal whether an email is registered - same message either way,
  // so this can't be used to check which addresses have accounts.
  if (error) {
    console.error("resetPasswordForEmail failed:", error.message);
  }

  return {
    info: "إذا كان هذا البريد مسجلاً لدينا، فستصلك رسالة تحتوي على رابط لإعادة تعيين كلمة المرور خلال دقائق.",
  };
}

export async function updatePasswordAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const password = String(formData.get("password") || "");
  if (password.length < 8) {
    return { error: "كلمة المرور يجب أن تتكون من 8 خانات على الأقل." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: translateAuthError(error.message) };
  }

  redirect("/dashboard");
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
