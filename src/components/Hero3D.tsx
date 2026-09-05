'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, MeshDistortMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

/* ──────────────────────────────────────────────
   3D Scene – Chrome Metallic Torus Knot
   ────────────────────────────────────────────── */

function ChromeTorusKnot({ mouse }: { mouse: { x: number; y: number } }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const baseRotation = useRef({ x: 0, y: 0 });

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    // slow auto-rotate
    meshRef.current.rotation.y += delta * 0.25;
    meshRef.current.rotation.x += delta * 0.08;

    // tilt toward mouse
    const targetX = mouse.y * 0.3;
    const targetY = mouse.x * 0.5;
    baseRotation.current.x += (targetX - baseRotation.current.x) * 0.04;
    baseRotation.current.y += (targetY - baseRotation.current.y) * 0.04;
    meshRef.current.rotation.x += baseRotation.current.x;
    meshRef.current.rotation.y += baseRotation.current.y;
  });

  return (
    <mesh ref={meshRef} scale={1.55} position={[0, 0, 0]}>
      <torusKnotGeometry args={[1, 0.35, 256, 64, 2, 3]} />
      <MeshDistortMaterial
        color="#b8c0cc"
        metalness={1}
        roughness={0.05}
        envMapIntensity={1.8}
        distort={0.15}
        speed={1.5}
      />
    </mesh>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[-4, 3, 2]} color="#a855f7" intensity={40} distance={12} />
      <pointLight position={[4, -2, 3]} color="#06b6d4" intensity={35} distance={12} />
      <pointLight position={[0, 4, -3]} color="#8b5cf6" intensity={20} distance={10} />
      <spotLight
        position={[0, 6, 4]}
        angle={0.35}
        penumbra={0.8}
        intensity={15}
        color="#38bdf8"
        distance={14}
      />
    </>
  );
}

function Scene({ mouse }: { mouse: { x: number; y: number } }) {
  return (
    <>
      <Lights />
      <Environment preset="city" environmentIntensity={0.6} />
      <ChromeTorusKnot mouse={mouse} />
    </>
  );
}

/* ──────────────────────────────────────────────
   Selection Frame – Bounding Box Handles
   ────────────────────────────────────────────── */

const HANDLE_POSITIONS = [
  { top: 0, left: 0 },   // top-left
  { top: 0, left: '50%' }, // top-center
  { top: 0, right: 0 },  // top-right
  { top: '50%', left: 0 }, // mid-left
  { top: '50%', right: 0 }, // mid-right
  { bottom: 0, left: 0 }, // bottom-left
  { bottom: 0, left: '50%' }, // bottom-center
  { bottom: 0, right: 0 }, // bottom-right
];

function SelectionFrame() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 hidden md:block">
      {/* border box */}
      <div className="absolute top-6 left-6 right-6 bottom-6 md:top-10 md:left-10 md:right-10 md:bottom-10 border border-white/[0.12] rounded-2xl" />

      {/* corner + edge handles */}
      {HANDLE_POSITIONS.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-[9px] h-[9px] bg-white/70 border border-white/40 shadow-[0_0_6px_rgba(255,255,255,0.3)]"
          style={{
            ...pos,
            transform: 'translate(-50%, -50%)',
            borderRadius: 1,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 + i * 0.06, duration: 0.3, ease: 'easeOut' }}
        />
      ))}

      {/* dashed measurement lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none" fill="none">
        {/* top-left corner bracket */}
        <path d="M 30 16 L 16 16 L 16 30" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="3 3" />
        {/* bottom-right corner bracket */}
        <path d="M 970 984 L 984 984 L 984 970" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="3 3" />
      </svg>
    </div>
  );
}

/* ──────────────────────────────────────────────
   SVG Pen-Tool Accent Paths
   ────────────────────────────────────────────── */

function SvgAccentPaths() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      viewBox="0 0 1200 700"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* main sweeping curve */}
      <motion.path
        d="M -20 520 C 180 420, 320 280, 540 320 S 820 440, 1040 260 S 1200 120, 1280 80"
        stroke="url(#grad1)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray="8 6"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.45 }}
        transition={{ duration: 2.8, delay: 0.6, ease: 'easeInOut' }}
      />
      {/* secondary thin accent */}
      <motion.path
        d="M -40 620 C 200 560, 400 380, 660 400 S 900 300, 1120 200"
        stroke="url(#grad2)"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeDasharray="4 8"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.3 }}
        transition={{ duration: 3.2, delay: 1.0, ease: 'easeInOut' }}
      />
      {/* pen tool anchor dots */}
      <motion.circle cx="540" cy="320" r="3" fill="#38bdf8"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ delay: 1.8, duration: 0.4 }}
      />
      <motion.circle cx="1040" cy="260" r="2.5" fill="#a855f7"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ delay: 2.0, duration: 0.4 }}
      />
      {/* control line stubs */}
      <motion.line x1="540" y1="320" x2="460" y2="260" stroke="#38bdf8" strokeWidth="0.6" strokeDasharray="2 4"
        initial={{ opacity: 0 }} animate={{ opacity: 0.25 }} transition={{ delay: 2.2, duration: 0.5 }}
      />
      <motion.line x1="1040" y1="260" x2="1100" y2="200" stroke="#a855f7" strokeWidth="0.6" strokeDasharray="2 4"
        initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} transition={{ delay: 2.4, duration: 0.5 }}
      />
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ──────────────────────────────────────────────
   Floating Micro-Particles
   ────────────────────────────────────────────── */

function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{
    id: number; x: number; y: number; size: number; delay: number; duration: number;
  }>>([]);

  useEffect(() => {
    setParticles(Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1.5 + Math.random() * 2.5,
      delay: Math.random() * 3,
      duration: 4 + Math.random() * 5,
    })));
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.id % 3 === 0 ? '#38bdf8' : p.id % 3 === 1 ? '#a855f7' : '#06b6d4',
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.6, 0],
            y: [0, -30, -60],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Main Hero3D Component
   ────────────────────────────────────────────── */

export default function Hero3D() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    setMouse({ x, y });
  }, []);

  return (
    <section
      className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        {hasMounted && (
          <Canvas
            camera={{ position: [0, 0, 6], fov: 45 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            style={{ background: 'transparent' }}
          >
            <Scene mouse={mouse} />
          </Canvas>
        )}
      </div>

      {/* Floating Particles */}
      <FloatingParticles />

      {/* SVG Accent Paths */}
      <SvgAccentPaths />

      {/* Selection Frame */}
      <SelectionFrame />

      {/* ──── Overlay Content ──── */}
      <div className="relative z-30 flex flex-col items-center text-center px-6 max-w-5xl">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2.5 rounded-full bg-accent/[0.08] border border-accent/20 px-5 py-2 text-xs font-semibold tracking-wider uppercase text-accent">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Frontend Developer &amp; Web Architect
          </span>
        </motion.div>

        {/* Glowing Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: 'easeOut' }}
          className="text-[clamp(2.4rem,6.5vw,5rem)] font-black leading-[1.06] tracking-tight mb-7"
        >
          <span className="block text-text-primary hero-glow-text">WELCOME TO MY</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-accent to-purple-400 bg-[length:200%_auto] animate-gradient-x drop-shadow-[0_0_30px_rgba(56,189,248,0.35)]">
            ROOTSEC
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.8, ease: 'easeOut' }}
          className="text-text-secondary text-base md:text-xl leading-relaxed max-w-2xl mb-10"
        >
          Crafting ultra-fast, accessible web applications with{' '}
          <span className="text-text-primary font-semibold">Next.js</span>,{' '}
          <span className="text-text-primary font-semibold">React</span>,{' '}
          <span className="text-text-primary font-semibold">TypeScript</span>, and{' '}
          <span className="text-text-primary font-semibold">Supabase</span>.
        </motion.p>

        {/* Glassmorphism Badge Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7, ease: 'easeOut' }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {['Next.js', 'React', 'TypeScript', 'Tailwind', 'Supabase'].map((tag, i) => (
            <motion.span
              key={tag}
              className="hero-glass-badge px-4 py-1.5 rounded-full text-xs md:text-sm font-medium text-text-secondary"
              whileHover={{ scale: 1.07, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              style={{ animationDelay: `${1.2 + i * 0.1}s` }}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7, ease: 'easeOut' }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <motion.a
            href="#work"
            className="btn-glow inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald/20"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            View Featured Work
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.a>
          <motion.a
            href="#contact"
            className="btn-outline inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-medium text-text-primary"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Get in Touch
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2"
          >
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-2.5 rounded-full bg-accent/60"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
