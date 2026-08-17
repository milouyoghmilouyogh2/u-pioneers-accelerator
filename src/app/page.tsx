import {
  ShieldCheck,
  TrendingUp,
  Award,
  Users,
  ArrowLeft,
  Rocket,
} from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { TeamSection } from "@/components/marketing/team-section";
import { AlgeriaMap } from "@/components/marketing/algeria-map";
import { WeaponsPile } from "@/components/marketing/weapons-pile";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { Counter } from "@/components/ui/counter";
import { getWeapons } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";

export default async function LandingPage() {
  const supabase = await createClient();
  const [weapons, { count: foundersCount }] = await Promise.all([
    getWeapons(),
    supabase.from("leaderboard").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "رائد أعمال منضم", value: (foundersCount ?? 0) + 500, icon: Users },
    { label: "خطوة تأسيسية موجهة", value: 16, icon: TrendingUp },
    { label: "متوافقة مع القرار الوزاري", value: 1275, icon: ShieldCheck },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
          <AlgeriaMap className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[430px] -translate-x-1/2 -translate-y-1/2 text-emerald-500/40 sm:h-[540px] sm:w-[610px]" />

          <Reveal className="relative mx-auto max-w-4xl text-center">
            <Badge tone="gold" className="mx-auto">
              <ShieldCheck className="size-3.5" /> حاضنة ومسرعة أعمال رقمية معتمدة
            </Badge>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-cream sm:text-5xl md:text-6xl">
              <span className="hero-title-word" style={{ animationDelay: "0ms" }}>
                من فكرتك إلى
              </span>{" "}
              <span
                className="hero-title-word text-gradient-gold"
                style={{ animationDelay: "340ms" }}
              >
                مؤسسة اقتصادية
              </span>
              <br />
              <span className="hero-title-word" style={{ animationDelay: "680ms" }}>
                في 16 خطوة
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream-dim sm:text-lg">
              مساحة العمل التفاعلية الاحترافية لقيادة وتتبع مشاريع التخرج
              الابتكارية لطلبة الجامعات الجزائرية، خطوة بخطوة، متوافقة كلياً
              مع القرار الوزاري 1275 للحصول على وسم &quot;مؤسسة ناشئة&quot;.
            </p>
            <p className="mt-3 text-sm font-medium text-gold-500">
              من كل ولاية، لتحقيق هدف واحد.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/register" variant="dark" size="lg" className="rounded-full">
                ابدأ من هنا <ArrowLeft className="size-4" />
              </ButtonLink>
              <ButtonLink href="/login" variant="secondary" size="lg" className="rounded-full">
                تسجيل الدخول
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={150} className="relative mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className="card-luxury rounded-2xl p-6 text-center">
                <s.icon className="mx-auto size-6 text-gold-400" />
                <p className="mt-3 text-2xl font-bold text-cream">
                  <Counter value={s.value} suffix={s.label === "خطوة تأسيسية موجهة" ? "" : "+"} />
                </p>
                <p className="mt-1 text-xs text-muted">{s.label}</p>
              </div>
            ))}
          </Reveal>
        </section>

        {/* Why 1275 */}
        <section className="bg-dot-grid border-y border-border/60 px-4 py-16 sm:px-6">
          <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:items-center">
            <Reveal>
              <Badge tone="emerald">القرار الوزاري 1275</Badge>
              <h2 className="mt-4 text-2xl font-bold text-cream sm:text-3xl">
                لماذا يهم وسم &quot;مؤسسة ناشئة&quot;؟
              </h2>
              <p className="mt-4 leading-relaxed text-cream-dim">
                القرار الوزاري 1275 يوفر إطاراً استثنائياً للطلبة حاملي
                مشاريع التخرج الابتكارية في الجزائر: إعفاءات ضريبية، مرافقة
                مؤسساتية، وأولوية في برامج التمويل. مسار الـ16 خطوة في
                U-Pioneers مصمم خصيصاً ليجهز ملفك للتقديم على الوسم بثقة.
              </p>
            </Reveal>
            <Reveal delay={120} className="grid grid-cols-2 gap-4">
              {[
                { icon: Award, title: "وسم رسمي", desc: "ملف جاهز لتقديم طلب الوسم" },
                { icon: ShieldCheck, title: "إعفاءات ضريبية", desc: "استفادة من الحوافز القانونية" },
                { icon: TrendingUp, title: "جاهزية استثمارية", desc: "خطة عمل مقنعة للمستثمرين" },
                { icon: Rocket, title: "مرافقة كاملة", desc: "من الفكرة حتى العرض التقديمي" },
              ].map((f) => (
                <div key={f.title} className="card-luxury rounded-xl p-5">
                  <span className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                    <f.icon className="size-5" />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-cream">{f.title}</p>
                  <p className="mt-1 text-xs text-muted">{f.desc}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        <TeamSection />

        {/* Process */}
        <section id="process" className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <Reveal className="text-center">
              <Badge tone="gold" className="mx-auto">مسار الأسلحة الـ16</Badge>
              <h2 className="mt-4 text-2xl font-bold text-cream sm:text-3xl">
                خارطة طريق مدروسة، خطوة بخطوة
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
                كل خطوة (سلاح) تُفتح بعد إنجاز التي تسبقها، مع معرفة موجهة
                ومهمة تطبيقية فورية لمشروعك.
              </p>
            </Reveal>

            <WeaponsPile weapons={weapons} />
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 pb-24 sm:px-6">
          <Reveal className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-700 to-emerald-900 px-6 py-14 text-center shadow-2xl sm:px-14">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              جاهز لتحويل فكرتك إلى مؤسسة حقيقية؟
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-white/75">
              انضم لمئات رواد الأعمال الجامعيين الذين بدأوا مسارهم مع
              U-Pioneers.
            </p>
            <ButtonLink href="/register" variant="dark" size="lg" className="mt-7 rounded-full">
              ابدأ الآن مجاناً <ArrowLeft className="size-4" />
            </ButtonLink>
          </Reveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}
