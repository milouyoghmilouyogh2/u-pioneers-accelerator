import { requireAdmin } from "@/lib/dal";
import { getWeapons } from "@/lib/dal";
import { WeaponsCmsEditor } from "@/components/admin/weapons-cms-editor";

export default async function AdminWeaponsPage() {
  await requireAdmin();
  const weapons = await getWeapons();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-cream">محتوى الأسلحة الـ16</h1>
        <p className="mt-1 text-sm text-muted">
          تعديل مباشر لمحتوى المنهج يظهر فوراً لكل رواد الأعمال.
        </p>
      </div>
      <WeaponsCmsEditor weapons={weapons} />
    </div>
  );
}
