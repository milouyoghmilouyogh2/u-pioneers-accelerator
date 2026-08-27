import Image from "next/image";
import { Users } from "lucide-react";
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
        </Reveal>
        <Reveal delay={120}>
          <div className="card-luxury overflow-hidden rounded-2xl p-4">
            <Image
              src={teamPhoto}
              alt="فريق U-Pioneers"
              className="w-full rounded-xl object-cover"
              placeholder="blur"
              sizes="(min-width: 768px) 480px, 100vw"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
