"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Work from "@/components/sections/Work";
import Stack from "@/components/sections/Stack";
import GraphSection from "@/components/sections/GraphSection";
import Contact from "@/components/sections/Contact";
import ScrollProgress from "@/components/ui/ScrollProgress";
import TerminalModal from "@/components/TerminalModal";
import ProjectPreviewModal from "@/components/ProjectPreviewModal";
import type { PortfolioProject } from "@/data/projects";

export default function PortfolioPage() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [previewProject, setPreviewProject] = useState<PortfolioProject | null>(null);

  /* ── Keyboard shortcut: Ctrl+` to toggle terminal ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "`" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openTerminal = useCallback(() => setTerminalOpen(true), []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-white overflow-x-clip">
        <ScrollProgress />
        <Navbar onOpenTerminal={openTerminal} />

        {/* Ambient background blobs */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="glow-blob ambient-float w-[600px] h-[600px] bg-emerald-200/25 -top-[200px] -left-[200px]" />
          <div className="glow-blob ambient-float-delayed w-[500px] h-[500px] bg-teal-200/20 top-[30%] -right-[150px]" />
          <div className="glow-blob ambient-float-slow w-[400px] h-[400px] bg-emerald-100/30 bottom-[10%] -left-[100px]" />
        </div>

        <main className="relative z-10">
          <Hero />
          <About />
          <Work onPreview={setPreviewProject} />
          <Stack />
          <GraphSection />
          <Contact />
        </main>

        <TerminalModal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />

        <ProjectPreviewModal
          project={previewProject}
          onClose={() => setPreviewProject(null)}
        />
      </div>
    </MotionConfig>
  );
}
