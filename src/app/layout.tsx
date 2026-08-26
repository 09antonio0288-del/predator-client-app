import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin", "cyrillic"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PREDATOR CLIENT — Система трансформации",
  description: "Персональная цифровая система трансформации.",
  icons: { icon: "/logo.svg", apple: "/logo.svg" },
  applicationName: "PREDATOR",
  manifest: "/manifest.json",
};
export const viewport: Viewport = { themeColor: "#050505", width: "device-width", initialScale: 1, maximumScale: 1, userScalable: false };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-dvh flex flex-col bg-bg text-text"><Providers>{children}</Providers></body>
    </html>
  );
}
