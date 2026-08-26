"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  signUpSchema,
  signInSchema,
  passwordResetSchema,
  updatePasswordSchema,
  validate,
} from "@/lib/validations";

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
  // Use configured URL to prevent header spoofing in production
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  // Fallback for development
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function signUpAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  // Rate limit: 3 signups per 10 minutes
  const rl = checkRateLimit({ key: "signup", maxAttempts: 3, windowSeconds: 600 });
  if (!rl.success) {
    return { error: `تم حظر المحاولة مؤقتاً. حاول مرة أخرى بعد ${rl.retryAfter} ثانية.` };
  }

  // Validate all inputs with zod
  const parsed = validate(signUpSchema, {
    full_name: String(formData.get("full_name") || "").trim(),
    university: String(formData.get("university") || "").trim(),
    major: String(formData.get("major") || "").trim(),
    whatsapp: String(formData.get("whatsapp") || "").trim(),
    project_title: String(formData.get("project_title") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    password: String(formData.get("password") || ""),
  });
  if (!parsed.success) return { error: parsed.error };

  const { full_name, university, major, whatsapp, project_title, email, password } = parsed.data;

  const supabase = await createClient();

  // Use standard signUp — triggers email confirmation flow
  // Profile + startup are created by the database trigger (on_auth_user_created)
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        university,
        major,
        whatsapp,
        project_title,
      },
    },
  });

  if (error) {
    return { error: translateAuthError(error.message) };
  }

  // Show "check your email" message — user must confirm before logging in
  return {
    info: "تم التسجيل بنجاح! تحقق من بريدك الإلكتروني واضغط على رابط التفعيل للاستمرار.",
  };
}

export async function signInAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  // Rate limit: 5 login attempts per 5 minutes
  const rl = checkRateLimit({ key: "signin", maxAttempts: 5, windowSeconds: 300 });
  if (!rl.success) {
    return { error: `تم حظر المحاولة مؤقتاً. حاول مرة أخرى بعد ${rl.retryAfter} ثانية.` };
  }

  // Validate inputs with zod
  const parsed = validate(signInSchema, {
    email: String(formData.get("email") || "").trim(),
    password: String(formData.get("password") || ""),
  });
  if (!parsed.success) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

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
  // Rate limit: 3 reset requests per hour
  const rl = checkRateLimit({ key: "password-reset", maxAttempts: 3, windowSeconds: 3600 });
  if (!rl.success) {
    return { error: `تم حظر المحاولة مؤقتاً. حاول مرة أخرى بعد ${Math.ceil(rl.retryAfter / 60)} دقيقة.` };
  }

  // Validate email with zod
  const parsed = validate(passwordResetSchema, {
    email: String(formData.get("email") || "").trim(),
  });
  if (!parsed.success) return { error: parsed.error };

  const origin = await getOrigin();
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
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
  // Validate password with zod
  const parsed = validate(updatePasswordSchema, {
    password: String(formData.get("password") || ""),
  });
  if (!parsed.success) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

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
  // Never leak raw error messages
  return "حدث خطأ غير متوقع. حاول مرة أخرى.";
}
