import { createClient } from "@/lib/supabase/server";
import { PaymentRequestRow } from "@/components/admin/payment-request-row";

export default async function AdminPaymentsPage() {
  const supabase = await createClient();

  const { data: requests } = await supabase
    .from("payment_requests")
    .select(
      "*, startups!payment_requests_startup_id_fkey(project_title, profiles!startups_owner_id_fkey(full_name))"
    )
    .order("created_at", { ascending: false });

  const withUrls = await Promise.all(
    (requests ?? []).map(async (r) => {
      const { data } = await supabase.storage
        .from("receipts")
        .createSignedUrl(r.receipt_path, 600);
      return {
        ...r,
        receiptUrl: data?.signedUrl ?? null,
        isPdf: r.receipt_path.toLowerCase().endsWith(".pdf"),
      };
    })
  );

  const pending = withUrls.filter((r) => r.status === "pending");
  const reviewed = withUrls.filter((r) => r.status !== "pending");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-cream">طلبات الدفع</h1>
        <p className="mt-1 text-sm text-muted">
          راجع وصولات التحويل ثم وافق أو ارفض لتفعيل الترقية.
        </p>
      </div>

      <div className="card-luxury overflow-hidden rounded-2xl">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-sm font-semibold text-cream">
            قيد المراجعة ({pending.length})
          </h2>
        </div>
        {pending.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-muted">
            لا توجد طلبات معلّقة حالياً.
          </p>
        ) : (
          pending.map((r) => (
            <PaymentRequestRow
              key={r.id}
              id={r.id}
              studentName={
                (r as unknown as { startups: { profiles: { full_name: string } } })
                  .startups?.profiles?.full_name ?? "—"
              }
              projectTitle={
                (r as unknown as { startups: { project_title: string } }).startups
                  ?.project_title ?? "—"
              }
              status={r.status}
              createdAt={r.created_at}
              receiptUrl={r.receiptUrl}
              isPdf={r.isPdf}
            />
          ))
        )}
      </div>

      {reviewed.length > 0 && (
        <div className="card-luxury overflow-hidden rounded-2xl">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-sm font-semibold text-cream">طلبات تمت مراجعتها</h2>
          </div>
          {reviewed.map((r) => (
            <PaymentRequestRow
              key={r.id}
              id={r.id}
              studentName={
                (r as unknown as { startups: { profiles: { full_name: string } } })
                  .startups?.profiles?.full_name ?? "—"
              }
              projectTitle={
                (r as unknown as { startups: { project_title: string } }).startups
                  ?.project_title ?? "—"
              }
              status={r.status}
              createdAt={r.created_at}
              receiptUrl={r.receiptUrl}
              isPdf={r.isPdf}
            />
          ))}
        </div>
      )}
    </div>
  );
}
