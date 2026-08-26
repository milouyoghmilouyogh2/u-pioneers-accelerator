import Link from "next/link";
import { Home, Users, Headphones, Swords, LayoutDashboard, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

function AstronautIllustration() {
  return (
    <svg viewBox="0 0 400 300" className="w-full max-w-md" xmlns="http://www.w3.org/2000/svg">
      {/* Moon surface */}
      <ellipse cx="200" cy="280" rx="160" ry="30" className="fill-border" />
      <ellipse cx="200" cy="275" rx="140" ry="20" className="fill-surface" />

      {/* Stars */}
      <circle cx="50" cy="40" r="1.5" className="fill-muted opacity-60" />
      <circle cx="120" cy="25" r="1" className="fill-muted opacity-50" />
      <circle cx="280" cy="35" r="1.5" className="fill-muted opacity-70" />
      <circle cx="340" cy="55" r="1" className="fill-muted opacity-40" />
      <circle cx="80" cy="80" r="1" className="fill-muted opacity-30" />
      <circle cx="320" cy="90" r="1.5" className="fill-muted opacity-50" />

      {/* Signpost pole */}
      <rect x="155" y="120" width="6" height="160" rx="3" className="fill-muted" />

      {/* Sign 1 */}
      <g transform="translate(100, 130)">
        <rect x="0" y="0" width="80" height="28" rx="6" className="fill-gold-500" />
        <text x="40" y="18" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="Cairo, sans-serif">فكرتك</text>
        <polygon points="80,14 95,14 80,0" className="fill-gold-500" />
      </g>

      {/* Sign 2 */}
      <g transform="translate(110, 165)">
        <rect x="0" y="0" width="80" height="28" rx="6" className="fill-gold-600" />
        <text x="40" y="18" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="Cairo, sans-serif">مشروعك</text>
        <polygon points="80,14 95,14 80,0" className="fill-gold-600" />
      </g>

      {/* Sign 3 */}
      <g transform="translate(120, 200)">
        <rect x="0" y="0" width="80" height="28" rx="6" className="fill-emerald-700" />
        <text x="40" y="18" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="Cairo, sans-serif">مستقبلك</text>
        <polygon points="80,14 95,14 80,0" className="fill-emerald-700" />
      </g>

      {/* Astronaut */}
      <g transform="translate(200, 180)">
        <rect x="-12" y="50" width="10" height="25" rx="5" className="fill-muted" />
        <rect x="2" y="50" width="10" height="25" rx="5" className="fill-muted" />
        <rect x="-14" y="70" width="14" height="8" rx="4" className="fill-border" />
        <rect x="0" y="70" width="14" height="8" rx="4" className="fill-border" />
        <rect x="-18" y="10" width="36" height="45" rx="12" className="fill-surface" />
        <rect x="-22" y="15" width="8" height="35" rx="4" className="fill-muted" />
        <rect x="-28" y="20" width="14" height="8" rx="4" className="fill-surface" transform="rotate(-20, -21, 24)" />
        <rect x="14" y="20" width="14" height="8" rx="4" className="fill-surface" transform="rotate(20, 21, 24)" />
        <circle cx="0" cy="-5" r="20" className="fill-cream" stroke="currentColor" strokeWidth="3" />
        <circle cx="0" cy="-5" r="14" fill="#1e3a5f" opacity="0.8" />
        <ellipse cx="-4" cy="-8" rx="5" ry="3" fill="white" opacity="0.2" transform="rotate(-30, -4, -8)" />
      </g>

      {/* Compass */}
      <g transform="translate(310, 230)">
        <circle cx="0" cy="0" r="28" className="fill-cream" stroke="currentColor" strokeWidth="4" />
        <circle cx="0" cy="0" r="22" className="fill-surface" />
        <polygon points="0,-18 3,-5 -3,-5" fill="#dc2626" />
        <polygon points="0,18 3,5 -3,5" className="fill-muted" />
        <circle cx="0" cy="0" r="3" className="fill-gold-500" />
        <line x1="0" y1="-20" x2="0" y2="-16" stroke="currentColor" strokeWidth="1.5" />
        <line x1="0" y1="16" x2="0" y2="20" stroke="currentColor" strokeWidth="1.5" />
        <line x1="-20" y1="0" x2="-16" y2="0" stroke="currentColor" strokeWidth="1.5" />
        <line x1="16" y1="0" x2="20" y2="0" stroke="currentColor" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-ink px-4 pb-12 pt-8 text-center text-cream">
      {/* Header */}
      <div className="mb-8 flex w-full max-w-4xl items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-cream-dim transition hover:text-gold-500"
        >
          العودة للرئيسية
          <ArrowLeft className="size-4" />
        </Link>
        <ThemeToggle />
      </div>

      {/* Title */}
      <h1 className="text-lg text-muted">عذراً، الصفحة غير موجودة</h1>

      {/* Big 404 */}
      <p className="mt-2 text-[100px] font-black leading-none text-gold-500 sm:text-[140px]">
        404
      </p>

      {/* Subtitle */}
      <p className="mt-4 max-w-md text-base text-cream-dim">
        الصفحة التي تبحث عنها ربما تم نقلها أو حذفها.
      </p>
      <p className="mt-1 text-base text-cream-dim">
        لكن لا تقلق، رحلتك الريادية مستمرة! 🚀
      </p>

      {/* Illustration */}
      <div className="my-6">
        <AstronautIllustration />
      </div>

      {/* Resource links */}
      <p className="text-sm text-muted">ربما تبحث عن أحد هذه الموارد?</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { href: "/", icon: Users, label: "من نحن" },
          { href: "/b2b", icon: Headphones, label: "الدعم والمساعدة" },
          { href: "/register", icon: Swords, label: "الأسلحة الـ16" },
          { href: "/dashboard", icon: LayoutDashboard, label: "لوحة التحكم" },
        ].map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="card-luxury flex flex-col items-center gap-2 rounded-2xl p-4 transition hover:border-gold-500/40"
          >
            <Icon className="size-6 text-gold-500" />
            <span className="text-sm font-medium text-cream">{label}</span>
          </Link>
        ))}
      </div>

      {/* Main CTA */}
      <Link
        href="/"
        className="mt-8 flex items-center gap-2 rounded-full bg-gold-500 px-8 py-3 text-base font-bold text-ink shadow-lg transition hover:bg-gold-400 hover:shadow-xl active:scale-95"
      >
        <Home className="size-5" />
        العودة للرئيسية
      </Link>

      <p className="mt-3 text-xs text-muted">أو استخدم القائمة للتنقل في الموقع</p>
    </div>
  );
}
