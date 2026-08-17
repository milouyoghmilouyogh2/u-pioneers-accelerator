import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { ToastProvider } from "@/components/providers/toast-provider";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "U-Pioneers | مسرعة الأعمال الرقمية",
  description:
    "حاضنة ومسرعة أعمال رقمية معتمدة لمرافقة مشاريع التخرج الابتكارية لطلبة الجامعات الجزائرية وفق القرار الوزاري 1275.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full`}>
      <body className="min-h-full bg-ink text-cream bg-luxury-grid antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
