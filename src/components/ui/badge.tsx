import { cn } from "@/lib/utils";

type Tone = "gold" | "emerald" | "muted" | "red";

const TONES: Record<Tone, string> = {
  // Mid-saturation shades read reasonably against both a pale tint (light
  // theme) and a dark tint (dark theme) of the same low-alpha background -
  // the lighter 300/400 shades used previously only worked on dark cards.
  gold: "bg-gold-500/15 text-gold-500 border-gold-500/30",
  emerald: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  muted: "bg-white/5 text-muted border-border",
  red: "bg-red-500/15 text-red-500 border-red-500/30",
};

export function Badge({
  children,
  tone = "muted",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
