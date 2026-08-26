import { Users, TrendingUp, CreditCard, LifeBuoy } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [{ data: startups }, { count: pendingPayments }, { count: openTickets }] =
    await Promise.all([
      supabase
        .from("startups")
        .select("*")
        .order("progress_percentage", { ascending: false }),
      supabase
        .from("payment_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("support_tickets")
        .select("*", { count: "exact", head: true })
        .eq("status", "open"),
    ]);

  // Get profiles separately to avoid JOIN issues
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, university, whatsapp");
  const profileMap = new Map(profiles?.map((p) => [p.id, p]) ?? []);

  const total = startups?.length ?? 0;
  const graduated = startups?.filter((s) => s.progress_percentage >= 100).length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-cream">نظرة عامة</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="رواد الأعمال" value={total} />
        <StatCard icon={TrendingUp} label="أنهوا المسار" value={graduated} />
        <StatCard icon={CreditCard} label="طلبات دفع معلّقة" value={pendingPayments ?? 0} />
        <StatCard icon={LifeBuoy} label="طلبات دعم مفتوحة" value={openTickets ?? 0} />
      </div>

      <div className="card-luxury overflow-hidden rounded-2xl">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-sm font-semibold text-cream">قائمة المشاريع (CRM)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-start text-xs text-muted">
                <th className="px-6 py-3 text-start font-medium">الطالب</th>
                <th className="px-6 py-3 text-start font-medium">الجامعة</th>
                <th className="px-6 py-3 text-start font-medium">المشروع</th>
                <th className="px-6 py-3 text-start font-medium">التقدم</th>
                <th className="px-6 py-3 text-start font-medium">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {startups?.map((s) => {
                const profile = profileMap.get(s.owner_id);
                return (
                  <tr key={s.id} className="border-b border-border/60 last:border-0">
                    <td className="px-6 py-3 text-cream">
                      {profile?.full_name ?? "—"}
                    </td>
                    <td className="px-6 py-3 text-muted">
                      {profile?.university ?? "—"}
                    </td>
                    <td className="max-w-[220px] truncate px-6 py-3 text-cream-dim">
                      {s.project_title}
                    </td>
                    <td className="px-6 py-3 text-cream-dim">
                      {s.progress_percentage}% (سلاح {Math.min(s.current_step, 16)})
                    </td>
                    <td className="px-6 py-3">
                      {s.is_premium ? (
                        <Badge tone="gold">مفعّل</Badge>
                      ) : (
                        <Badge tone="muted">مجاني</Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) {
  return (
    <div className="card-luxury rounded-xl p-5">
      <Icon className="size-5 text-gold-400" />
      <p className="mt-3 text-2xl font-bold text-cream">{value}</p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}
