"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/dal";
import { weaponUpdateSchema, settingUpdateSchema, uuidSchema, validate } from "@/lib/validations";

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function updateWeapon(formData: FormData) {
  await requireAdmin();

  const parsed = validate(weaponUpdateSchema, {
    number: Number(formData.get("number")),
    title: String(formData.get("title") || ""),
    summary: String(formData.get("summary") || ""),
    knowledge: String(formData.get("knowledge") || ""),
    task_prompt: String(formData.get("task_prompt") || ""),
    placeholder: String(formData.get("placeholder") || ""),
  });
  if (!parsed.success) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase
    .from("weapons")
    .update({
      title: parsed.data.title,
      summary: parsed.data.summary,
      knowledge: parsed.data.knowledge,
      task_prompt: parsed.data.task_prompt,
      placeholder: parsed.data.placeholder,
    })
    .eq("number", parsed.data.number);

  if (error) return { error: error.message };
  revalidatePath("/admin/weapons");
  revalidatePath("/dashboard");
  revalidatePath("/");
  return { success: true };
}

export async function reviewPaymentRequest(
  requestId: string,
  approve: boolean,
  note?: string
) {
  await requireAdmin();

  const idParsed = validate(uuidSchema, requestId);
  if (!idParsed.success) return { error: idParsed.error };

  const supabase = await createClient();
  const { error } = await supabase.rpc("review_payment_request", {
    p_request_id: idParsed.data,
    p_approve: approve,
    p_note: note,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/payments");
  revalidatePath("/admin");
  return { success: true };
}

export async function closeSupportTicket(ticketId: string) {
  await requireAdmin();

  const idParsed = validate(uuidSchema, ticketId);
  if (!idParsed.success) return { error: idParsed.error };

  const supabase = await createClient();
  const { error } = await supabase
    .from("support_tickets")
    .update({ status: "closed" })
    .eq("id", idParsed.data);

  if (error) return { error: error.message };
  revalidatePath("/admin/tickets");
  return { success: true };
}

export async function replyToSupportTicket(ticketId: string, reply: string) {
  await requireAdmin();

  const idParsed = validate(uuidSchema, ticketId);
  if (!idParsed.success) return { error: idParsed.error };

  const trimmed = reply.trim();
  if (!trimmed) return { error: "الرجاء كتابة نص الرد أولاً." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("support_tickets")
    .update({ admin_reply: trimmed, replied_at: new Date().toISOString() })
    .eq("id", idParsed.data);

  if (error) return { error: error.message };
  revalidatePath("/admin/tickets");
  revalidatePath("/b2b");
  return { success: true };
}

export async function updateSetting(key: string, value: string) {
  await requireAdmin();

  const parsed = validate(settingUpdateSchema, { key, value });
  if (!parsed.success) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase
    .from("settings")
    .update({ value: parsed.data.value })
    .eq("key", parsed.data.key);

  if (error) return { error: error.message };
  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/dashboard/billing");
  return { success: true };
}

export async function createUser(formData: FormData) {
  await requireAdmin();

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const full_name = String(formData.get("full_name") || "").trim();
  const role = String(formData.get("role") || "student");

  if (!email || !password) {
    return { error: "الرجاء إدخال البريد الإلكتروني وكلمة المرور." };
  }
  if (password.length < 8) {
    return { error: "كلمة المرور يجب أن تتكون من 8 خانات على الأقل." };
  }

  const admin = getAdminClient();

  // Create user with Admin API
  const { data: userData, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError) {
    return { error: createError.message };
  }

  // Create profile
  if (userData?.user) {
    await admin.from("profiles").upsert({
      id: userData.user.id,
      full_name: full_name || email.split("@")[0],
      role,
    }, { onConflict: "id" });

    await admin.from("startups").upsert({
      owner_id: userData.user.id,
      project_title: "مشروع جديد",
    }, { onConflict: "id" });
  }

  revalidatePath("/admin/users");
  return { success: true };
}
