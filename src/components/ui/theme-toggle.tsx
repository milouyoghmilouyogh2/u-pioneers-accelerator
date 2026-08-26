"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme, useMounted } from "@/components/providers/theme-provider";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const mounted = useMounted();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="تغيير المظهر"
      className={
        "flex size-9 items-center justify-center rounded-full border border-border bg-surface text-cream-dim transition hover:text-gold-500 " +
        (className ?? "")
      }
    >
      {/* Render nothing theme-specific until mounted, to avoid a hydration mismatch */}
      {mounted ? (
        theme === "dark" ? (
          <Sun className="size-4.5" />
        ) : (
          <Moon className="size-4.5" />
        )
      ) : (
        <Moon className="size-4.5 opacity-0" />
      )}
    </button>
  );
}
