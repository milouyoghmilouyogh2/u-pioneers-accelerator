"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, CornerUpLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/input";
import { useToast } from "@/components/providers/toast-provider";
import { closeSupportTicket, replyToSupportTicket } from "@/app/actions/admin";
import { formatDate } from "@/lib/utils";

export function TicketRow({
  id,
  name,
  whatsapp,
  ticketType,
  message,
  status,
  createdAt,
  adminReply,
  repliedAt,
}: {
  id: string;
  name: string;
  whatsapp: string | null;
  ticketType: string;
  message: string;
  status: string;
  createdAt: string;
  adminReply: string | null;
  repliedAt: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const { showToast } = useToast();
  const router = useRouter();

  function handleReply() {
    startTransition(async () => {
      const result = await replyToSupportTicket(id, replyText);
      if (result?.error) {
        showToast(result.error, "error");
        return;
      }
      showToast("تم إرسال الرد بنجاح.", "success");
      setReplyOpen(false);
      setReplyText("");
      router.refresh();
    });
  }

  function handleClose() {
    startTransition(async () => {
      const result = await closeSupportTicket(id);
      if (result?.error) {
        showToast(result.error, "error");
        return;
      }
      showToast("تم إغلاق الطلب.", "success");
      router.refresh();
    });
  }

  return (
    <div className="border-b border-border/60 px-4 py-4 last:border-0 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <p className="font-medium text-cream">{name}</p>
          <Badge tone="muted">{ticketType}</Badge>
          {status === "closed" && <Badge tone="emerald">مغلق</Badge>}
        </div>
        <span className="text-xs text-muted">{formatDate(createdAt)}</span>
      </div>
      <p className="mt-2 text-sm text-cream-dim">{message}</p>
      {whatsapp && <p className="mt-1 text-xs text-muted">واتساب: {whatsapp}</p>}

      {adminReply && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
          <CornerUpLeft className="mt-0.5 size-3.5 shrink-0 text-emerald-400" />
          <div>
            <p className="text-sm text-cream">{adminReply}</p>
            {repliedAt && (
              <p className="mt-1 text-[11px] text-cream-dim">
                {formatDate(repliedAt)}
              </p>
            )}
          </div>
        </div>
      )}

      {replyOpen ? (
        <div className="mt-3 flex flex-col gap-2">
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={3}
            placeholder="اكتب ردك هنا..."
            autoFocus
          />
          <div className="flex gap-2">
            <Button size="sm" disabled={pending} onClick={handleReply}>
              <Send className="size-3.5" /> إرسال الرد
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setReplyOpen(false)}>
              إلغاء
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button size="sm" variant="secondary" onClick={() => setReplyOpen(true)}>
            <CornerUpLeft className="size-3.5" /> {adminReply ? "تعديل الرد" : "الرد على الطلب"}
          </Button>
          {status === "open" && (
            <Button size="sm" variant="ghost" disabled={pending} onClick={handleClose}>
              <CheckCircle2 className="size-3.5" /> تعليم كمغلق
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
