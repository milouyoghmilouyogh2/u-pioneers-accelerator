"use client";

import { useEffect, useRef, useState } from "react";

// The 16-step curriculum, hardcoded on purpose - this is a marketing
// preview on the public landing page, not the real student workspace
// (that one still reads live from Supabase via /dashboard/weapons). Baking
// it in here means this section can never go blank because of a database
// or environment-variable problem.
const WEAPONS = [
  { number: 1, title: "فكرة المشروع والقيمة المبتكرة", summary: "بذرة الابتكار وتحديد القيمة الاقتصادية الأولية للمشروع." },
  { number: 2, title: "تحديد ودراسة العميل المستهدف", summary: "تحديد الفئة الدقيقة التي ستقبل على شراء منتجك." },
  { number: 3, title: "دراسة السوق وتقدير حجم الطلب", summary: "التحقق من جاذبية وحجم السوق المتاح للمشروع." },
  { number: 4, title: "تحليل المنافسين والميزة التنافسية", summary: "لماذا سيختارك العميل ويترك الخيارات الأخرى المتاحة؟" },
  { number: 5, title: "مخطط نموذج العمل التجاري BMC", summary: "الخريطة الشاملة لكيفية صنع وتقديم واكتساب القيمة." },
  { number: 6, title: "بناء الهوية البصرية والرسالة التجارية", summary: "رسم شخصية العلامة التجارية وزرع الثقة في الزبائن." },
  { number: 7, title: "تحديد القيمة المقترحة الفريدة UVP", summary: "الجملة السحرية التي تلخص المشكلة والحل والميزة التنافسية." },
  { number: 8, title: "بناء النموذج الأولي المبسط MVP", summary: "تصميم أصغر نسخة وظيفية من منتجك لاختبارها ميدانياً." },
  { number: 9, title: "التحقق الميداني وتجربة المستخدم", summary: "جمع آراء الزبائن الحقيقيين بعد تفاعلهم مع النموذج الأولي." },
  { number: 10, title: "خطة التسويق وجذب الزبائن الجدد", summary: "تحديد قنوات الوصول وصياغة العروض الفيروسية والمقنعة." },
  { number: 11, title: "هيكل التكاليف التأسيسية والتشغيلية", summary: "معرفة وحساب أين ستنفق كل دينار جزائري في مشروعك." },
  { number: 12, title: "تنويع مصادر الإيرادات وتطوير المبيعات", summary: "تأمين تدفقات نقدية متعددة لضمان بقاء ونمو المؤسسة." },
  { number: 13, title: "تشكيل الفريق الأساسي وتوزيع الأدوار", summary: "تجميع الكفاءات وتقاسم المهام لتحويل الفكرة إلى واقع." },
  { number: 14, title: "الجوانب القانونية والقرار الوزاري 1275", summary: "الحصول على وسم مؤسسة ناشئة وتسجيل براءة الاختراع." },
  { number: 15, title: "استراتيجية التوسع والنمو السريع", summary: "كيف سينتقل مشروعك من ولايتك إلى القطر الوطني ثم الدولي؟" },
  { number: 16, title: "العرض التقديمي النهائي Pitch Deck", summary: "صياغة العرض الساحر لإقناع لجنة مناقشة التخرج والمستثمرين." },
];

function WeaponCard({ weapon }: { weapon: (typeof WEAPONS)[number] }) {
  return (
    <div className="card-luxury h-48 w-44 shrink-0 rounded-xl p-4" dir="rtl">
      <span className="text-xs font-bold text-gold-500">
        {String(weapon.number).padStart(2, "0")}
      </span>
      <p className="mt-1.5 text-sm font-semibold leading-snug text-cream">{weapon.title}</p>
      <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted">{weapon.summary}</p>
    </div>
  );
}

// Plays on its own, forever, once the section has actually been scrolled
// to - and pauses only while a finger or mouse button is actually pressed
// down on it, resuming the instant it's released. No buttons: pressing it
// IS the control. (Deliberately NOT pointer-enter/leave - that fires just
// from the cursor resting over the area as it scrolls past underneath,
// which would pause the loop without the user ever meaning to touch it.)
export function WeaponsPile() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const touchingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  // Touch and trackpads already pan a native overflow-x-auto strip on their
  // own - a plain mouse does not, click-and-drag has to be built by hand.
  const dragRef = useRef<{ startX: number; startScrollLeft: number } | null>(null);

  function releaseDrag() {
    touchingRef.current = false;
    dragRef.current = null;
  }

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    // Long safety-net delay - just a backstop for a broken observer, not a
    // normal-path trigger.
    const fallback = setTimeout(() => setPlaying(true), 10000);

    if (typeof IntersectionObserver === "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- unsupported-API fallback, not derived from props/state
      setPlaying(true);
      return () => clearTimeout(fallback);
    }
    const rect = node.getBoundingClientRect();
    const shownHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    if (rect.height > 0 && shownHeight / rect.height >= 0.25) {
      setPlaying(true);
      clearTimeout(fallback);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlaying(true);
          clearTimeout(fallback);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  // Ambient auto-scroll: a plain rAF loop nudging scrollLeft forward, wrapping
  // seamlessly since the track is two identical copies back-to-back.
  useEffect(() => {
    if (!playing) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const halfWidth = scroller.scrollWidth / 2;
    let lastTime: number | null = null;
    const SPEED = 26; // px/second

    function tick(now: number) {
      if (lastTime === null) lastTime = now;
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      if (scroller && !touchingRef.current) {
        scroller.scrollLeft += SPEED * dt;
        if (scroller.scrollLeft >= halfWidth) scroller.scrollLeft -= halfWidth;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing]);

  return (
    <div className="relative mt-10 py-2" dir="ltr">
      <div className="pointer-events-none absolute inset-y-0 start-0 z-10 w-10 bg-gradient-to-r from-ink to-transparent sm:w-20" />
      <div className="pointer-events-none absolute inset-y-0 end-0 z-10 w-10 bg-gradient-to-l from-ink to-transparent sm:w-20" />

      <div
        ref={scrollerRef}
        className="flex w-full cursor-grab gap-3 overflow-x-auto px-4 select-none active:cursor-grabbing [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden"
        onPointerDown={(e) => {
          touchingRef.current = true;
          if (e.pointerType === "mouse") {
            dragRef.current = { startX: e.clientX, startScrollLeft: scrollerRef.current?.scrollLeft ?? 0 };
            // Pointer capture guarantees move/up events keep reaching this
            // element even if the cursor ends up outside its bounds - the
            // browser's own mechanism for exactly this, more reliable than
            // hand-rolled document-level listener bookkeeping.
            e.currentTarget.setPointerCapture(e.pointerId);
          }
        }}
        onPointerMove={(e) => {
          if (!dragRef.current || !scrollerRef.current) return;
          const dx = e.clientX - dragRef.current.startX;
          scrollerRef.current.scrollLeft = dragRef.current.startScrollLeft - dx;
        }}
        onPointerUp={releaseDrag}
        onPointerCancel={releaseDrag}
        onLostPointerCapture={releaseDrag}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 gap-3" aria-hidden={copy === 1}>
            {WEAPONS.map((w) => (
              <WeaponCard key={`${copy}-${w.number}`} weapon={w} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
