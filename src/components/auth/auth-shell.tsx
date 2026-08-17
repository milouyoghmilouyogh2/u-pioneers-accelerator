import Link from "next/link";
import { Rocket } from "lucide-react";

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
    <main className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-border shadow-2xl md:grid-cols-2">
        <div className="hidden flex-col justify-between bg-gradient-to-br from-emerald-900 via-emerald-700 to-emerald-900 p-10 md:flex">
          <Link href="/" className="flex items-center gap-2 text-cream">
            <span className="flex size-9 items-center justify-center rounded-full bg-gold-500/90 text-ink">
              <Rocket className="size-5" />
            </span>
            <span className="text-lg font-bold">U-Pioneers</span>
          </Link>
          <div>
            <p className="text-2xl font-bold leading-relaxed text-cream">
              من فكرتك إلى مؤسسة اقتصادية،
              <br />
              في 16 خطوة مدروسة.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-cream-dim">
              مسرعة أعمال رقمية متوافقة كلياً مع القرار الوزاري 1275 لمرافقة
              مشاريع التخرج الابتكارية.
            </p>
          </div>
          <p className="text-xs text-cream-dim/70">© {new Date().getFullYear()} U-Pioneers Accelerator</p>
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
