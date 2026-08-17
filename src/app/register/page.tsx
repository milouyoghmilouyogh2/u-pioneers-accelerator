import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <AuthShell
      title="إنشاء حساب رائد أعمال جديد"
      subtitle="ابدأ رحلتك لتحويل فكرتك لمؤسسة اقتصادية حقيقية وفق القرار 1275."
    >
      <RegisterForm />
    </AuthShell>
  );
}
