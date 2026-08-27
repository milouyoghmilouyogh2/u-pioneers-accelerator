import Link from "next/link";
import { Rocket, MessageCircle } from "lucide-react";
import { getSetting } from "@/lib/dal";

export async function Footer() {
  const waLink = (await getSetting("whatsapp_group_link")) ?? "#";

  return (
    <footer className="border-t border-border/60 bg-surface/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-ink">
              <Rocket className="size-4" />
            </span>
            <span className="text-lg font-bold text-cream">U-Pioneers</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            مسرعة أعمال رقمية، متوافقة كلياً مع القرار الوزاري
            1275 لمرافقة مشاريع التخرج الابتكارية لطلبة الجامعات الجزائرية.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-gold-500">المنصة</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link href="/register" className="hover:text-cream">سجل مشروعك</Link></li>
              <li><Link href="/leaderboard" className="hover:text-cream">لوحة الصدارة</Link></li>
              <li><Link href="/login" className="hover:text-cream">تسجيل الدخول</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gold-500">الدعم</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link href="/b2b" className="hover:text-cream">شركاء ودعم</Link></li>
              <li>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-cream"
                >
                  <MessageCircle className="size-4" /> مجموعة واتساب
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} U-Pioneers Accelerator — جميع الحقوق محفوظة ·{" "}
        <Link href="/terms" className="hover:text-cream">شروط الاستخدام</Link> ·{" "}
        <Link href="/privacy" className="hover:text-cream">سياسة الخصوصية</Link>
      </div>
    </footer>
  );
}
