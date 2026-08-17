"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X, ExternalLink } from "lucide-react";
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
}: {
  id: string;
  studentName: string;
  projectTitle: string;
  status: string;
  createdAt: string;
  receiptUrl: string | null;
}) {
  const [pending, startTransition] = useTransition();
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
    <div className="flex flex-col gap-3 border-b border-border/60 px-6 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium text-cream">{studentName}</p>
        <p className="text-xs text-muted">{projectTitle}</p>
        <p className="mt-1 text-xs text-muted">{formatDate(createdAt)}</p>
      </div>
      <div className="flex items-center gap-2">
        {receiptUrl && (
          <a
            href={receiptUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs text-gold-400 hover:underline"
          >
            <ExternalLink className="size-3.5" /> عرض الوصل
          </a>
        )}
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
    </div>
  );
}
