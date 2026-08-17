import { Handshake, CornerUpLeft, Clock } from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Badge } from "@/components/ui/badge";
import { SupportForm, EnterpriseLicenseNote } from "@/components/marketing/support-form";
import { getUser } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export default async function B2BPage() {
  const user = await getUser();
  let myTickets: Array<{
    id: string;
    message: string;
    created_at: string;
    admin_reply: string | null;
    replied_at: string | null;
  }> = [];

  if (user) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("support_tickets")
      .select("id, message, created_at, admin_reply, replied_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    myTickets = data ?? [];
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <Badge tone="emerald">
              <Handshake className="size-3.5" /> شركاء ودعم
            </Badge>
            <h1 className="mt-4 text-2xl font-bold text-cream sm:text-3xl">
              تواصل معنا
            </h1>
            <p className="mx-auto mt-2 max-w-lg text-sm text-muted">
              للدعم التقني، الشراكات المؤسساتية، أو ترخيص المنصة كحل
              White-Label لحاضنتك أو جامعتك.
            </p>
          </div>

          <div className="card-luxury mt-10 rounded-2xl p-6 sm:p-8">
            <SupportForm />
            <div className="mt-4">
              <EnterpriseLicenseNote />
            </div>
          </div>

          {myTickets.length > 0 && (
            <div className="card-luxury mt-6 rounded-2xl p-6 sm:p-8">
              <h2 className="text-sm font-semibold text-cream">طلباتي السابقة</h2>
              <div className="mt-4 flex flex-col gap-4">
                {myTickets.map((t) => (
                  <div key={t.id} className="rounded-lg border border-border p-4">
                    <p className="text-sm text-cream-dim">{t.message}</p>
                    <p className="mt-1 text-xs text-muted">{formatDate(t.created_at)}</p>
                    {t.admin_reply ? (
                      <div className="mt-3 flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
                        <CornerUpLeft className="mt-0.5 size-3.5 shrink-0 text-emerald-400" />
                        <div>
                          <p className="text-sm text-emerald-100">{t.admin_reply}</p>
                          {t.replied_at && (
                            <p className="mt-1 text-[11px] text-emerald-300/70">
                              {formatDate(t.replied_at)}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
                        <Clock className="size-3.5" /> بانتظار رد الفريق
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
