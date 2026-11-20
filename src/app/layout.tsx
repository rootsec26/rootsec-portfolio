import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import LocalStats from "@/components/LocalStats";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ashraf Omar — AI Student & Full-Stack Developer",
  description:
    "Ashraf Omar — AI Student & Full-Stack Developer at the Faculty of Computers & Artificial Intelligence, Assiut National University. Building modern Next.js applications and AI integrations.",
  keywords:
    "Ashraf Omar, rootsec, full-stack developer, next.js, react, typescript, AI student, Assiut National University, portfolio",
  openGraph: {
    title: "Ashraf Omar — AI Student & Full-Stack Developer",
    description:
      "Building modern, full-stack web platforms, Next.js applications, and AI integrations.",
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
      <body className="bg-white text-text-primary min-h-screen font-[Inter,sans-serif] antialiased">
        {children}
        <Analytics />
        <LocalStats />
      </body>
    </html>
  );
}
