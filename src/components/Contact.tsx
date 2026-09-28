"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { CONTACT } from "@/lib/data";
import ScrollRevealText from "./ScrollRevealText";

/* ─── Tiny reusable fade-up ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: d },
  }),
};

/* ─── Scanning-light canvas ─── */
function ScanLight({ color = "#920513" }: { color?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let x = -120;
    const speed = 0.6;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* Diagonal sweep gradient */
      const grad = ctx.createLinearGradient(x - 80, 0, x + 80, canvas.height);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(0.4, `${color}00`);
      grad.addColorStop(0.5, `${color}55`);
      grad.addColorStop(0.6, `${color}00`);
      grad.addColorStop(1, "transparent");

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      x += speed;
      if (x > canvas.width + 120) x = -120;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [color]);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none rounded-xl"
      style={{ mixBlendMode: "screen", zIndex: 1 }}
    />
  );
}

/* ─── Primary EMAIL card ─── */
function EmailCard() {
  const ref = useRef<HTMLAnchorElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 14;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -10;
    el.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${y}deg) translateY(-4px)`;
  };
  const onLeave = () => {
    if (ref.current)
      ref.current.style.transform =
        "perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0)";
  };

  return (
    <motion.a
      ref={ref}
      href={`mailto:${CONTACT.email}`}
      data-cursor="OPEN"
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="relative group block rounded-xl overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(10,4,5,0.92) 0%, rgba(20,6,9,0.85) 100%)",
        border: "1px solid rgba(146,5,19,0.3)",
        boxShadow:
          "0 0 40px rgba(146,5,19,0.08), inset 0 0 60px rgba(146,5,19,0.04)",
        backdropFilter: "blur(12px)",
        transition: "border-color 0.35s, box-shadow 0.35s, transform 0.2s cubic-bezier(0.16,1,0.3,1)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "rgba(146,5,19,0.7)";
        el.style.boxShadow =
          "0 0 60px rgba(146,5,19,0.2), 0 20px 60px rgba(0,0,0,0.5), inset 0 0 40px rgba(146,5,19,0.08)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "rgba(146,5,19,0.3)";
        el.style.boxShadow =
          "0 0 40px rgba(146,5,19,0.08), inset 0 0 60px rgba(146,5,19,0.04)";
        onLeave();
      }}
    >
      <ScanLight />

      {/* Content above scan light */}
      <div className="relative z-10 p-8 md:p-10">
        {/* Node header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-[9px] tracking-[0.2em] font-bold"
              style={{ color: "#920513" }}
            >
              CONTACT_NODE_01
            </span>
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "#920513", boxShadow: "0 0 6px #920513" }}
            />
            <span className="font-mono text-[9px] text-[#4C5665] tracking-widest">
              STATUS ● ACTIVE
            </span>
          </div>
          <span className="font-mono text-[9px] text-[#4C5665] tracking-widest">
            ↗ OPEN
          </span>
        </div>

        {/* Label + value */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] text-[#920513] font-semibold mb-3">
              EMAIL
            </p>
            <p
              className="font-display text-[1.15rem] md:text-[1.4rem] font-medium break-all"
              style={{ color: "#E1E3E4" }}
            >
              {CONTACT.email}
            </p>
          </div>
          {/* Gmail logo + arrow */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center bg-white/5 border border-white/10">
              <Image
                src="/logo-gmail.jpg"
                alt="Gmail"
                width={40}
                height={40}
                className="object-contain w-9 h-9 rounded-full"
              />
            </div>
            <div
              className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center border border-[#920513]/40 group-hover:border-[#920513] group-hover:bg-[#920513]/10"
              style={{ transition: "all 0.3s" }}
            >
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M4 14L14 4M14 4H7M14 4V11" stroke="#920513" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-5 border-t border-white/5 flex items-center gap-4">
          <span className="font-mono text-[9px] text-[#4C5665] tracking-widest">
            13.0827° N / 80.2707° E
          </span>
          <span className="flex-1 h-px bg-gradient-to-r from-[#920513]/30 to-transparent" />
          <span className="font-mono text-[9px] text-[#4C5665] tracking-widest">
            BENGALURU, IN
          </span>
        </div>
      </div>
    </motion.a>
  );
}

/* ─── Secondary card (LinkedIn / GitHub) ─── */
function SecondaryCard({
  nodeId,
  label,
  display,
  href,
  delay,
  icon,
}: {
  nodeId: string;
  label: string;
  display: string;
  href: string;
  delay: number;
  icon: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 18;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -12;
    el.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) translateY(-6px)`;
  };
  const onLeave = () => {
    if (ref.current)
      ref.current.style.transform =
        "perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0)";
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="OPEN"
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}
      className="relative group block rounded-xl overflow-hidden flex-1 min-w-[220px]"
      style={{
        background:
          "linear-gradient(135deg, rgba(10,4,5,0.92) 0%, rgba(15,16,19,0.9) 100%)",
        border: "1px solid rgba(76,86,101,0.4)",
        boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
        backdropFilter: "blur(12px)",
        transition:
          "border-color 0.35s, box-shadow 0.35s, transform 0.2s cubic-bezier(0.16,1,0.3,1)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "rgba(146,5,19,0.6)";
        el.style.boxShadow =
          "0 0 40px rgba(146,5,19,0.15), 0 20px 40px rgba(0,0,0,0.4)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "rgba(76,86,101,0.4)";
        el.style.boxShadow = "0 4px 30px rgba(0,0,0,0.3)";
        onLeave();
      }}
    >
      <ScanLight color="#920513" />

      <div className="relative z-10 p-7 md:p-8 flex flex-col h-full min-h-[200px] justify-between">
        {/* Top */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <span className="font-mono text-[9px] tracking-[0.2em] text-[#920513] font-bold">
              {nodeId}
            </span>
            <div
              className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center border border-[#4C5665] group-hover:border-[#920513]/60"
              style={{ transition: "border-color 0.3s" }}
            >
              {icon}
            </div>
          </div>
          <p className="font-mono text-[10px] tracking-[0.25em] text-[#920513] font-semibold mb-2">
            {label}
          </p>
          <p className="font-display text-[0.95rem] md:text-[1.1rem] font-medium text-[#E1E3E4]">
            {display}
          </p>
        </div>

        {/* Bottom */}
        <div className="mt-6 flex items-center justify-between">
          <span className="font-mono text-[9px] text-[#4C5665] tracking-widest">
            CONNECT ↗
          </span>
          <div
            className="w-6 h-px bg-gradient-to-r from-transparent to-[#920513]/60 group-hover:to-[#920513]"
            style={{ transition: "all 0.3s" }}
          />
        </div>
      </div>
    </motion.a>
  );
}

/* ─── Logo image icons ─── */
const LinkedInIcon = () => (
  <Image src="/logo-linkedin.jpg" alt="LinkedIn" width={28} height={28} className="rounded-md object-contain" />
);

const GitHubIcon = () => (
  <Image src="/logo-github.jpg" alt="GitHub" width={28} height={28} className="rounded-md object-contain" />
);

/* ─── Main export ─── */
export default function Contact() {
  return (
    <section
      id="contact"
      className="relative min-h-screen flex flex-col justify-center pt-20 pb-40 px-6 md:px-24 overflow-hidden"
    >
      {/* Ambient red glow blob */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(146,5,19,0.08) 0%, transparent 70%)",
          top: "10%",
          right: "-10%",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(146,5,19,0.05) 0%, transparent 70%)",
          bottom: "5%",
          left: "-5%",
          filter: "blur(80px)",
        }}
      />

      {/* ── System status bar ── */}
      <motion.div
        className="flex items-center gap-4 mb-8"
        custom={0}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
        variants={fadeUp}
      >
        <span
          className="font-mono text-[9px] tracking-[0.25em] font-bold"
          style={{ color: "#920513" }}
        >
          ● SYSTEM ONLINE
        </span>
        <span className="flex-1 max-w-[120px] h-px bg-gradient-to-r from-[#920513]/60 to-transparent" />
        <span className="font-mono text-[9px] text-[#4C5665] tracking-widest">
          NEURAL_CORE // 01 &nbsp;·&nbsp; MODEL_STATE: ACTIVE
        </span>
      </motion.div>

      {/* ── Eyebrow ── */}
      <motion.p
        className="eyebrow text-[#F4AEA8]"
        custom={0.05}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
        variants={fadeUp}
      >
        GET IN TOUCH
      </motion.p>

      {/* ── Scroll-highlight heading ── */}
      <ScrollRevealText
        text="Let's build something intelligent."
        className="font-display font-semibold text-[2.4rem] md:text-[5rem] leading-[1.02] tracking-tight max-w-4xl mt-3"
        stagger={0.5}
        start="start 0.8"
        end="start 0.2"
      />

      {/* ── Cards layout ── */}
      <div className="mt-16 space-y-4">
        {/* Primary: Email full-width */}
        <EmailCard />

        {/* Secondary row: LinkedIn + GitHub */}
        <div className="flex flex-col sm:flex-row gap-4">
          <SecondaryCard
            nodeId="NETWORK_NODE_02"
            label="LINKEDIN"
            display="in/thanushree-s"
            href={CONTACT.linkedin}
            delay={0.2}
            icon={<LinkedInIcon />}
          />
          <SecondaryCard
            nodeId="CODE_REPO_03"
            label="GITHUB"
            display="Thanu09-t"
            href={CONTACT.github}
            delay={0.3}
            icon={<GitHubIcon />}
          />
        </div>
      </div>

      {/* ── Footer micro-detail ── */}
      <motion.div
        className="mt-14 flex flex-wrap items-center gap-6"
        custom={0.4}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
      >
        <span className="font-mono text-[9px] text-[#4C5665] tracking-[0.2em]">
          AI / ML ENGINEER
        </span>
        <span className="w-1 h-1 rounded-full bg-[#4C5665]" />
        <span className="font-mono text-[9px] text-[#4C5665] tracking-[0.2em]">
          BENGALURU, INDIA
        </span>
        <span className="w-1 h-1 rounded-full bg-[#4C5665]" />
        <span className="font-mono text-[9px] text-[#4C5665] tracking-[0.2em]">
          2026
        </span>
        <span className="flex-1 h-px bg-gradient-to-r from-[#4C5665]/30 to-transparent" />
        <span className="font-mono text-[9px] text-[#4C5665] tracking-[0.2em]">
          OPEN TO OPPORTUNITIES
        </span>
      </motion.div>
    </section>
  );
}
