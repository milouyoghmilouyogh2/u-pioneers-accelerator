import { getAnswers, getStartup, getWeapons } from "@/lib/dal";
import { WeaponsGrid } from "@/components/dashboard/weapons-grid";

export const revalidate = 60;

export default async function WeaponsPage() {
  const startup = await getStartup();
  const [weapons, answers] = await Promise.all([
    getWeapons(),
    getAnswers(startup.id),
  ]);

  const answersMap = Object.fromEntries(
    answers.map((a) => [a.weapon_number, a.answer])
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-cream">مسار الأسلحة الـ16</h1>
        <p className="mt-1 text-sm text-muted">
          كل سلاح يُفتح بعد إنجاز الذي يسبقه. اضغط على أي سلاح مفتوح لبدء
          العمل عليه.
        </p>
      </div>

      <WeaponsGrid
        weapons={weapons}
        currentStep={startup.current_step}
        answers={answersMap}
      />
    </div>
  );
}
