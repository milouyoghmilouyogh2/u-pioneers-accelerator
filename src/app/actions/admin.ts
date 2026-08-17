"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/dal";

export async function updateWeapon(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const number = Number(formData.get("number"));
  const { error } = await supabase
    .from("weapons")
    .update({
      title: String(formData.get("title") || ""),
      summary: String(formData.get("summary") || ""),
      knowledge: String(formData.get("knowledge") || ""),
      task_prompt: String(formData.get("task_prompt") || ""),
      placeholder: String(formData.get("placeholder") || ""),
    })
    .eq("number", number);

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
  const supabase = await createClient();

  const { error } = await supabase.rpc("review_payment_request", {
    p_request_id: requestId,
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
  const supabase = await createClient();

  const { error } = await supabase
    .from("support_tickets")
    .update({ status: "closed" })
    .eq("id", ticketId);

  if (error) return { error: error.message };
  revalidatePath("/admin/tickets");
  return { success: true };
}

export async function updateSetting(key: string, value: string) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("settings")
    .update({ value })
    .eq("key", key);

  if (error) return { error: error.message };
  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/dashboard/billing");
  return { success: true };
}
