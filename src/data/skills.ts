import type { ComponentType } from "react";
import {
  SiPython,
  SiPytorch,
  SiFastapi,
  SiLangchain,
  SiHuggingface,
  SiTypescript,
  SiJavascript,
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiHtml5,
  SiCss,
  SiNodedotjs,
  SiExpress,
  SiSupabase,
  SiPostgresql,
  SiGit,
  SiGithub,
  SiDocker,
  SiLinux,
  SiVercel,
  SiCloudinary,
  SiBurpsuite,
  SiWireshark,
  SiMetasploit,
} from "react-icons/si";
import {
  Radar,
  Waves,
  SquareTerminal,
  ScanSearch,
  Database,
  Binary,
  Code2,
  Shield,
} from "lucide-react";

/* Icon contract shared by react-icons (fill) and lucide (stroke) components */
export type SkillIcon = ComponentType<{
  size?: number | string;
  color?: string;
  className?: string;
}>;

export interface SkillItem {
  name: string;
  icon: SkillIcon;
  /** Official brand color (hex) — also drives tile tint, border & glow. */
  color: string;
  /** Optional badge, e.g. "learning" for security tools. */
  level?: "learning";
}

export interface SkillCategory {
  id: "ai" | "frontend" | "backend" | "tools";
  /** Small emerald uppercase label. */
  tag: string;
  /** Bold category title. */
  title: string;
  items: SkillItem[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "ai",
    tag: "AI & ML",
    title: "AI & Machine Learning",
    items: [
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "PyTorch", icon: SiPytorch, color: "#EE4C2C" },
      { name: "FastAPI", icon: SiFastapi, color: "#009688" },
      { name: "LangChain", icon: SiLangchain, color: "#1C3C3C" },
      { name: "Hugging Face", icon: SiHuggingface, color: "#FF9D00" },
    ],
  },
  {
    id: "frontend",
    tag: "Code",
    title: "Programming & Frontend",
    items: [
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "Next.js", icon: SiNextdotjs, color: "#0F172A" },
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#38BDF8" },
      { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
      { name: "CSS3", icon: SiCss, color: "#1572B6" },
    ],
  },
  {
    id: "backend",
    tag: "Server",
    title: "Backend & Infrastructure",
    items: [
      { name: "Node.js", icon: SiNodedotjs, color: "#5FA04E" },
      { name: "Express", icon: SiExpress, color: "#0F172A" },
      { name: "Supabase", icon: SiSupabase, color: "#3FCF8E" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
    ],
  },
  {
    id: "tools",
    tag: "Env",
    title: "Environment & Tools",
    items: [
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "GitHub", icon: SiGithub, color: "#0F172A" },
      { name: "Docker", icon: SiDocker, color: "#2496ED" },
      { name: "Linux", icon: SiLinux, color: "#0F172A" },
      { name: "Kali Linux", icon: SquareTerminal, color: "#367BF0", level: "learning" },
      { name: "VS Code", icon: Code2, color: "#007ACC" },
      { name: "Vercel", icon: SiVercel, color: "#0F172A" },
      { name: "Cloudinary", icon: SiCloudinary, color: "#3448C0" },
    ],
  },
];

/* ─── Security (Learning Path) — same tile system ─── */

export interface SecurityGroup {
  title: string;
  items: SkillItem[];
}

export const SECURITY_TITLE = "Security (Learning Path)";
export const SECURITY_NOTE = "Used for learning, labs, and CTFs only.";
export const SECURITY_ICON = Shield;
export const SECURITY_BADGE = "Learning";

export const SECURITY_GROUPS: SecurityGroup[] = [
  {
    title: "Network",
    items: [
      { name: "Nmap", icon: Radar, color: "#1E40AF", level: "learning" },
      { name: "Wireshark", icon: SiWireshark, color: "#1679CB", level: "learning" },
      { name: "Scapy", icon: Waves, color: "#1F6FB2", level: "learning" },
    ],
  },
  {
    title: "Web",
    items: [
      { name: "Burp Suite", icon: SiBurpsuite, color: "#CC6600", level: "learning" },
      { name: "ffuf", icon: ScanSearch, color: "#8B5CF6", level: "learning" },
      { name: "SQLMap", icon: Database, color: "#EA580C", level: "learning" },
    ],
  },
  {
    title: "Reverse Engineering & Frameworks",
    items: [
      { name: "Ghidra", icon: Binary, color: "#16A34A", level: "learning" },
      { name: "Metasploit", icon: SiMetasploit, color: "#2596BE", level: "learning" },
    ],
  },
];
