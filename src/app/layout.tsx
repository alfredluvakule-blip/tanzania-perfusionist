import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { PageTransition } from "@/components/PageTransition";
import { PageViewTracker } from "@/components/PageViewTracker";
import { Analytics } from "@vercel/analytics/next";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Sora({ subsets: ["latin"], variable: "--font-display", display: "swap" });

import { SITE_URL, SWAHILI_NAME } from "@/lib/site";

const siteUrl = SITE_URL;

/**
 * Google Search Console code. Accepts either the bare code or the whole
 * <meta name="google-site-verification" content="..."> tag pasted from Search Console.
 */
function parseGoogleVerification(raw?: string) {
  if (!raw) return undefined;
  const fromTag = raw.match(/content\s*=\s*["']([^"']+)["']/i)?.[1];
  const code = (fromTag ?? raw).trim().replace(/^["']+|["']+$/g, "").trim();
  return code || undefined;
}
const googleCode = parseGoogleVerification(process.env.GOOGLE_SITE_VERIFICATION);

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Tanzania Perfusionists", template: "%s | Tanzania Perfusionists" },
  description:
    "Connecting Perfusionists. Preserving Our History. Advancing Cardiac Care. Wataalamu wa Kusimamisha na Kuamsha Moyo. News, research, case reports, history and community for perfusion professionals in Tanzania and beyond.",
  openGraph: {
    type: "website",
    siteName: "Tanzania Perfusionists",
    url: "/",
    locale: "en_TZ",
    title: "Tanzania Perfusionists",
    description: "Connecting Perfusionists. Preserving Our History. Advancing Cardiac Care.",
    images: [{ url: "/images/hero-perfusionists.webp", width: 960, height: 1280, alt: "Perfusionists at the heart-lung machine" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "./" },
  applicationName: "Tanzania Perfusionists",
  keywords: ["Tanzania Perfusionists", "Tanzania Perfusionist", "perfusionist Tanzania", "perfusion", "cardiopulmonary bypass", "ECMO", "TaCPA", "Tanzania Cardiovascular Perfusion Association", SWAHILI_NAME],
  robots: { index: true, follow: true },
  // GOOGLE_SITE_VERIFICATION on Vercel: the code from Search Console (the whole meta tag also works).
  verification: googleCode ? { google: googleCode } : undefined,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">
          Skip to content
        </a>
        <Providers>
          <PageViewTracker />
          <Header />
          <PageTransition>{children}</PageTransition>
          <Footer />
        </Providers>
        {/* Vercel Web Analytics: visitor counts, pages, countries. View in Vercel > project > Analytics. */}
        <Analytics />
      </body>
    </html>
  );
}
