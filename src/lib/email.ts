import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function withRetry<T>(
  fn: () => Promise<T>,
  { retries = 2, delay = 1000 }: { retries?: number; delay?: number } = {}
): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === retries) throw error;
      await new Promise((r) => setTimeout(r, delay * (attempt + 1)));
    }
  }
  throw new Error("unreachable");
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await withRetry(() =>
    resend.emails.send({
      from: process.env.RESEND_FROM || "U-Pioneers <noreply@resend.dev>",
      to,
      subject: "إعادة تعيين كلمة المرور - U-Pioneers",
      text: `طلبتك إعادة تعيين كلمة المرور. افتح هذا الرابط: ${resetUrl}\n\nهذا الرابط صالح لمدة ساعة واحدة.\n\nإذا لم تطلب هذا، تجاهل هذه الرسالة.`,
    })
  );
}

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    await withRetry(() =>
      resend.emails.send({
        from: process.env.RESEND_FROM || "U-Pioneers <noreply@resend.dev>",
        to,
        subject: "مرحباً بك في U-Pioneers!",
        text: `مرحباً ${name}!\n\nشكراً لتسجيلك في U-Pioneers. يمكنك الآن تسجيل الدخول والبدء في مسارك الريادي.`,
      })
    );
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    // Don't throw - welcome email is non-critical
  }
}
