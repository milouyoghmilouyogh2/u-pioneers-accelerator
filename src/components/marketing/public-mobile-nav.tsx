"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, LifeBuoy, LayoutDashboard, LogIn, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function PublicMobileNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname();

  // Dashboard and admin sections already render their own contextual bottom nav.
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    return null;
  }

  const items = [
    { href: "/", label: "الرئيسية", icon: Home },
    { href: "/aboutus", label: "من نحن", icon: Users },
    { href: "/leaderboard", label: "الصدارة", icon: Trophy },
    { href: "/b2b", label: "الدعم", icon: LifeBuoy },
    isLoggedIn
      ? { href: "/dashboard", label: "لوحتي", icon: LayoutDashboard }
      : { href: "/login", label: "الدخول", icon: LogIn },
  ];

  return (
    <>
      {/* Reserves space in normal flow so fixed nav never covers page content */}
      <div aria-hidden className="h-16 md:hidden" />
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-surface/95 backdrop-blur md:hidden">
        {items.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px]",
                active ? "text-gold-500" : "text-cream-dim"
              )}
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
