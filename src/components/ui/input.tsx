import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-cream-dim">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-cream placeholder:text-muted outline-none transition focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/20",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-cream placeholder:text-muted outline-none transition focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/20",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-cream outline-none transition focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/20",
        className
      )}
      {...props}
    />
  );
}
