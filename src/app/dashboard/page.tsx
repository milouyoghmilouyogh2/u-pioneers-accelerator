import { getProfile, getStartup, getWeapons } from "@/lib/dal";
import { DashboardHome } from "@/components/dashboard/dashboard-home";

export default async function DashboardPage() {
  const [profile, startup, weapons] = await Promise.all([
    getProfile(),
    getStartup(),
    getWeapons(),
  ]);

  return <DashboardHome profile={profile} startup={startup} weapons={weapons} />;
}
