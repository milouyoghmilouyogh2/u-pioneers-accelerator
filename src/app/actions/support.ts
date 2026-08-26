"use server";

import { createClient } from "@/lib/supabase/server";
import { supportTicketSchema, validate } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limit";

export type SupportState = { error?: string; success?: boolean } | undefined;

export async function submitSupportTicket(
  _prevState: SupportState,
  formData: FormData
): Promise<SupportState> {
  // Rate limit: 3 tickets per 10 minutes
  const rl = checkRateLimit({ key: "support-ticket", maxAttempts: 3, windowSeconds: 600 });
  if (!rl.success) {
    return { error: `تم حظر المحاولة مؤقتاً. حاول مرة أخرى بعد ${Math.ceil(rl.retryAfter / 60)} دقيقة.` };
  }

  // Validate inputs with zod
  const parsed = validate(supportTicketSchema, {
    name: String(formData.get("name") || "").trim(),
    whatsapp: String(formData.get("whatsapp") || "").trim(),
    ticket_type: String(formData.get("ticket_type") || "general"),
    message: String(formData.get("message") || "").trim(),
  });
  if (!parsed.success) return { error: parsed.error };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("support_tickets").insert({
    name: parsed.data.name,
    whatsapp: parsed.data.whatsapp || null,
    ticket_type: parsed.data.ticket_type,
    message: parsed.data.message,
    user_id: user?.id ?? null,
  });

  if (error) return { error: error.message };
  return { success: true };
}
