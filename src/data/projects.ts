import type { PreviewProject } from "@/components/ProjectPreviewModal";

/**
 * Portfolio-wide project records.
 *
 * Every entry carries both:
 *  - a `mockupImage` (static visual preview shown inside the preview frame), and
 *  - fallback metadata (`desc` + `badges`) used by the dark high-tech fallback
 *    layout whenever the live site refuses to be embedded.
 */
export interface PortfolioProject extends PreviewProject {
  desc: string;
  badges: string[];
  githubUrl: string;
}

export const PROJECTS: PortfolioProject[] = [
  {
    title: "Al-Nazer Educational Platform",
    category: "Full-Stack E-Learning Ecosystem",
    desc: "A full-stack e-learning ecosystem built for high school students featuring video management, interactive quizzes, and real-time dashboards.",
    badges: ["Next.js", "React", "Tailwind CSS", "Supabase", "Cloudinary", "Vercel"],
    url: "https://alnazer.vercel.app",
    githubUrl: "https://github.com/rootsec26",
    previewType: "iframe",
    mockupImage: "/projects/alnazer-mockup.svg",
    imagePreview: "/projects/alnazer-mockup.svg",
  },
  {
    title: "Madar-X Academic Ecosystem",
    category: "Academic Management Platform",
    desc: "A modern university academic management platform designed for data simulation, course tracking, and interactive controls.",
    badges: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Vercel"],
    url: "https://madarx.vercel.app",
    githubUrl: "https://github.com/rootsec26",
    previewType: "iframe",
    mockupImage: "/projects/madarx-mockup.svg",
    imagePreview: "/projects/madarx-mockup.svg",
  },
  {
    title: "StoreHub Multi-Tenant E-Commerce",
    category: "Multi-Tenant SaaS Ecosystem",
    desc: "A full-stack multi-tenant e-commerce platform featuring instant store creation, real-time inventory synchronization, dynamic custom themes, and customer order management.",
    badges: ["Next.js", "TypeScript", "Tailwind CSS", "Drizzle ORM", "Supabase", "Vercel"],
    url: "https://store-hub-beta.vercel.app",
    githubUrl: "https://github.com/rootsec26",
    previewType: "iframe",
    mockupImage: "/projects/storehub-mockup.svg",
    imagePreview: "/projects/storehub-mockup.svg",
  },
];
