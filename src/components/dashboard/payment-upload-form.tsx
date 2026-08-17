"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Copy, MessageCircle, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/providers/toast-provider";
import { submitPaymentRequest } from "@/app/actions/payments";

export function CopyRip({ rip }: { rip: string }) {
  const { showToast } = useToast();
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(rip);
        showToast("تم نسخ رقم RIP الخاص بالمسرعة بنجاح!", "success");
      }}
      className="flex w-full items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 text-start"
    >
      <span className="font-mono text-sm tracking-wider text-cream">{rip}</span>
      <Copy className="size-4 text-gold-400" />
    </button>
  );
}

export function WhatsappConfirmButton({
  organizerNumber,
  projectTitle,
  studentName,
}: {
  organizerNumber: string;
  projectTitle: string;
  studentName: string;
}) {
  function handleClick() {
    const text = `مرحباً مسرعة U-Pioneers، لقد قمت بتحويل رسوم ترقية الحساب للمستوى المتقدم للمشروع الناشئ: [${projectTitle}] باسم الطالب: [${studentName}]. مرفق صورة وصل التحويل المالي لتفعيل الخدمة يدوياً بعد المراجعة. شكراً لكم!`;
    window.open(
      `https://api.whatsapp.com/send?phone=${organizerNumber}&text=${encodeURIComponent(text)}`,
      "_blank"
    );
  }
  return (
    <Button type="button" variant="secondary" onClick={handleClick}>
      <MessageCircle className="size-4" /> تأكيد عبر واتساب
    </Button>
  );
}

export function PaymentUploadForm() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const { showToast } = useToast();
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await submitPaymentRequest(formData);
      if (result.error) {
        showToast(result.error, "error");
        return;
      }
      showToast(
        "تم إرسال طلب الترقية ووصل الدفع بنجاح! سيقوم المشرف بمراجعة طلبك خلال 24 ساعة.",
        "success"
      );
      formRef.current?.reset();
      setFileName(null);
      router.refresh();
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-3">
      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-border px-4 py-6 text-center hover:border-gold-500/50">
        <UploadCloud className="size-6 text-gold-400" />
        <span className="text-sm text-cream-dim">
          {fileName ?? "اضغط لرفع صورة وصل التحويل أو لقطة الشاشة"}
        </span>
        <input
          type="file"
          name="receipt"
          accept="image/*,.pdf"
          required
          className="hidden"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        />
      </label>
      <Button type="submit" disabled={pending}>
        {pending ? "جارٍ الإرسال..." : "إرسال طلب الترقية"}
      </Button>
    </form>
  );
}
