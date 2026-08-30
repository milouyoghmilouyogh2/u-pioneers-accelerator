import Image from "next/image";
import Link from "next/link";
import { Users, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import teamPhoto from "../../../public/images/team.webp";

export function TeamSection() {
  return (
    <section className="bg-dot-grid px-4 py-20 sm:px-6">
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
        <Reveal>
          <Badge tone="emerald">
            <Users className="size-3.5" /> فريق U-Pioneers
          </Badge>
          <h2 className="mt-4 text-2xl font-bold text-cream sm:text-3xl">
            فريق جزائري، لطلبة جامعيين جزائريين
          </h2>
          <p className="mt-4 leading-relaxed text-cream-dim">
            وراء كل خطوة في مسار U-Pioneers فريق يعرف واقع الجامعة الجزائرية
            عن قرب، ومتحمّس لمرافقتك من الفكرة الأولى حتى الحصول على وسم
            &quot;مشروع مبتكر&quot; وفق القرار الوزاري 1275.
          </p>

          {/* Caption under text on PC */}
          <div className="mt-6 hidden md:block">
            <p className="text-lg font-bold text-cream">هيثم مواقي</p>
            <p className="text-sm text-gold-500">المؤسس والمدير التنفيذي</p>
            <p className="mt-1 text-xs text-muted">
              <span className="font-semibold text-cream">U-Pioneers</span>{" "}
              Digital Accelerator
            </p>
          </div>

          {/* About Us button */}
          <Link
            href="/aboutus"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gold-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-gold-600 hover:shadow-xl active:scale-95"
          >
            تعرف علينا أكثر
            <ArrowLeft className="size-4" />
          </Link>
        </Reveal>

        <Reveal delay={120}>
          <div className="card-luxury overflow-hidden rounded-2xl p-4">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl">
              <Image
                src={teamPhoto}
                alt="هيثم مواقي - المؤسس والمدير التنفيذي"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 480px, 100vw"
              />
            </div>
            {/* Caption under image on mobile */}
            <div className="mt-4 text-center md:hidden">
              <p className="text-lg font-bold text-cream">هيثم مواقي</p>
              <p className="text-sm text-gold-500">المؤسس والمدير التنفيذي</p>
              <p className="mt-1 text-xs text-muted">
                <span className="font-semibold text-cream">U-Pioneers</span>{" "}
                Digital Accelerator
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
