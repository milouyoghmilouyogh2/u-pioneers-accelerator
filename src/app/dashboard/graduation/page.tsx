import { Lock } from "lucide-react";
import { getAnswers, getProfile, getStartup, getWeapons } from "@/lib/dal";
import { CertificateCanvas } from "@/components/dashboard/certificate-canvas";
import { ExecutiveSummary } from "@/components/dashboard/executive-summary";
import { ButtonLink } from "@/components/ui/button";

export default async function GraduationPage() {
  const [profile, startup, weapons] = await Promise.all([
    getProfile(),
    getStartup(),
    getWeapons(),
  ]);
  const answers = await getAnswers(startup.id);
  const answersMap = Object.fromEntries(
    answers.map((a) => [a.weapon_number, a.answer])
  );
  const answeredCount = answers.length;
  const isUnlocked = startup.progress_percentage >= 100;

  if (!isUnlocked) {
    return (
      <div className="card-luxury flex flex-col items-center gap-4 rounded-2xl p-12 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-white/5 text-muted">
          <Lock className="size-6" />
        </span>
        <h1 className="text-xl font-bold text-cream">بوابة التخرج مغلقة حالياً</h1>
        <p className="max-w-md text-sm text-muted">
          أنجزت {answeredCount} من 16 سلاحاً. أكمل باقي الأسلحة لفتح الشهادة
          والملف التنفيذي لمشروعك.
        </p>
        <ButtonLink href="/dashboard/weapons" className="mt-2">
          متابعة المسار
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 print:gap-4">
      <div className="print:hidden">
        <h1 className="text-2xl font-bold text-cream">تهانينا، {profile.full_name}!</h1>
        <p className="mt-1 text-sm text-muted">
          أنجزت مسار الأسلحة الـ16 بنجاح لمشروع &quot;{startup.project_title}&quot;
        </p>
      </div>

      <div className="print:hidden">
        {startup.is_premium ? (
          <CertificateCanvas studentName={profile.full_name} projectTitle={startup.project_title} isPremium={true} />
        ) : (
          <div className="relative mx-auto max-w-2xl">
            {/* Blurred certificate — shape visible, text unreadable */}
            <div className="w-full rounded-xl border-4 border-[#0f5132] bg-[#fdfbf7] p-8 opacity-60 blur-[2px] select-none pointer-events-none">
              <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full border-2 border-[#c5a03c] bg-[#0b2e1b]">
                <span className="text-lg font-bold text-[#c5a03c]">U</span>
              </div>
              <div className="h-8 w-72 mx-auto rounded bg-[#0f5132]/20 mb-3"></div>
              <div className="h-4 w-56 mx-auto rounded bg-[#c5a03c]/30 mb-8"></div>
              <div className="h-6 w-48 mx-auto rounded bg-[#071e12]/15 mb-3"></div>
              <div className="h-px w-40 mx-auto bg-[#c5a03c]/30 mb-6"></div>
              <div className="h-3 w-80 mx-auto rounded bg-[#648170]/20 mb-2"></div>
              <div className="h-3 w-72 mx-auto rounded bg-[#648170]/20 mb-8"></div>
              <div className="h-5 w-56 mx-auto rounded bg-[#0f5132]/15 mb-4"></div>
              <div className="h-3 w-32 mx-auto rounded bg-[#a3bdae]/30"></div>
            </div>
            {/* Lock badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 rounded-lg bg-black/50 px-3 py-2 backdrop-blur-sm">
              <Lock className="size-4 text-gold-400" />
              <span className="text-xs font-semibold text-white">مقفل</span>
            </div>
            {/* Download button */}
            <div className="mt-4 flex justify-center">
              <button className="flex items-center gap-2 rounded-xl bg-gradient-to-l from-gold-400 to-gold-600 px-6 py-3 text-sm font-bold text-ink shadow-lg">
                <Lock className="size-4" /> تحميل الشهادة
              </button>
            </div>
          </div>
        )}
      </div>

      <ExecutiveSummary
        projectTitle={startup.project_title}
        weapons={weapons}
        answers={startup.is_premium ? answersMap : {}}
        isPremium={startup.is_premium}
      />
    </div>
  );
}
