"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollStore } from "@/lib/scrollStore";
import { useReducedMotion } from "@/lib/hooks";

gsap.registerPlugin(ScrollTrigger);

/**
 * Drives smooth (Lenis) scrolling and keeps GSAP ScrollTrigger + the
 * persistent scroll store in sync. Respects prefers-reduced-motion by
 * skipping the smoothing layer entirely (native scroll is used instead).
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    const updateRaf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateRaf);
    gsap.ticker.lagSmoothing(0);

    const onResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      gsap.ticker.remove(updateRaf);
      window.removeEventListener("resize", onResize);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  // Track overall document scroll progress + a couple of light globals
  // for the persistent 3D scene, independent of Lenis/reduced-motion.
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      scrollStore.progress = max > 0 ? window.scrollY / max : 0;
    };
    const onMouse = (e: MouseEvent) => {
      scrollStore.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      scrollStore.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  // Smooth-scroll anchor nav links via Lenis (falls back to native).
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!target) return;
      const id = target.getAttribute("href")?.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      if (lenisRef.current) {
        // If scrolling to projects or sections, scroll smoothly to element top
        lenisRef.current.scrollTo(el, { duration: 1.2, offset: 0 });
      } else {
        el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [reduced]);

  return <>{children}</>;
}
