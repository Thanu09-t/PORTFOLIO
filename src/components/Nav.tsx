"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NAV_ITEMS, type SectionId } from "@/lib/sections";
import { SECTION_CHANGE_EVENT } from "./SectionTracker";

export default function Nav({ ready }: { ready: boolean }) {
  const [active, setActive] = useState<SectionId>("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onSection = (e: Event) => {
      if (window.scrollY < 120) {
        setActive("home");
      } else {
        setActive((e as CustomEvent).detail);
      }
    };
    window.addEventListener(SECTION_CHANGE_EVENT, onSection);
    const onScroll = () => {
      if (window.scrollY < 120) {
        setActive("home");
      }
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener(SECTION_CHANGE_EVENT, onSection);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-5 left-5 md:top-7 md:left-9 z-[500] bg-[#0F1013] border border-[#4C5665] rounded-md px-4 py-2 font-display font-semibold text-xs tracking-wider text-[#E1E3E4]"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : -10 }}
        transition={{ duration: 0.5 }}
      >
        THANU<span className="text-[#920513] font-medium">SHREE</span>
      </motion.div>

      <motion.nav
        className={`fixed top-5 left-1/2 -translate-x-1/2 z-[500] flex max-w-[calc(100vw-2rem)] overflow-x-auto gap-1 p-1 rounded-md bg-[#0F1013] border ${
          scrolled ? "border-[#920513]" : "border-[#4C5665]"
        }`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : -10 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            data-cursor="OPEN"
            className={`relative whitespace-nowrap font-mono text-[9px] md:text-[10px] tracking-[0.12em] px-3.5 py-1.5 rounded transition-colors ${
              active === item.id
                ? "text-[#E1E3E4] font-medium"
                : "text-[#BBC6CF] hover:text-[#E1E3E4]"
            }`}
          >
            {active === item.id && (
              <motion.span
                layoutId="nav-pill"
                className="absolute inset-0 bg-[#920513] rounded -z-10"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}
            {item.label}
          </a>
        ))}
      </motion.nav>
    </>
  );
}
