"use client";

import { useEffect, useRef, useState } from "react";
import { useIsTouch, useReducedMotion } from "@/lib/hooks";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouch();
  const reduced = useReducedMotion();
  const [label, setLabel] = useState("");
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (isTouch) return;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      }
    };

    const loop = () => {
      rx += (mx - rx) * (reduced ? 1 : 0.16);
      ry += (my - ry) * (reduced ? 1 : 0.16);
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };

    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest("[data-cursor], a, button");
      if (t) {
        setHover(true);
        setLabel(t.getAttribute("data-cursor") || (t.tagName === "A" ? "OPEN" : ""));
      }
    };
    const onOut = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest("[data-cursor], a, button");
      if (t) {
        setHover(false);
        setLabel("");
      }
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    loop();

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf);
    };
  }, [isTouch, reduced]);

  if (isTouch) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] w-1.5 h-1.5 rounded-full bg-[#E1E3E4] pointer-events-none"
      />
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 z-[9999] rounded-full border flex items-center justify-center font-mono text-[9px] tracking-wider pointer-events-none transition-[width,height,border-color,background] duration-200 ${
          hover ? "w-16 h-16 bg-[#0F1013] border-[#920513] text-[#E1E3E4]" : "w-8 h-8 border-[#4C5665] text-transparent"
        }`}
      >
        {label}
      </div>
    </>
  );
}
