"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Copy,
  MessageCircle,
  UploadCloud,
  CheckCircle2,
  FileText,
  X,
} from "lucide-react";
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
  const [file, setFile] = useState<File | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const router = useRouter();

  const isPdf = file?.type === "application/pdf";

  const previewUrl = useMemo(() => {
    if (!file || isPdf) return null;
    return URL.createObjectURL(file);
  }, [file, isPdf]);

  // Release the object URL once it's replaced or the component unmounts.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFileChange(selected: File | null) {
    setFile(selected);
  }

  function clearFile() {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }

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
      setFile(null);
      router.refresh();
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-3">
      {/* The <input> must stay mounted at all times - if it unmounts when a
          file is selected, its FileList is lost and the form submits empty. */}
      <label
        className={
          file
            ? "relative flex cursor-pointer items-center gap-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3"
            : "flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-border px-4 py-6 text-center hover:border-gold-500/50"
        }
      >
        {file ? (
          <>
            {isPdf ? (
              <span className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-gold-400">
                <FileText className="size-6" />
              </span>
            ) : (
              previewUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="معاينة وصل التحويل"
                  className="size-12 shrink-0 rounded-lg border border-border object-cover"
                />
              )
            )}
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-200">
                <CheckCircle2 className="size-4 shrink-0" />
                تم اختيار الملف بنجاح
              </p>
              <p className="truncate text-xs text-emerald-300/80">{file.name}</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                clearFile();
              }}
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-emerald-300 hover:bg-white/10"
              aria-label="إزالة الملف"
            >
              <X className="size-4" />
            </button>
          </>
        ) : (
          <>
            <UploadCloud className="size-6 text-gold-400" />
            <span className="text-sm text-cream-dim">
              اضغط لرفع صورة وصل التحويل أو لقطة الشاشة
            </span>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          name="receipt"
          accept="image/*,.pdf"
          required
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
        />
      </label>
      <Button type="submit" disabled={pending || !file}>
        {pending ? "جارٍ الإرسال..." : "إرسال طلب الترقية"}
      </Button>
    </form>
  );
}
