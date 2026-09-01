import { redirect } from "next/navigation";
import { getProfile } from "@/lib/dal";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  if (!profile.university || !profile.major || !profile.whatsapp) {
    redirect("/onboarding");
  }

  return (
    <DashboardShell
      profile={{
        full_name: profile.full_name,
        university: profile.university,
        role: profile.role,
      }}
    >
      {children}
    </DashboardShell>
  );
}
