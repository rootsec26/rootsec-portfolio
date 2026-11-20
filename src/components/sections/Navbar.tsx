"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS, PROFILE } from "@/data/site";
import GithubIcon from "@/components/GithubIcon";

interface NavbarProps {
  onOpenTerminal: () => void;
}

export default function Navbar({ onOpenTerminal }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Active section highlight on scroll */
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.querySelector(l.href)).filter(
      Boolean
    ) as HTMLElement[];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <div className="w-full max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        <a
          href="#top"
          className="text-sm font-bold tracking-tight text-slate-900 hover:text-emerald-600 transition-colors"
        >
          {PROFILE.handle}
          <span className="text-emerald-500">.</span>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link ${active === link.href ? "active" : ""}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            title="GitHub"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-500/10 transition-colors"
          >
            <GithubIcon className="w-[18px] h-[18px]" />
          </a>
          <button
            onClick={onOpenTerminal}
            className="terminal-toggle-btn"
            aria-label="Open terminal mode"
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
            <span className="hidden sm:inline">Terminal</span>
            <span className="sr-only sm:hidden">Terminal</span>
          </button>
        </div>
      </div>
    </header>
  );
}
