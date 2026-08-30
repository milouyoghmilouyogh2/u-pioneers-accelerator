"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DASHBOARD_NAV_ITEMS, ADMIN_NAV_ITEMS } from "./nav-items";

type Variant = "dashboard" | "admin";

function isActive(pathname: string, href: string) {
  if (href === "/dashboard" || href === "/admin") return pathname === href;
  return pathname.startsWith(href);
}

export function SidebarNav({ variant }: { variant: Variant }) {
  const pathname = usePathname();
  const items = variant === "admin" ? ADMIN_NAV_ITEMS : DASHBOARD_NAV_ITEMS;
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm transition",
              active
                ? "bg-gold-500/15 text-gold-500 font-medium"
                : "text-cream-dim hover:bg-white/5 hover:text-cream"
            )}
          >
            <item.icon className="size-4.5 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileTabBar({ variant }: { variant: Variant }) {
  const pathname = usePathname();
  const items = variant === "admin" ? ADMIN_NAV_ITEMS : DASHBOARD_NAV_ITEMS;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-surface/95 backdrop-blur md:hidden">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] leading-tight min-w-0",
              active ? "text-gold-500" : "text-cream-dim"
            )}
          >
            <item.icon className="size-4 shrink-0" />
            <span className="truncate w-full text-center">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
