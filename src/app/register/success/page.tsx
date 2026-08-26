import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";

export default function RegisterSuccessPage() {
  return (
    <AuthShell
      title="تحقق من بريدك الإلكتروني"
      subtitle="لقد أرسلنا لك رسالة تأكيد. اضغط على الرابط في الرسالة لتفعيل حسابك."
    >
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10">
          <Mail className="size-8 text-emerald-500" />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-cream-dim">
            إذا وجدت الرسالة في مجلد البريد العشوائي (Spam)، افحصه أيضاً.
          </p>
          <p className="text-xs text-muted">
            لم تصل الرسالة؟ تحقق من صحة البريد الإلكتروني وحاول التسجيل مرة أخرى.
          </p>
        </div>

        <Link
          href="/login"
          className="flex items-center gap-2 text-sm font-medium text-gold-400 hover:underline"
        >
          <ArrowLeft className="size-4" />
          العودة لتسجيل الدخول
        </Link>
      </div>
    </AuthShell>
  );
}
