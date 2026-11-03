import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { PageTransition } from "@/components/PageTransition";
import { PageViewTracker } from "@/components/PageViewTracker";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Sora({ subsets: ["latin"], variable: "--font-display", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Tanzania Perfusionist", template: "%s | Tanzania Perfusionist" },
  description:
    "Connecting Perfusionists. Preserving Our History. Advancing Cardiac Care. News, research, case reports, history and community for perfusion professionals in Tanzania and beyond.",
  openGraph: {
    type: "website",
    siteName: "Tanzania Perfusionist",
    title: "Tanzania Perfusionist",
    description: "Connecting Perfusionists. Preserving Our History. Advancing Cardiac Care.",
  },
  twitter: { card: "summary_large_image" },
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
      </body>
    </html>
  );
}
