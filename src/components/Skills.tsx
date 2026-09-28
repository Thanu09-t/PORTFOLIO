"use client";

import { motion } from "framer-motion";
import ScrollRevealText from "./ScrollRevealText";

import { SKILLS } from "@/lib/data";

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

export default function Skills() {
  return (
    <section id="skills" className="relative min-h-screen flex flex-col justify-center px-6 md:px-24 py-32">
      <div className="relative z-[3] max-w-4xl">
        <motion.p
          className="eyebrow text-[#F4AEA8]"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          variants={fadeUp}
        >
          CAPABILITIES & TECH STACK
        </motion.p>
        <ScrollRevealText
          text="A working set of tools across machine learning, data and product engineering."
          className="font-display font-semibold text-[2rem] md:text-[3.6rem] leading-[1.1] tracking-tight mt-3"
          stagger={0.65}
        />

        {/* Crisp Skills Tag Cloud Grid */}
        <motion.div
          className="flex flex-wrap gap-3 mt-10"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.04, delayChildren: 0.2 },
            },
          }}
        >
          {SKILLS.map((skill) => (
            <motion.span
              key={skill}
              variants={{
                hidden: { opacity: 0, y: 15 },
                show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              className="clean-toggle font-mono text-[11px] md:text-[12px] tracking-wider px-4 py-2 rounded-md bg-[#0F1013]/90 border border-[#4C5665] text-[#E1E3E4] hover:border-[#920513] hover:text-white hover:bg-[#920513]/20 transition-all shadow-md cursor-default"
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>
      </div>
      <div className="mt-12 font-mono text-[10.5px] text-[#BBC6CF] tracking-wider">
        CORE COMPETENCIES — APPLIED ARTIFICIAL INTELLIGENCE & SOFTWARE ARCHITECTURE
      </div>
    </section>
  );
}
