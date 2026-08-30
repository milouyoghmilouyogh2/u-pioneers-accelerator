import { Lock } from "lucide-react";
import { getAnswers, getProfile, getStartup, getWeapons } from "@/lib/dal";
import { CertificateCanvas } from "@/components/dashboard/certificate-canvas";
import { LockedCertificate } from "@/components/dashboard/locked-certificate";
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
          <LockedCertificate />
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
