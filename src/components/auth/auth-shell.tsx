import Link from "next/link";
import { Rocket } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">
      <ThemeToggle className="absolute end-4 top-4 sm:end-6 sm:top-6" />
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-border shadow-2xl md:grid-cols-2">
        {/* This panel is always a dark emerald gradient regardless of site
            theme, so its text stays white/light explicitly rather than
            following the theme-dependent cream token. */}
        <div className="hidden flex-col justify-between bg-gradient-to-br from-emerald-900 via-emerald-700 to-emerald-900 p-10 md:flex">
          <Link href="/" className="flex items-center gap-2 text-white">
            <span className="flex size-9 items-center justify-center rounded-full bg-gold-500/90 text-emerald-950">
              <Rocket className="size-5" />
            </span>
            <span className="text-lg font-bold">U-Pioneers</span>
          </Link>
          <div>
            <p className="text-2xl font-bold leading-relaxed text-white">
              من فكرتك إلى مؤسسة اقتصادية،
              <br />
              في 16 خطوة مدروسة.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              مسرعة أعمال رقمية متوافقة كلياً مع القرار الوزاري 1275 لمرافقة
              مشاريع التخرج الابتكارية.
            </p>
          </div>
          <p className="text-xs text-white/50">© {new Date().getFullYear()} U-Pioneers Accelerator</p>
        </div>
        <div className="card-luxury flex flex-col justify-center p-8 sm:p-10">
          <h1 className="text-2xl font-bold text-cream">{title}</h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </main>
  );
}
