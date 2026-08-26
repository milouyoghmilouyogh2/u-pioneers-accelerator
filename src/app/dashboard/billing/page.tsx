import { CheckCircle2, Clock, XCircle, FileText } from "lucide-react";
import { getProfile, getSetting, getStartup } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import {
  CopyRip,
  PaymentUploadForm,
  WhatsappConfirmButton,
} from "@/components/dashboard/payment-upload-form";
import { formatDate } from "@/lib/utils";

export default async function BillingPage() {
  const [profile, startup, rip, organizerNumber] = await Promise.all([
    getProfile(),
    getStartup(),
    getSetting("baridimob_rip"),
    getSetting("organizer_whatsapp_number"),
  ]);

  const supabase = await createClient();
  const { data: requestsRaw } = await supabase
    .from("payment_requests")
    .select("*")
    .eq("startup_id", startup.id)
    .order("created_at", { ascending: false });

  const requests = await Promise.all(
    (requestsRaw ?? []).map(async (r) => {
      const isPdf = r.receipt_path.toLowerCase().endsWith(".pdf");
      const { data } = await supabase.storage
        .from("receipts")
        .createSignedUrl(r.receipt_path, 600);
      return { ...r, receiptUrl: data?.signedUrl ?? null, isPdf };
    })
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-cream">الترقية والدفع</h1>
        <p className="mt-1 text-sm text-muted">
          النسخة الاحترافية تفتح الملف التنفيذي القابل للطباعة وميزات إضافية.
        </p>
      </div>

      {startup.is_premium ? (
        <div className="card-luxury flex items-center gap-4 rounded-2xl p-8">
          <CheckCircle2 className="size-8 text-emerald-400" />
          <div>
            <p className="font-semibold text-cream">حسابك مفعّل بالنسخة الاحترافية</p>
            <p className="text-sm text-muted">
              يمكنك الآن الوصول لكافة ميزات المسرعة المتقدمة.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card-luxury rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-cream">خطوات الترقية اليدوية</h2>
            <ol className="mt-4 flex flex-col gap-4 text-sm text-cream-dim">
              <li>
                <span className="font-medium text-gold-400">1.</span> حوّل رسوم
                الترقية عبر BaridiMob/CCP إلى الحساب التالي:
                {rip && <div className="mt-2"><CopyRip rip={rip} /></div>}
              </li>
              <li>
                <span className="font-medium text-gold-400">2.</span> ارفع صورة
                وصل التحويل في النموذج المجاور.
              </li>
              <li>
                <span className="font-medium text-gold-400">3.</span> أكّد
                الطلب عبر واتساب لتسريع المراجعة (اختياري).
                {organizerNumber && (
                  <div className="mt-2">
                    <WhatsappConfirmButton
                      organizerNumber={organizerNumber}
                      projectTitle={startup.project_title}
                      studentName={profile.full_name}
                    />
                  </div>
                )}
              </li>
            </ol>
          </div>

          <div className="card-luxury rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-cream">رفع وصل التحويل</h2>
            <div className="mt-4">
              <PaymentUploadForm />
            </div>
          </div>
        </div>
      )}

      {requests.length > 0 && (
        <div className="card-luxury rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-cream">طلبات سابقة</h2>
          <p className="mt-1 text-xs text-muted">
            هذه صورة الوصل الذي رفعته، للتأكد من وصوله بنجاح.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            {requests.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-3 rounded-lg border border-border px-4 py-3"
              >
                {r.receiptUrl &&
                  (r.isPdf ? (
                    <a
                      href={r.receiptUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex size-12 shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg border border-border bg-surface text-gold-400"
                    >
                      <FileText className="size-5" />
                      <span className="text-[9px]">PDF</span>
                    </a>
                  ) : (
                    <a href={r.receiptUrl} target="_blank" rel="noreferrer">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={r.receiptUrl}
                        alt="وصل التحويل الذي رفعته"
                        className="size-12 shrink-0 rounded-lg border border-border object-cover"
                      />
                    </a>
                  ))}
                <span className="flex-1 text-sm text-cream-dim">
                  {formatDate(r.created_at)}
                </span>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "approved")
    return (
      <Badge tone="emerald">
        <CheckCircle2 className="size-3.5" /> تمت الموافقة
      </Badge>
    );
  if (status === "rejected")
    return (
      <Badge tone="red">
        <XCircle className="size-3.5" /> مرفوض
      </Badge>
    );
  return (
    <Badge tone="gold">
      <Clock className="size-3.5" /> قيد المراجعة
    </Badge>
  );
}
