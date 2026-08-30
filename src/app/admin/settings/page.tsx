import { requireAdmin } from "@/lib/dal";
import { getSetting } from "@/lib/dal";
import { SettingField } from "@/components/admin/settings-form";
import { getTeamMembers } from "@/app/actions/team";
import { TeamMemberCard, AddTeamMemberCard } from "@/components/admin/team-member-card";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const [waLink, organizerNumber, rip] = await Promise.all([
    getSetting("whatsapp_group_link"),
    getSetting("organizer_whatsapp_number"),
    getSetting("baridimob_rip"),
  ]);

  const teamMembers = await getTeamMembers();

  return (
    <div className="flex flex-col gap-8">
      {/* General Settings */}
      <div>
        <h1 className="text-2xl font-bold text-cream">الإعدادات العامة</h1>
        <p className="mt-1 text-sm text-muted">
          تُطبَّق هذه الإعدادات فوراً على كامل المنصة.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SettingField
          settingKey="whatsapp_group_link"
          label="رابط مجموعة الواتساب الرسمية"
          defaultValue={waLink ?? ""}
        />
        <SettingField
          settingKey="organizer_whatsapp_number"
          label="رقم واتساب المنظمين (لتأكيد الدفع)"
          defaultValue={organizerNumber ?? ""}
          hint="بصيغة دولية بدون + أو رموز، مثال: 213xxxxxxxxx"
        />
        <SettingField
          settingKey="baridimob_rip"
          label="رقم RIP لاستقبال التحويلات (BaridiMob/CCP)"
          defaultValue={rip ?? ""}
        />
      </div>

      {/* Team Members */}
      <div>
        <h2 className="text-xl font-bold text-cream">أعضاء الفريق</h2>
        <p className="mt-1 text-sm text-muted">
          إدارة أعضاء فريق العمل الذين يظهرون في صفحة &quot;من نحن&quot;.
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
          <AddTeamMemberCard />
        </div>
      </div>
    </div>
  );
}
