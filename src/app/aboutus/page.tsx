import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { SocialLink } from "@/components/ui/social-icons";
import { createClient } from "@/lib/supabase/server";

async function getTeamData() {
  const supabase = await createClient();
  const { data: members } = await supabase
    .from("team_members")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (!members) return [];

  const { data: allLinks } = await supabase
    .from("team_member_links")
    .select("*")
    .order("sort_order", { ascending: true });

  return members.map((m) => ({
    ...m,
    links: allLinks?.filter((l) => l.team_member_id === m.id) || [],
  }));
}

export default async function AboutUsPage() {
  const teamMembers = await getTeamData();

  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <Badge tone="emerald">🚀 مسرعة أعمال رقمية</Badge>
            <h1 className="mt-4 text-3xl font-bold text-cream sm:text-4xl">
              فريق جزائري، <span className="text-gold-500">طموح واحد</span>
            </h1>
          </div>
        </section>

        {/* Team Members */}
        <section className="px-4 pb-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-8 text-center text-2xl font-bold text-cream">
              فريق العمل
            </h2>
            <p className="mb-12 text-center text-sm text-cream-dim">
              الأشخاص الذين يجعلون U-Pioneers حقيقة
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              {teamMembers.map((member) => (
                <Reveal key={member.id}>
                  <div className="card-luxury flex h-full w-[320px] flex-col overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:shadow-xl">
                    {/* Photo */}
                    <div className="aspect-square bg-gradient-to-br from-[#e8d5b7] to-[#d4c4a8]">
                      {member.image_url && (
                        <img
                          src={member.image_url}
                          alt={member.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-lg font-bold text-cream">
                        {member.name}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-gold-500">
                        {member.role}
                      </p>
                      {member.description && (
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-cream-dim">
                          {member.description}
                        </p>
                      )}

                      {/* Social icons */}
                      {member.links.length > 0 && (
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          {member.links.map((link) => (
                            <SocialLink
                              key={link.id}
                              platform={link.platform}
                              url={link.url}
                              className="size-8"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-500 to-emerald-700 px-6 py-14 text-center shadow-2xl sm:px-14">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              جاهز لبدء رحلتك الريادية؟
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-white/75">
              انضم لمئات رواد الأعمال الجامعيين الذين بدأوا مسارهم مع U-Pioneers
            </p>
            <Link
              href="/register"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-3 text-base font-bold text-white shadow-lg transition hover:bg-gold-600 hover:shadow-xl active:scale-95"
            >
              ابدأ الآن مجاناً
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
