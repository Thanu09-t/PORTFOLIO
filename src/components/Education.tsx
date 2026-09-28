"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { EDUCATION } from "@/lib/data";
import ScrollRevealText from "./ScrollRevealText";

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

export default function Education() {
  const [display, setDisplay] = useState("0.00");
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => v.toFixed(2));

  useEffect(() => {
    const unsub = rounded.on("change", setDisplay);
    return unsub;
  }, [rounded]);

  return (
    <section id="education" className="pt-28 pb-40 px-6 md:px-24">
      <motion.div
        className="card-panel card-3d rounded-md p-8 md:p-12 grid md:grid-cols-[1fr_auto] gap-10 items-center border border-[#4C5665]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        onViewportEnter={() => animate(count, EDUCATION.cgpa, { duration: 1.6, ease: "easeOut" })}
      >
        <div className="depth-layer-1">
          <span className="eyebrow text-[#F4AEA8] font-semibold inline-block">
            EDUCATION
          </span>
          <ScrollRevealText
            text={EDUCATION.degree}
            as="h3"
            className="font-display font-semibold text-[1.8rem] md:text-[2.8rem] leading-[1.15] mt-3 depth-layer-2"
            stagger={0.55}
          />
          <div className="mt-3 text-[#E1E3E4] text-[1.05rem] font-medium depth-layer-1">{EDUCATION.school}</div>
          <div className="font-mono text-[12px] text-[#F4AEA8] mt-2 tracking-wider font-semibold depth-layer-1">
            {EDUCATION.years}
          </div>
        </div>
        <div className="text-right depth-layer-3">
          <div className="card-panel rounded-md px-6 py-4 inline-block text-center border border-[#4C5665] bg-[#0F1013]/90">
            <div className="font-display font-bold text-[3rem] md:text-[5rem] leading-none text-[#F4AEA8] drop-shadow-[0_0_18px_rgba(146,5,19,0.5)]">
              {display}
            </div>
            <div className="font-mono text-[10.5px] text-[#BBC6CF] tracking-[0.18em] mt-2 font-semibold">CUMULATIVE CGPA</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
