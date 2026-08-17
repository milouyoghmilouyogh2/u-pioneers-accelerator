import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "dark";
type Size = "sm" | "md" | "lg";

const VARIANT_STYLES: Record<Variant, string> = {
  primary:
    "bg-gradient-to-l from-gold-400 to-gold-600 text-ink font-semibold hover:brightness-110 shadow-lg shadow-gold-600/20",
  secondary:
    "bg-surface-raised border border-border text-cream hover:border-gold-500/50 hover:text-gold-500",
  ghost: "text-cream-dim hover:text-gold-500",
  danger: "bg-red-600/90 text-white hover:bg-red-600",
  dark: "bg-[#12130f] text-white font-semibold hover:bg-black shadow-lg shadow-black/20",
};

const SIZE_STYLES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-7 py-3.5 text-base rounded-xl",
};

const BASE =
  "inline-flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:pointer-events-none";

type ButtonProps = ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(BASE, VARIANT_STYLES[variant], SIZE_STYLES[size], className)}
      {...props}
    />
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(BASE, VARIANT_STYLES[variant], SIZE_STYLES[size], className)}
      {...props}
    />
  );
}
