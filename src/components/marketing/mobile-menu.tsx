"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

const LINKS = [
  { href: "/#process", label: "المسار" },
  { href: "/leaderboard", label: "لوحة الصدارة" },
  { href: "/b2b", label: "شركاء ودعم" },
];

export function MobileMenu({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-cream-dim"
        aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
        aria-expanded={open}
      >
        {open ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      {open && (
        <div className="fixed inset-x-0 top-[65px] z-40 border-b border-border bg-ink/95 px-4 py-4 backdrop-blur">
          <nav className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-cream-dim hover:bg-white/5 hover:text-cream"
              >
                {l.label}
              </Link>
            ))}
            {!isLoggedIn && (
              <ButtonLink
                href="/login"
                variant="secondary"
                size="sm"
                className="mt-2"
                onClick={() => setOpen(false)}
              >
                تسجيل الدخول
              </ButtonLink>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
