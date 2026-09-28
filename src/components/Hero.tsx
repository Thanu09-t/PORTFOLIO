"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero({ ready }: { ready: boolean }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const nx = (e.clientX / innerWidth) * 2 - 1;
      const ny = (e.clientY / innerHeight) * 2 - 1;
      setMouse({ x: nx, y: ny });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center px-8 sm:px-14 md:px-24 lg:px-28 py-20 overflow-hidden perspective-3d"
    >
      {/* 3D Floating Interactive Typography Layer */}
      <div
        ref={containerRef}
        className="w-full max-w-5xl transition-transform duration-150 ease-out"
        style={{
          transform: `perspective(1200px) rotateY(${mouse.x * 6}deg) rotateX(${-mouse.y * 5}deg) translateZ(10px)`,
          transformStyle: "preserve-3d",
          transformOrigin: "left center",
        }}
      >
        <motion.div
          className="relative flex flex-col gap-6 max-w-4xl"
          style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
          initial="hidden"
          animate={ready ? "show" : "hidden"}
          variants={container}
        >
          {/* Eyebrow badge */}
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-3"
            style={{ transform: "translateZ(25px)" }}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#920513] shadow-[0_0_14px_#920513] animate-pulse" />
            <span className="eyebrow text-[#C5222E] font-bold tracking-[0.22em] drop-shadow-[0_1px_3px_rgba(255,255,255,0.4)]">
              AI / ML ENGINEER — BANGALORE, INDIA
            </span>
          </motion.div>

          {/* Name heading + portrait image — side by side on desktop */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10">
            {/* THANUSHREE heading */}
            <h1
              className="font-display font-black leading-[0.92] tracking-tight text-[2.8rem] sm:text-[4rem] md:text-[5.4rem] lg:text-[6.4rem] xl:text-[7.2rem] flex-shrink-0"
              style={{ transform: "translateZ(65px)", transformStyle: "preserve-3d" }}
            >
              <span className="block overflow-hidden py-2">
                <motion.span
                  className="block text-white whitespace-nowrap select-none"
                  style={{
                    textShadow:
                      "0 1px 0 #E2E8F0, 0 2px 0 #CBD5E1, 0 3px 0 #94A3B8, 0 4px 0 #64748B, 0 5px 0 #475569, 0 7px 2px rgba(0,0,0,0.3), 0 12px 24px rgba(0,0,0,0.6)",
                  }}
                  initial={{ y: "110%" }}
                  animate={{ y: ready ? "0%" : "110%" }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                >
                  THANUSHREE
                </motion.span>
              </span>
            </h1>

            {/* Desk-setup portrait card */}
            <motion.div
              variants={fadeUp}
              className="relative flex-shrink-0 self-start lg:self-center"
              style={{ transform: "translateZ(50px)" }}
            >
              {/* Dark-red glow halo */}
              <div
                className="absolute -inset-[3px] rounded-2xl pointer-events-none z-0"
                style={{
                  background:
                    "linear-gradient(135deg, #920513 0%, transparent 55%, #1a1a1a 100%)",
                  opacity: 0.65,
                  filter: "blur(2px)",
                }}
              />
              {/* Card */}
              <div
                className="relative z-10 overflow-hidden rounded-2xl"
                style={{
                  width: "clamp(120px, 20vw, 210px)",
                  aspectRatio: "3/4",
                  border: "1px solid rgba(146,5,19,0.3)",
                  boxShadow:
                    "0 0 0 1px rgba(255,255,255,0.05), 0 10px 40px rgba(0,0,0,0.75), 0 2px 10px rgba(146,5,19,0.2)",
                  background: "#0d0d0f",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero-desk.jpg"
                  alt="Study desk — laptop, notebooks, coffee"
                  className="w-full h-full object-cover object-top"
                  style={{
                    filter: "grayscale(100%) contrast(1.1) brightness(0.85)",
                    display: "block",
                  }}
                />
                {/* Bottom vignette */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(8,9,12,0.04) 0%, rgba(8,9,12,0.0) 35%, rgba(8,9,12,0.4) 100%)",
                  }}
                />
                {/* Red accent line at bottom edge */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, #920513 35%, #C5222E 65%, transparent 100%)",
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* Bio text */}
          <motion.p
            variants={fadeUp}
            className="max-w-2xl text-base sm:text-lg md:text-xl text-[#E2E8F0] leading-relaxed font-medium"
            style={{
              transform: "translateZ(40px)",
              textShadow: "0 2px 10px rgba(0,0,0,0.8)",
            }}
          >
            Building intelligent systems where data, design and engineering converge — from acoustic
            diagnostics to generative-AI copilots.
          </motion.p>

          {/* Tags */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap gap-2.5 pt-2"
            style={{ transform: "translateZ(50px)" }}
          >
            {["MACHINE LEARNING", "DEEP LEARNING", "GENERATIVE AI", "DATA ANALYTICS", "FULL STACK"].map(
              (tag) => (
                <span
                  key={tag}
                  className="clean-toggle font-mono text-[10.5px] md:text-[11px] tracking-wider px-3.5 py-1.5 rounded-lg bg-[#08090C]/80 backdrop-blur-sm border border-white/15 text-[#CBD5E1] hover:border-[#920513] hover:text-white transition-all shadow-lg cursor-default"
                >
                  {tag}
                </span>
              )
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Status info cards — absolute right */}
      <motion.div
        className="absolute right-6 md:right-20 bottom-16 text-right flex flex-col gap-2.5 z-10"
        style={{
          transform: `perspective(1000px) rotateY(${mouse.x * 6}deg) rotateX(${-mouse.y * 5}deg) translateZ(25px)`,
        }}
        initial="hidden"
        animate={ready ? "show" : "hidden"}
        variants={container}
      >
        {[
          ["LOCATION", "BANGALORE, IN"],
          ["FOCUS", "LLM SYSTEMS & APPLIED ML"],
          ["STATUS", "OPEN TO OPPORTUNITIES"],
        ].map(([k, v]) => (
          <motion.div
            key={k}
            variants={fadeUp}
            className="clean-toggle font-mono text-[10px] md:text-[10.5px] tracking-wider px-4 py-2 rounded-lg text-[#CBD5E1] bg-[#08090C]/80 backdrop-blur-md border border-white/10 shadow-lg"
          >
            <b className="text-[#920513] font-semibold">{k}</b> — {v}
          </motion.div>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute left-6 md:left-20 bottom-14 flex items-center gap-2.5 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.9, delay: 1.1 }}
      >
        <div className="w-px h-8 bg-[#920513]" />
        <span
          className="font-mono text-[10px] tracking-[0.2em] text-[#CBD5E1]"
          style={{ writingMode: "vertical-rl" }}
        >
          SCROLL
        </span>
      </motion.div>
    </section>
  );
}
