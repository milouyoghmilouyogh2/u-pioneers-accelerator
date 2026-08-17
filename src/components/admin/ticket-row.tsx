"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/providers/toast-provider";
import { closeSupportTicket } from "@/app/actions/admin";
import { formatDate } from "@/lib/utils";

export function TicketRow({
  id,
  name,
  whatsapp,
  ticketType,
  message,
  status,
  createdAt,
}: {
  id: string;
  name: string;
  whatsapp: string | null;
  ticketType: string;
  message: string;
  status: string;
  createdAt: string;
}) {
  const [pending, startTransition] = useTransition();
  const { showToast } = useToast();
  const router = useRouter();

  return (
    <div className="border-b border-border/60 px-6 py-4 last:border-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <p className="font-medium text-cream">{name}</p>
          <Badge tone="muted">{ticketType}</Badge>
          {status === "closed" && <Badge tone="emerald">مغلق</Badge>}
        </div>
        <span className="text-xs text-muted">{formatDate(createdAt)}</span>
      </div>
      <p className="mt-2 text-sm text-cream-dim">{message}</p>
      <div className="mt-2 flex items-center gap-3">
        {whatsapp && <span className="text-xs text-muted">واتساب: {whatsapp}</span>}
        {status === "open" && (
          <Button
            size="sm"
            variant="secondary"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const result = await closeSupportTicket(id);
                if (result?.error) {
                  showToast(result.error, "error");
                  return;
                }
                showToast("تم إغلاق الطلب.", "success");
                router.refresh();
              })
            }
          >
            <CheckCircle2 className="size-3.5" /> تعليم كمغلق
          </Button>
        )}
      </div>
    </div>
  );
}
