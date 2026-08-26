import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <AuthShell
      title="مرحباً بك مجدداً رائد الأعمال"
      subtitle="أدخل بياناتك للمتابعة الفورية لمشروعك."
    >
      <LoginForm />
    </AuthShell>
  );
}
