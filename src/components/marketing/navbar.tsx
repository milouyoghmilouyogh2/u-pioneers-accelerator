import Link from "next/link";
import { Rocket } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getUser } from "@/lib/dal";
import { MobileMenu } from "./mobile-menu";

const LINKS = [
  { href: "/#process", label: "المسار" },
  { href: "/leaderboard", label: "لوحة الصدارة" },
  { href: "/b2b", label: "شركاء ودعم" },
  { href: "/terms", label: "شروط الاستخدام" },
  { href: "/privacy", label: "الخصوصية" },
];

export async function Navbar() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-ink/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-ink">
            <Rocket className="size-5" />
          </span>
          <span className="text-lg font-bold text-cream">U-Pioneers</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-cream-dim transition hover:text-gold-500"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle className="hidden sm:flex" />
          {user ? (
            <ButtonLink href="/dashboard" size="sm">
              لوحة التحكم
            </ButtonLink>
          ) : (
            <>
              <ButtonLink href="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">
                تسجيل الدخول
              </ButtonLink>
              <ButtonLink href="/register" size="sm">
                سجل مشروعك
              </ButtonLink>
            </>
          )}
          <MobileMenu isLoggedIn={!!user} />
        </div>
      </nav>
    </header>
  );
}
