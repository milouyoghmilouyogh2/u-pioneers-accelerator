import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

// Pure static content — pre-built at deploy time, zero server work on click.
export const dynamic = "force-static";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-cream">شروط الاستخدام</h1>
          <p className="mt-2 text-sm text-muted">آخر تحديث: 26 أغسطس 2026</p>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-cream-dim">
            <section>
              <h2 className="mb-3 text-lg font-semibold text-cream">1. قبول الشروط</h2>
              <p>
                باستخدامك لمنصة U-Pioneers ("المنصة")، أنت توافق على هذه الشروط والأحكام. إذا
                لا توافق على أي شروط، يرجى عدم استخدام المنصة.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-cream">2. وصف الخدمة</h2>
              <p>
                U-Pioneers منصة رقمية تقدم مساراً تعليمياً من 16 خطوة ("أسلحة") لمساعدة رواد
                الأعمال الجامعيين على تطوير مشاريعهم وفقاً للقرار الوزاري 1275.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-cream">3. حساب المستخدم</h2>
              <ul className="list-disc space-y-2 pr-5">
                <li>أنت مسؤول عن الحفاظ على سرية كلمة المرور الخاصة بك.</li>
                <li>أنت مسؤول عن جميع الأنشطة التي تحدث تحت حسابك.</li>
                <li>يجب أن تكون معلوماتك صحيحة ومحدثة.</li>
                <li>يُحظر إنشاء حسابات متعددة للشخص الواحد.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-cream">4. المحتوى والملكية الفكرية</h2>
              <ul className="list-disc space-y-2 pr-5">
                <li>المحتوى التعليمي (الأسلحة والمواد) هو ملكية فكرية لـ U-Pioneers.</li>
                <li>الإجابات والمشاريع التي تقدمها هي ملكيتك أنت.</li>
                <li>يُمنع نسخ أو توزيع المواد التعليمية بدون إذن.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-cream">5. الدفع والاشتراكات</h2>
              <ul className="list-disc space-y-2 pr-5">
                <li>الخدمة الأساسية مجانية.</li>
                <li>الخدمات المتممة (الترقية) تتطلب رسوماً معلنة.</li>
                <li>يتم الدفع عبر تحويل بنكي (CCP/بريدي موب) وفقاً للتعليمات المعروضة.</li>
                <li>لا توجد استردادات للرسوم المدفوعة بعد تفعيل الخدمة.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-cream">6. السلوك المحظور</h2>
              <p>يُمنع:',
              </p>
              <ul className="list-disc space-y-2 pr-5">
                <li>استخدام المنصة لأغراض غير قانونية.</li>
                <li>انتهاك خصوصية المستخدمين الآخرين.</li>
                <li>نشر محتوى مسيء أو مخالف.</li>
                <li>محاولة اختراق أو تعطيل المنصة.</li>
                <li>استخدام الحسابات الوهمية أو المزيفة.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-cream">7. إخلاء المسؤولية</h2>
              <p>
                المنصة تقدم إرشادات تعليمية فقط ولا تضمن نجاح المشاريع. U-Pioneers غير مسؤول
                عن أي خسائر أو أضرار ناتجة عن استخدام المعلومات المقدمة.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-cream">8. تعديل الشروط</h2>
              <p>
                نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إشعار المستخدمين بالتغييرات
                الجوهرية عبر البريد الإلكتروني أو إشعار على المنصة.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-cream">9. القانون الحاكم</h2>
              <p>
                تخضع هذه الشروط لقوانين الجمهورية الجزائرية الديمقراطية الشعبية. أي نزاع
                يُحل عبر القضاء الجزائري المختص.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-cream">10. التواصل</h2>
              <p>
                لأي استفسارات حول شروط الاستخدام، يرجى التواصل معنا عبر
                <Link href="/b2b" className="mx-1 text-gold-400 hover:underline">
                  صفحة الشركاء
                </Link>
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
