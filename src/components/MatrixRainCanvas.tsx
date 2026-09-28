"use client";

import { useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────
   MatrixRainCanvas
   Renders a live binary waterfall (0 / 1) over the matrix-bg image.
   Mouse movement tilts the entire element in 3D.
   ─────────────────────────────────────────────────────────────────*/

export default function MatrixRainCanvas({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const tiltRef = useRef({ rx: 0, ry: 0 });
  const dropsRef = useRef<Float32Array | null>(null);
  const speedsRef = useRef<Float32Array | null>(null);
  const brightnessRef = useRef<Float32Array | null>(null);
  const lastRef = useRef(0);

  const FONT_SIZE = 20;
  const CHARS = "01";
  const FPS = 28;
  const INTERVAL = 1000 / FPS;

  /* ── Mouse tracker ── */
  const onMouseMove = useCallback((e: MouseEvent) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mouseRef.current = {
      x: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)),
      y: Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)),
    };
  }, []);

  /* ── Main effect ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* Initialise columns */
    let cols = 0;
    const init = () => {
      canvas.width = wrap.clientWidth;
      canvas.height = wrap.clientHeight;
      cols = Math.ceil(canvas.width / FONT_SIZE) + 1;
      dropsRef.current = new Float32Array(cols).map(() => Math.random() * -60);
      speedsRef.current = new Float32Array(cols).map(() => 0.4 + Math.random() * 0.55);
      brightnessRef.current = new Float32Array(cols).map(() => 0.55 + Math.random() * 0.45);
    };
    init();

    const ro = new ResizeObserver(init);
    ro.observe(wrap);
    wrap.addEventListener("mousemove", onMouseMove);

    /* ── Draw loop ── */
    const draw = (ts: number) => {
      rafRef.current = requestAnimationFrame(draw);
      if (ts - lastRef.current < INTERVAL) return;
      lastRef.current = ts;

      const W = canvas.width;
      const H = canvas.height;
      const drops = dropsRef.current!;
      const speeds = speedsRef.current!;
      const bri = brightnessRef.current!;

      /* Ghost trail */
      ctx.fillStyle = "rgba(0,0,0,0.055)";
      ctx.fillRect(0, 0, W, H);

      ctx.font = `bold ${FONT_SIZE}px 'JetBrains Mono', 'Courier New', monospace`;
      ctx.textAlign = "center";

      for (let i = 0; i < cols; i++) {
        const x = i * FONT_SIZE + FONT_SIZE / 2;
        const y = drops[i] * FONT_SIZE;
        const b = bri[i];
        const char = Math.random() > 0.5 ? "0" : "1";

        /* Head glyph — hot white-red */
        ctx.shadowColor = "#FF1A1A";
        ctx.shadowBlur = 18;
        ctx.fillStyle = `rgba(255,${Math.round(80 + b * 60)},${Math.round(60 + b * 40)},${b})`;
        ctx.fillText(char, x, y);
        ctx.shadowBlur = 0;

        /* Occasionally draw a circuit-board node dot */
        if (Math.random() < 0.012) {
          ctx.beginPath();
          ctx.arc(x, y - FONT_SIZE * 0.4, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(146,5,19,${b * 0.9})`;
          ctx.shadowColor = "#FF0000";
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        /* Advance */
        drops[i] += speeds[i];
        if (drops[i] * FONT_SIZE > H + FONT_SIZE && Math.random() > 0.97) {
          drops[i] = -Math.random() * 25;
          speeds[i] = 0.35 + Math.random() * 0.6;
          bri[i] = 0.5 + Math.random() * 0.5;
        }
      }

      /* Smooth 3D tilt lerp */
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      tiltRef.current.rx += ((my - 0.5) * 14 - tiltRef.current.rx) * 0.07;
      tiltRef.current.ry += ((mx - 0.5) * -20 - tiltRef.current.ry) * 0.07;

      wrap.style.transform =
        `perspective(1100px) rotateX(${tiltRef.current.rx}deg) rotateY(${tiltRef.current.ry}deg) scale3d(1.02,1.02,1)`;
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      wrap.removeEventListener("mousemove", onMouseMove);
    };
  }, [onMouseMove]);

  return (
    <div
      ref={wrapRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform",
        backgroundImage: "url('/matrix-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        transition: "transform 0.05s linear",
      }}
    >
      {/* Binary rain layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: "screen", opacity: 0.88 }}
      />
      {/* Edge vignette to blend with page */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(15,16,19,0.55) 100%)",
        }}
      />
      {/* Bottom fade — connects to About content below */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #0F1013)",
        }}
      />
    </div>
  );
}
