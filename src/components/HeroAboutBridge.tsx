"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────
   HeroAboutBridge
   A full-width connector rendered between the Hero and About
   sections. It shows:
     • A crimson data-stream canvas (particles flowing downward)
     • Horizontal scan-lines that pulse
     • A centered label "ENTER DATA LAYER" that fades in on scroll
   Designed to create a seamless visual tunnel from the 3D hero
   into the matrix rain of the About section.
   ─────────────────────────────────────────────────────────────────*/

export default function HeroAboutBridge() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  /* Scroll-driven opacity / scale */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const rawOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const opacity = useSpring(rawOpacity, { stiffness: 80, damping: 20 });
  const scaleY = useTransform(scrollYProgress, [0, 0.4], [0.6, 1]);

  /* Particle stream canvas */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth ?? window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight ?? 220;
    };
    resize();
    window.addEventListener("resize", resize);

    /* Particles */
    const N = 80;
    interface Particle {
      x: number; y: number; vy: number; opacity: number; char: string; size: number;
    }
    const particles: Particle[] = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vy: 0.6 + Math.random() * 1.1,
      opacity: 0.2 + Math.random() * 0.8,
      char: Math.random() > 0.5 ? "0" : "1",
      size: 10 + Math.random() * 8,
    }));

    let last = 0;
    const draw = (ts: number) => {
      rafRef.current = requestAnimationFrame(draw);
      if (ts - last < 1000 / 30) return;
      last = ts;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        ctx.font = `bold ${p.size}px 'JetBrains Mono', monospace`;
        ctx.shadowColor = "#FF1A1A";
        ctx.shadowBlur = 10;
        ctx.fillStyle = `rgba(220,40,40,${p.opacity})`;
        ctx.fillText(p.char, p.x, p.y);

        p.y += p.vy;
        /* Flicker */
        if (Math.random() < 0.04) p.char = Math.random() > 0.5 ? "0" : "1";
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
          p.opacity = 0.2 + Math.random() * 0.8;
        }
      }

      /* Horizontal scan lines */
      const scanY = (ts * 0.04) % canvas.height;
      const grd = ctx.createLinearGradient(0, scanY - 2, 0, scanY + 2);
      grd.addColorStop(0, "transparent");
      grd.addColorStop(0.5, "rgba(146,5,19,0.18)");
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.fillRect(0, scanY - 2, canvas.width, 4);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <motion.div
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: 220, opacity, scaleY, transformOrigin: "top" }}
    >
      {/* Gradient top — fades out from hero dark bg */}
      <div
        className="absolute inset-x-0 top-0 h-20 pointer-events-none z-10"
        style={{ background: "linear-gradient(to bottom, #0F1013, transparent)" }}
      />

      {/* Central glowing vertical beam */}
      <div
        className="absolute inset-0 flex justify-center items-center pointer-events-none"
        style={{ zIndex: 5 }}
      >
        <motion.div
          className="w-px"
          style={{ height: "100%", background: "linear-gradient(to bottom, transparent, #920513 40%, #FF4444 55%, #920513, transparent)" }}
          animate={{ opacity: [0.5, 1, 0.5], scaleX: [1, 2, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Binary particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: "screen" }}
      />

      {/* "ENTER DATA LAYER" label */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, letterSpacing: "0.6em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.35em" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, amount: 0.5 }}
          className="font-mono text-[10px] md:text-[11px] tracking-[0.35em] text-[#F4AEA8]/70 select-none"
        >
          ▼ &nbsp; ENTERING DATA LAYER &nbsp; ▼
        </motion.div>
      </div>

      {/* Gradient bottom — fades into matrix bg */}
      <div
        className="absolute inset-x-0 bottom-0 h-20 pointer-events-none z-10"
        style={{ background: "linear-gradient(to top, #0F1013, transparent)" }}
      />
    </motion.div>
  );
}
