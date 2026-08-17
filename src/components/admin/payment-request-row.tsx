"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X, FileText, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/providers/toast-provider";
import { reviewPaymentRequest } from "@/app/actions/admin";
import { formatDate } from "@/lib/utils";

export function PaymentRequestRow({
  id,
  studentName,
  projectTitle,
  status,
  createdAt,
  receiptUrl,
  isPdf,
}: {
  id: string;
  studentName: string;
  projectTitle: string;
  status: string;
  createdAt: string;
  receiptUrl: string | null;
  isPdf: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  function handleReview(approve: boolean) {
    startTransition(async () => {
      const result = await reviewPaymentRequest(id, approve);
      if (result?.error) {
        showToast(result.error, "error");
        return;
      }
      showToast(approve ? "تمت الموافقة على الطلب." : "تم رفض الطلب.", "success");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-3 border-b border-border/60 px-4 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex items-center gap-3">
        {receiptUrl &&
          (isPdf ? (
            <a
              href={receiptUrl}
              target="_blank"
              rel="noreferrer"
              className="flex size-16 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-border bg-surface text-gold-400"
            >
              <FileText className="size-6" />
              <span className="text-[10px]">PDF</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="group relative size-16 shrink-0 overflow-hidden rounded-lg border border-border"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={receiptUrl} alt="وصل التحويل" className="size-full object-cover" />
              <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                <Maximize2 className="size-4 text-white" />
              </span>
            </button>
          ))}
        <div className="min-w-0">
          <p className="truncate font-medium text-cream">{studentName}</p>
          <p className="truncate text-xs text-muted">{projectTitle}</p>
          <p className="mt-1 text-xs text-muted">{formatDate(createdAt)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {status === "pending" ? (
          <>
            <Button size="sm" disabled={pending} onClick={() => handleReview(true)}>
              <Check className="size-4" /> موافقة
            </Button>
            <Button
              size="sm"
              variant="danger"
              disabled={pending}
              onClick={() => handleReview(false)}
            >
              <X className="size-4" /> رفض
            </Button>
          </>
        ) : status === "approved" ? (
          <Badge tone="emerald">تمت الموافقة</Badge>
        ) : (
          <Badge tone="red">مرفوض</Badge>
        )}
      </div>

      {lightboxOpen && receiptUrl && !isPdf && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={receiptUrl}
            alt="وصل التحويل"
            className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
          />
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute end-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white"
            aria-label="إغلاق"
          >
            <X className="size-5" />
          </button>
        </div>
      )}
    </div>
  );
}
