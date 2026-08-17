import Link from "next/link";
import { ShieldCheck, LogOut, LayoutDashboard } from "lucide-react";
import { requireAdmin } from "@/lib/dal";
import { signOutAction } from "@/app/actions/auth";
import { SidebarNav, MobileTabBar } from "@/components/dashboard/app-nav";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-ink/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-cream">
              <ShieldCheck className="size-4" />
            </span>
            <span className="hidden font-bold text-cream sm:inline">لوحة تحكم U-Pioneers</span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="hidden text-sm text-cream-dim sm:inline">
              {admin.full_name}
            </span>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-3.5 py-2 text-sm font-medium text-gold-300 transition hover:bg-gold-500/20 active:scale-95"
            >
              <LayoutDashboard className="size-4 shrink-0" />
              <span className="sm:hidden">حسابي</span>
              <span className="hidden sm:inline">عرض حسابي كرائد أعمال</span>
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="flex size-9 items-center justify-center rounded-full text-cream-dim transition hover:bg-white/5 hover:text-red-300"
                aria-label="تسجيل الخروج"
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
            <SidebarNav variant="admin" />
          </div>
        </aside>

        <main className="min-w-0 flex-1 pb-20 md:pb-6">{children}</main>
      </div>

      <MobileTabBar variant="admin" />
    </div>
  );
}
