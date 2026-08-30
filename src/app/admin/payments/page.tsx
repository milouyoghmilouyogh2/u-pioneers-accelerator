import { requireAdmin } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { PaymentRequestRow } from "@/components/admin/payment-request-row";

export default async function AdminPaymentsPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: requests } = await supabase
    .from("payment_requests")
    .select("*")
    .order("created_at", { ascending: false });

  // Get startups and profiles separately to avoid JOIN issues
  const { data: startups } = await supabase
    .from("startups")
    .select("id, project_title, owner_id");
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name");

  const startupMap = new Map(startups?.map((s) => [s.id, s]) ?? []);
  const profileMap = new Map(profiles?.map((p) => [p.id, p]) ?? []);

  const withUrls = await Promise.all(
    (requests ?? []).map(async (r) => {
      const { data } = await supabase.storage
        .from("receipts")
        .createSignedUrl(r.receipt_path, 600);
      const startup = startupMap.get(r.startup_id);
      const profile = startup ? profileMap.get(startup.owner_id) : null;
      return {
        ...r,
        receiptUrl: data?.signedUrl ?? null,
        isPdf: r.receipt_path.toLowerCase().endsWith(".pdf"),
        studentName: profile?.full_name ?? "—",
        projectTitle: startup?.project_title ?? "—",
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
              studentName={r.studentName}
              projectTitle={r.projectTitle}
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
              studentName={r.studentName}
              projectTitle={r.projectTitle}
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
