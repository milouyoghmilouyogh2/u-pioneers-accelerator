import { Trophy, Medal } from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";

// Revalidate leaderboard every 5 minutes
export const revalidate = 300;

const MEDAL_COLORS = ["text-gold-400", "text-cream-dim", "text-gold-600"];

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from("leaderboard")
    .select("*")
    .order("progress_percentage", { ascending: false })
    .order("current_step", { ascending: false })
    .limit(50);

  if (error) console.error("Leaderboard query failed:", error.message);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <Badge tone="gold">
              <Trophy className="size-3.5" /> لوحة الصدارة
            </Badge>
            <h1 className="mt-4 text-2xl font-bold text-cream sm:text-3xl">
              رواد الأعمال الأكثر تقدماً
            </h1>
            <p className="mx-auto mt-2 max-w-lg text-sm text-muted">
              ترتيب مباشر بحسب التقدم في مسار الأسلحة الـ16.
            </p>
          </div>

          <div className="card-luxury mt-10 overflow-hidden rounded-2xl">
            {!rows || rows.length === 0 ? (
              <p className="px-6 py-10 text-center text-sm text-muted">
                لا يوجد رواد أعمال بعد. كن أول من يسجل مشروعه!
              </p>
            ) : (
              rows.map((r, i) => (
                <div
                  key={r.id}
                  className="flex items-center gap-4 border-b border-border/60 px-6 py-4 last:border-0"
                >
                  <span
                    className={`flex size-8 items-center justify-center text-sm font-bold ${
                      i < 3 ? MEDAL_COLORS[i] : "text-muted"
                    }`}
                  >
                    {i < 3 ? <Medal className="size-5" /> : i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-cream">{r.full_name}</p>
                    <p className="truncate text-xs text-muted">{r.project_title}</p>
                  </div>
                  <div className="text-end">
                    <p className="text-sm font-bold text-gold-400">
                      {r.progress_percentage}%
                    </p>
                    <p className="text-xs text-muted">
                      سلاح {Math.min(r.current_step ?? 0, 16)} / 16
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
