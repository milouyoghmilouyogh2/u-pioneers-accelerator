import Link from "next/link";
import { redirect } from "next/navigation";
import { Rocket, LogOut } from "lucide-react";
import { getProfile } from "@/lib/dal";
import { signOutAction } from "@/app/actions/auth";
import { SidebarNav, MobileTabBar } from "@/components/dashboard/app-nav";
import { initialsOf } from "@/lib/utils";

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
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-ink/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-ink">
              <Rocket className="size-4" />
            </span>
            <span className="font-bold text-cream">U-Pioneers</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden text-end sm:block">
              <p className="text-sm font-medium text-cream">{profile.full_name}</p>
              <p className="text-xs text-muted">{profile.university}</p>
            </div>
            <span className="flex size-9 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10 text-sm font-bold text-gold-300">
              {initialsOf(profile.full_name || "؟")}
            </span>
            <form action={signOutAction}>
              <button
                type="submit"
                className="flex size-9 items-center justify-center rounded-full text-cream-dim transition hover:bg-white/5 hover:text-red-300"
                aria-label="تسجيل الخروج"
                title="تسجيل الخروج"
              >
                <LogOut className="size-4.5" />
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6">
        <aside className="hidden w-60 shrink-0 md:block">
          <div className="card-luxury sticky top-20 rounded-2xl p-3">
            <SidebarNav variant="dashboard" />
          </div>
        </aside>

        <main className="min-w-0 flex-1 pb-20 md:pb-6">{children}</main>
      </div>

      <MobileTabBar variant="dashboard" />
    </div>
  );
}
