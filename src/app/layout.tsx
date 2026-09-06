import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import LocalStats from "@/components/LocalStats";
import "./globals.css";

export const metadata: Metadata = {
  title: "rootsec — Frontend Developer & Web Architect",
  description: "Crafting ultra-fast, responsive web applications with Next.js, TypeScript, and Supabase.",
  keywords: "rootsec, frontend developer, next.js, react, typescript, portfolio, web architect",
  openGraph: {
    title: "rootsec — Frontend Developer & Web Architect",
    description: "Crafting ultra-fast, responsive web applications with Next.js, TypeScript, and Supabase.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-void text-text-primary min-h-screen font-[Inter,sans-serif] antialiased">
        {children}
        <Analytics />
        <LocalStats />
      </body>
    </html>
  );
}
