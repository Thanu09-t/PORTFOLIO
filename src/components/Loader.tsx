"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STATUSES = [
  "loading scene",
  "compiling shaders",
  "mapping neural field",
  "calibrating camera",
  "system ready",
];

export default function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + Math.random() * 18 + 6);
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => setVisible(false), 350);
        }
        return next;
      });
    }, 180);
    return () => clearInterval(timer);
  }, []);

  const statusIndex = Math.min(
    STATUSES.length - 1,
    Math.floor((progress / 100) * STATUSES.length)
  );

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[10000] bg-[#0F1013] flex flex-col items-center justify-center gap-4"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="font-mono text-[11px] tracking-[0.25em] text-[#BBC6CF]">
            INITIALIZING SYSTEM
          </div>
          <div className="font-display text-5xl md:text-7xl font-semibold tabular-nums text-[#E1E3E4]">
            {String(Math.floor(progress)).padStart(2, "0")}
          </div>
          <div className="w-56 h-[2px] bg-[#4C5665] relative overflow-hidden">
            <span
              className="absolute inset-y-0 left-0 bg-[#920513] transition-[width] duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="font-mono text-[10px] tracking-[0.15em] text-[#4C5665] h-3.5">
            {STATUSES[statusIndex]}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
