"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Image from "next/image";
import { PROJECTS } from "@/lib/data";
import { useIsTouch, useReducedMotion } from "@/lib/hooks";
import ScrollRevealText from "./ScrollRevealText";

gsap.registerPlugin(ScrollTrigger);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const [label, setLabel] = useState(`01 / ${String(PROJECTS.length).padStart(2, "0")}`);
  const isTouch = useIsTouch();
  const reduced = useReducedMotion();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const wrap = wrapRef.current;
      const section = sectionRef.current;
      if (!track || !wrap || !section) return;

      const setupTrigger = () => {
        const trackWidth = track.scrollWidth;
        const wrapWidth = wrap.clientWidth;
        const scrollDist = Math.max(trackWidth - wrapWidth, 0);

        return ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => "+=" + (scrollDist + window.innerHeight * 0.8),
          pin: true,
          anticipatePin: 1,
          scrub: 0.8,
          onUpdate(self) {
            gsap.set(track, { x: -scrollDist * self.progress });
            const idx = Math.min(
              PROJECTS.length - 1,
              Math.floor(self.progress * PROJECTS.length)
            );
            setLabel(
              `${String(idx + 1).padStart(2, "0")} / ${String(PROJECTS.length).padStart(2, "0")}`
            );
            if (fillRef.current) {
              fillRef.current.style.width = `${self.progress * 100}%`;
            }
          },
        });
      };

      const trigger = setupTrigger();
      return () => trigger.kill();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (isTouch || reduced) return;
    const cards = trackRef.current?.querySelectorAll<HTMLDivElement>(".proj-card");
    if (!cards) return;
    const handlers: Array<() => void> = [];

    cards.forEach((card) => {
      const bgImg = card.querySelector<HTMLElement>(".proj-bg-img");
      const glare = card.querySelector<HTMLElement>(".proj-glare");

      const onMove = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;

        // 3D card tilt
        gsap.to(card, {
          rotateY: px * 10,
          rotateX: -py * 10,
          duration: 0.35,
          ease: "power2.out",
          transformPerspective: 900,
        });

        // Inverse parallax for background image creating depth
        if (bgImg) {
          gsap.to(bgImg, {
            x: -px * 36,
            y: -py * 28,
            scale: 1.18,
            rotateY: -px * 4,
            rotateX: py * 4,
            duration: 0.45,
            ease: "power2.out",
          });
        }

        // Specular sheen tracking cursor
        if (glare) {
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          glare.style.opacity = "1";
          glare.style.background = `radial-gradient(circle 380px at ${x}px ${y}px, rgba(244, 174, 168, 0.16), transparent 70%)`;
        }
      };

      const onLeave = () => {
        gsap.to(card, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.7,
          ease: "power3.out",
        });
        if (bgImg) {
          gsap.to(bgImg, {
            x: 0,
            y: 0,
            scale: 1.1,
            rotateY: 0,
            rotateX: 0,
            duration: 0.7,
            ease: "power3.out",
          });
        }
        if (glare) {
          glare.style.opacity = "0";
        }
      };

      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      handlers.push(() => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => handlers.forEach((h) => h());
  }, [isTouch, reduced]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative w-full h-screen min-h-[620px] max-h-[1080px] flex flex-col justify-between pt-20 pb-10 px-6 md:px-16 lg:px-24 overflow-hidden"
    >
      {/* Top Header */}
      <div className="max-w-3xl flex-shrink-0">
        <motion.p
          className="eyebrow text-[#F4AEA8]"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          variants={fadeUp}
        >
          SELECTED WORK
        </motion.p>
        <ScrollRevealText
          text="Projects, in sequence."
          className="font-display font-semibold text-[1.8rem] sm:text-[2.5rem] md:text-[3.2rem] leading-[1.08] tracking-tight mt-1.5"
          stagger={0.45}
        />
      </div>

      {/* Center Horizontal Rail */}
      <div ref={wrapRef} className="project-rail overflow-hidden my-auto py-2">
        <div ref={trackRef} className="project-rail-track flex gap-6 md:gap-8 w-max">
          {PROJECTS.map((p, i) => (
            <div
              key={p.title}
              className="group relative proj-card card-panel rounded-xl p-6 sm:p-8 md:p-9 flex flex-col justify-between max-h-[58vh] min-h-[400px] md:min-h-[430px] card-3d overflow-hidden border border-[#4C5665] hover:border-[#920513] transition-all duration-300 shadow-2xl"
              style={{
                width: "min(82vw, 680px)",
                flexShrink: 0,
                transformStyle: "preserve-3d",
              }}
            >
              {/* 3D Motionful Parallax Background Image */}
              {p.image && (
                <div
                  className="proj-bg-container absolute inset-0 overflow-hidden rounded-xl pointer-events-none z-0"
                  style={{ transform: "translateZ(-30px)" }}
                >
                  <div className="proj-bg-img absolute inset-0 w-full h-full scale-[1.1] transition-all duration-500 opacity-75 group-hover:opacity-90">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 82vw, 680px"
                      className="object-cover object-center filter brightness-[0.95] contrast-[1.05]"
                      priority={i < 2}
                    />
                  </div>

                  {/* Balanced Gradient Overlays: keeps picture clearly visible while ensuring text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E]/90 via-[#0B0C0E]/45 to-[#0B0C0E]/20" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C0E]/75 via-[#0B0C0E]/35 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(146,5,19,0.2),transparent_70%)]" />

                  {/* Dynamic Specular Sheen layer */}
                  <div className="proj-glare absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none" />
                </div>
              )}

              {/* Card Content Top Header */}
              <div className="relative z-10 flex justify-between items-center pb-2 depth-layer-1">
                <span className="font-mono text-[11px] text-[#BBC6CF]/70 tracking-wider">
                  {String(i + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
                </span>
                <span className="font-mono text-[10px] sm:text-[11px] text-[#F4AEA8] tracking-wider font-semibold border border-[#4C5665]/80 bg-[#0B0C0E]/60 backdrop-blur-md px-3 py-1 rounded">
                  {p.cat}
                </span>
              </div>

              {/* Card Content Middle Body */}
              <div className="relative z-10 my-auto py-2 depth-layer-2">
                <h3 className="font-display font-semibold text-[1.4rem] sm:text-[1.8rem] md:text-[2.2rem] tracking-tight leading-snug text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
                  {p.title}
                </h3>
                <p className="mt-2.5 sm:mt-3 text-[#E6ECEF] leading-[1.65] max-w-xl text-[0.88rem] sm:text-[0.95rem] drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                  {p.desc}
                </p>
                <div className="flex flex-wrap gap-2 mt-4 sm:mt-5">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="clean-toggle font-mono text-[9px] sm:text-[9.5px] tracking-wide px-3 py-1 rounded bg-[#0B0C0E]/70 backdrop-blur-sm border border-[#4C5665]/60 hover:border-[#920513]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Content Bottom Footer */}
              <div className="relative z-10 pt-3 depth-layer-3">
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="VIEW"
                  onClick={(event) => {
                    if (p.placeholder) event.preventDefault();
                  }}
                  aria-label={
                    p.placeholder
                      ? `${p.title} case study coming soon`
                      : `View ${p.title} on GitHub`
                  }
                  className="bg-[#920513] text-[#E1E3E4] border border-[#920513] font-mono text-[10px] sm:text-[10.5px] tracking-wider rounded px-4 py-2 inline-flex items-center gap-2 font-medium hover:bg-[#920513]/85 transition-all shadow-[0_4px_16px_rgba(146,5,19,0.35)]"
                >
                  {p.placeholder ? "CASE STUDY SOON" : "GITHUB"} {p.placeholder ? "" : "↗"}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Progress Indicator */}
      <div className="flex items-center gap-4 flex-shrink-0 max-w-[680px] w-full">
        <span className="font-mono text-[10.5px] text-[#BBC6CF] tracking-wider">{label}</span>
        <div className="flex-1 h-[2px] bg-[#4C5665] relative rounded overflow-hidden">
          <span
            ref={fillRef}
            className="absolute inset-y-0 left-0 bg-[#920513] transition-all duration-75"
            style={{ width: "0%" }}
          />
        </div>
      </div>
    </section>
  );
}
