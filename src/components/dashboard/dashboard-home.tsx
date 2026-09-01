"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";
import { ProgressRing } from "./progress-ring";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

export function DashboardHome() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, startupRes, weaponsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("startups").select("*").eq("owner_id", user.id).single(),
        supabase.from("weapons").select("*").order("number", { ascending: true }),
      ]);

      setData({
        profile: profileRes.data,
        startup: startupRes.data,
        weapons: weaponsRes.data || [],
      });
      setLoading(false);
    }
    fetch();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="size-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" /></div>;

  if (!data) return null;

  const { profile, startup, weapons } = data;
  const isDone = startup.current_step > 16;
  const focusWeapon = !isDone ? weapons[startup.current_step - 1] : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-cream">
          أهلاً بك، {profile.full_name.split(" ")[0] || profile.full_name}
        </h1>
        <p className="mt-1 text-sm text-muted">{startup.project_title}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card-luxury flex flex-col items-center justify-center rounded-2xl p-8">
          <ProgressRing percentage={startup.progress_percentage} />
          <p className="mt-4 text-sm text-cream-dim">
            السلاح {Math.min(startup.current_step, 16)} / 16
          </p>
        </div>

        <div className="card-luxury rounded-2xl p-8 lg:col-span-2">
          {isDone ? (
            <>
              <Badge tone="gold">
                <Sparkles className="size-3.5" /> لقد فعلت ذلك!
              </Badge>
              <h2 className="mt-4 text-xl font-bold text-cream">
                تهانينا! لقد أنهيت مسار الأسلحة الـ16 بنجاح
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-cream-dim">
                مشروعك الريادي ناضج ومطابق للقرار 1275. اذهب فوراً لبوابة
                التخرج للحصول على الشهادة والملف التنفيذي.
              </p>
              <ButtonLink href="/dashboard/graduation" size="lg" className="mt-6">
                الذهاب لبوابة التخرج <ArrowLeft className="size-4" />
              </ButtonLink>
            </>
          ) : (
            <>
              <Badge tone="emerald">
                <ShieldCheck className="size-3.5" /> السلاح النشط الحالي {startup.current_step} / 16
              </Badge>
              <h2 className="mt-4 text-xl font-bold text-cream">
                {focusWeapon?.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-cream-dim">
                {focusWeapon?.summary}
              </p>
              <ButtonLink href="/dashboard/weapons" size="lg" className="mt-6">
                أكمل هذا السلاح الآن <ArrowLeft className="size-4" />
              </ButtonLink>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="الجامعة" value={profile.university} />
        <StatCard label="التخصص" value={profile.major} />
        <StatCard
          label="حالة الحساب"
          value={startup.is_premium ? "مفعّل — النسخة الاحترافية" : "النسخة المجانية"}
        />
      </div>

      <div className="card-luxury rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-cream">مسار الأسلحة الـ16</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {weapons.map((w: any) => {
            const state =
              w.number < startup.current_step
                ? "done"
                : w.number === startup.current_step
                  ? "active"
                  : "locked";
            return (
              <Link
                key={w.number}
                href="/dashboard/weapons"
                className={
                  "flex size-9 items-center justify-center rounded-full border text-xs font-bold transition " +
                  (state === "done"
                    ? "border-emerald-500/50 bg-emerald-500/15 text-cream"
                    : state === "active"
                      ? "border-gold-500/60 bg-gold-500/20 text-cream"
                      : "border-border text-muted")
                }
                title={w.title}
              >
                {w.number}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-luxury rounded-xl p-5">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 truncate text-sm font-medium text-cream">{value}</p>
    </div>
  );
}
