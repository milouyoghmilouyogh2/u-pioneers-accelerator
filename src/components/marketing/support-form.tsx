"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitSupportTicket, type SupportState } from "@/app/actions/support";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, TriangleAlert } from "lucide-react";

export function SupportForm() {
  const [state, action, pending] = useActionState<SupportState, FormData>(
    submitSupportTicket,
    undefined
  );
  const [ticketType, setTicketType] = useState("general");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-4">
      <Field label="الاسم الكامل">
        <Input name="name" required />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="رقم الواتساب">
          <Input name="whatsapp" placeholder="0555123456" />
        </Field>
        <Field label="نوع الطلب">
          <Select
            name="ticket_type"
            value={ticketType}
            onChange={(e) => setTicketType(e.target.value)}
          >
            <option value="general">استفسار عام</option>
            <option value="technical">دعم تقني</option>
            <option value="partnership">شراكة مؤسساتية</option>
            <option value="WhiteLabel">ترخيص White-Label SaaS</option>
          </Select>
        </Field>
      </div>
      <Field label="رسالتك">
        <Textarea
          name="message"
          rows={4}
          required
          placeholder={
            ticketType === "WhiteLabel"
              ? "اكتب اسم الحاضنة/الجامعة وعدد الرخص السنوية المطلوبة لترخيص المنصة..."
              : "كيف يمكننا مساعدتك؟"
          }
        />
      </Field>

      {state?.error && (
        <p className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-cream">
          <TriangleAlert className="size-4 shrink-0 translate-y-0.5" />
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-cream">
          <CheckCircle2 className="size-4 shrink-0 translate-y-0.5" />
          شكراً لك. تم تسجيل طلبك بنجاح، سنقوم بالرد خلال 48 ساعة.
        </p>
      )}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "جارٍ الإرسال..." : "إرسال الطلب"}
      </Button>
    </form>
  );
}

export function EnterpriseLicenseNote() {
  return (
    <p className="text-xs text-muted">
      لترخيص المنصة كحل White-Label لحاضنتك أو جامعتك، اختر &quot;ترخيص
      White-Label SaaS&quot; من نوع الطلب أعلاه.
    </p>
  );
}
