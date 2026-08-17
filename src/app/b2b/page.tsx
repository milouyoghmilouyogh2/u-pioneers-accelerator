import { Handshake } from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Badge } from "@/components/ui/badge";
import { SupportForm, EnterpriseLicenseNote } from "@/components/marketing/support-form";

export default function B2BPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <Badge tone="emerald">
              <Handshake className="size-3.5" /> شركاء ودعم
            </Badge>
            <h1 className="mt-4 text-2xl font-bold text-cream sm:text-3xl">
              تواصل معنا
            </h1>
            <p className="mx-auto mt-2 max-w-lg text-sm text-muted">
              للدعم التقني، الشراكات المؤسساتية، أو ترخيص المنصة كحل
              White-Label لحاضنتك أو جامعتك.
            </p>
          </div>

          <div className="card-luxury mt-10 rounded-2xl p-6 sm:p-8">
            <SupportForm />
            <div className="mt-4">
              <EnterpriseLicenseNote />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
