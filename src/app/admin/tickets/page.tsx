import { requireAdmin } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { TicketRow } from "@/components/admin/ticket-row";

export default async function AdminTicketsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: tickets } = await supabase
    .from("support_tickets")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-cream">طلبات الدعم والشراكات</h1>
        <p className="mt-1 text-sm text-muted">
          رسائل واردة من نموذج الدعم وصفحة الشركاء (B2B).
        </p>
      </div>

      <div className="card-luxury overflow-hidden rounded-2xl">
        {!tickets || tickets.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-muted">
            لا توجد طلبات حالياً.
          </p>
        ) : (
          tickets.map((t) => (
            <TicketRow
              key={t.id}
              id={t.id}
              name={t.name}
              whatsapp={t.whatsapp}
              ticketType={t.ticket_type}
              message={t.message}
              status={t.status}
              createdAt={t.created_at}
              adminReply={t.admin_reply}
              repliedAt={t.replied_at}
            />
          ))
        )}
      </div>
    </div>
  );
}
