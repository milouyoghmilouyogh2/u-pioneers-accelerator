import type { Metadata } from "next";
import Script from "next/script";
import { Cairo } from "next/font/google";
import { ToastProvider } from "@/components/providers/toast-provider";
import { ThemeProvider, NO_FLASH_THEME_SCRIPT } from "@/components/providers/theme-provider";
import { PublicMobileNav } from "@/components/marketing/public-mobile-nav";
import { getUser } from "@/lib/dal";
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
  metadataBase: new URL("https://u-pioneers-accelerator.vercel.app"),
  openGraph: {
    title: "U-Pioneers | مسرعة الأعمال الرقمية",
    description:
      "حاضنة ومسرعة أعمال رقمية معتمدة لمرافقة مشاريع التخرج الابتكارية لطلبة الجامعات الجزائرية وفق القرار الوزاري 1275.",
    url: "https://u-pioneers-accelerator.vercel.app",
    siteName: "U-Pioneers",
    locale: "ar_DZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "U-Pioneers | مسرعة الأعمال الرقمية",
    description:
      "حاضنة ومسرعة أعمال رقمية معتمدة لمرافقة مشاريع التخرج الابتكارية لطلبة الجامعات الجزائرية وفق القرار الوزاري 1275.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getUser();

  return (
    <html
      lang="ar"
      dir="rtl"
      data-scroll-behavior="smooth"
      className={`${cairo.variable} h-full`}
      // The no-flash script (below) sets data-theme on this element before
      // React hydrates, which will always differ from the server-rendered
      // markup that has no theme attribute yet - that mismatch is expected
      // and intentional, not a bug, so it's suppressed here specifically.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_THEME_SCRIPT }} />
        <noscript>
          <style>{".reveal{opacity:1!important;transform:none!important}"}</style>
        </noscript>
        {/* Plausible Analytics — privacy-friendly, no cookies */}
        <Script
          defer
          data-domain="u-pioneers-accelerator.vercel.app"
          src="https://plausible.io/js/script.js"
        />
      </head>
      <body className="min-h-full bg-ink text-cream bg-luxury-grid antialiased">
        <ThemeProvider>
          <ToastProvider>
            {children}
            <PublicMobileNav isLoggedIn={!!user} />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
