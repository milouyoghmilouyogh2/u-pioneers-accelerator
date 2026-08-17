"use server";

import { createClient } from "@/lib/supabase/server";

export type SupportState = { error?: string; success?: boolean } | undefined;

export async function submitSupportTicket(
  _prevState: SupportState,
  formData: FormData
): Promise<SupportState> {
  const name = String(formData.get("name") || "").trim();
  const whatsapp = String(formData.get("whatsapp") || "").trim();
  const ticket_type = String(formData.get("ticket_type") || "general");
  const message = String(formData.get("message") || "").trim();

  if (!name || !message) {
    return { error: "الرجاء تعبئة الاسم والرسالة." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("support_tickets").insert({
    name,
    whatsapp: whatsapp || null,
    ticket_type,
    message,
    user_id: user?.id ?? null,
  });

  if (error) return { error: error.message };
  return { success: true };
}
