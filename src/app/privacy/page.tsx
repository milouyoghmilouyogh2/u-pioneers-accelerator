import { ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Badge } from "@/components/ui/badge";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <Badge tone="emerald">
              <ShieldCheck className="size-3.5" /> سياسة الخصوصية
            </Badge>
            <h1 className="mt-4 text-2xl font-bold text-cream sm:text-3xl">
              سياسة الخصوصية
            </h1>
            <p className="mt-2 text-sm text-muted">آخر تحديث: 26 أغسطس 2026</p>
          </div>

          <div className="mt-10 flex flex-col gap-6 text-sm leading-relaxed text-cream-dim">
            <section>
              <h2 className="mb-2 text-base font-semibold text-cream">
                ١. البيانات التي نجمعها
              </h2>
              <p>
                عند إنشاء حساب في U-Pioneers، نجمع: الاسم الكامل، الجامعة،
                التخصص، رقم الواتساب، عنوان المشروع، والبريد الإلكتروني. عند
                رفع طلب دفع، نحتفظ بصورة إيصال التحويل البنكي المرفوعة من
                طرفك.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold text-cream">
                ٢. كيف نستخدم بياناتك
              </h2>
              <p>
                تُستخدم بياناتك حصرياً لتشغيل حسابك ضمن مسار U-Pioneers: عرض
                تقدمك، التواصل معك بخصوص مشروعك، ومراجعة طلبات الدفع من طرف
                فريق الإدارة. لا نبيع بياناتك ولا نشاركها مع أي طرف ثالث
                لأغراض تسويقية.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold text-cream">
                ٣. من يمكنه الوصول إلى بياناتك
              </h2>
              <p>
                بياناتك محمية على مستوى قاعدة البيانات (Row Level Security):
                لا يمكن لأي مستخدم آخر الوصول إلى معلوماتك أو مشروعك، باستثناء
                فريق الإدارة المخول له مراجعة الحسابات وطلبات الدفع. لوحة
                الصدارة العامة تعرض فقط الاسم، الجامعة، وعنوان المشروع - دون
                أي معلومات تواصل.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold text-cream">
                ٤. تسجيل الدخول عبر Google
              </h2>
              <p>
                عند استخدام &quot;المتابعة عبر حساب Google&quot;، نستقبل فقط اسمك
                وبريدك الإلكتروني من حساب Google الخاص بك لإنشاء حسابك في
                المنصة - لا نصل إلى أي بيانات أخرى في حسابك على Google.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold text-cream">
                ٥. حقوقك
              </h2>
              <p>لديك الحق في:</p>
              <ul className="mt-2 list-disc space-y-1 pr-5">
                <li>الوصول إلى جميع بياناتك المخزنة لدينا</li>
                <li>تصحيح أي بيانات غير صحيحة</li>
                <li>حذف حسابك وبياناتك بالكامل</li>
                <li>طلب نسخة من بياناتك</li>
                <li>تقييد معالجة بياناتك في بعض الحالات</li>
              </ul>
              <p className="mt-2">
                لممارسة أي من هذه الحقوق، تواصل معنا عبر صفحة{" "}
                <a href="/b2b" className="text-gold-400 hover:underline">
                  شركاء ودعم
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold text-cream">
                ٦. الاحتفاظ بالبيانات
              </h2>
              <p>
                نحتفظ ببياناتك طوال فترة استخدامك للمنصة. عند حذف حسابك، نحذف
                جميع بياناتك الشخصية خلال 30 يوماً. نحتفظ ببيانات م aggregée
                (إحصائيات مجمّعة لا تIdentify أفراد) لأغراض تحسين الخدمة.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold text-cream">
                ٧. ملفات تعريف الارتباط (Cookies)
              </h2>
              <p>
                نستخدم ملفات تعريف ارتباط أساسية المطلوبة لتشغيل المنصة:
              </p>
              <ul className="mt-2 list-disc space-y-1 pr-5">
                <li><strong>ملفات المصادقة:</strong> للحفاظ على جلسة تسجيل الدخول (Supabase Auth cookies)</li>
                <li><strong>تفضيلات المظهر:</strong> لحفظ اختيارك بين الوضع الفاتح والداكن (localStorage)</li>
              </ul>
              <p className="mt-2">
                لا نستخدم ملفات تعريف ارتباط تتبع أو تحليلات تابعة لجهات ثالثة.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold text-cream">
                ٨. الخدمات الخارجية
              </h2>
              <p>نستخدم الخدمات التالية لتشغيل المنصة:</p>
              <ul className="mt-2 list-disc space-y-1 pr-5">
                <li><strong>Supabase:</strong> لتخزين البيانات والمصادقة (المستضاف في AWS)</li>
                <li><strong>Vercel:</strong> لاستضافة الموقع (المستضاف على شبكة Vercel)</li>
                <li><strong>Google OAuth:</strong> لتسجيل الدخول عبر Google (اختياري)</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold text-cream">
                ٩. الأمان
              </h2>
              <p>
                نتخذ إجراءات أمنية مناسبة لحماية بياناتك، بما في ذلك تشفير
                كلمات المرور (bcrypt)، وسياسات أمان على مستوى قاعدة البيانات
                (RLS)، والتحقق من البريد الإلكتروني قبل تفعيل الحساب.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold text-cream">
                ١٠. التحديثات على هذه السياسة
              </h2>
              <p>
                قد نقوم بتحديث هذه السياسة من وقت لآخر. سيتم إشعارك بأي
                تغييرات جوهرية عبر البريد الإلكتروني أو خلال تسجيل الدخول
                التالي.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold text-cream">
                ١١. التواصل
              </h2>
              <p>
                لأي استفسار بخصوص خصوصية بياناتك، تواصل معنا عبر صفحة{" "}
                <a href="/b2b" className="text-gold-400 hover:underline">
                  شركاء ودعم
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
