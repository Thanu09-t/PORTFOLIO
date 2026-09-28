"use client";

import { motion } from "framer-motion";
import { EXPERIENCE } from "@/lib/data";
import ScrollRevealText from "./ScrollRevealText";

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

export default function Experience() {
  return (
    <section id="experience" className="pt-44 pb-16 px-6 md:px-24">
      <div className="max-w-3xl mb-5">
        <motion.p
          className="eyebrow text-[#F4AEA8]"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          variants={fadeUp}
        >
          EXPERIENCE
        </motion.p>
        <a
          href="/certificates/mindmatrix-internship-completion-letter.pdf"
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="OPEN"
          className="group inline-block mt-3"
          title="View MindMatrix Internship Completion Letter (PDF)"
        >
          <div className="flex items-baseline gap-2 md:gap-3 flex-wrap">
            <ScrollRevealText
              text="A short, deliberate history."
              className="font-display font-semibold text-[2rem] md:text-[4rem] leading-[1.05] tracking-tight group-hover:text-[#F4AEA8] transition-colors"
              stagger={0.5}
            />
            <span className="font-mono text-base md:text-2xl text-[#920513] group-hover:text-[#F4AEA8] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-200">
              ↗
            </span>
          </div>
        </a>
      </div>

      <div className="relative max-w-3xl mt-5 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-[#4C5665]">
        {EXPERIENCE.map((item) => (
          <TimelineItem key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}

function TimelineItem({
  year,
  title,
  body,
  link,
}: {
  year: string;
  title: string;
  body: string;
  link?: string;
}) {
  return (
    <motion.div
      className="relative ml-6 my-4 p-6 card-panel rounded-md border border-[#4C5665] card-3d group"
      initial={{ opacity: 0.3, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ duration: 0.4 }}
    >
      <span className="absolute -left-[30px] top-8 w-2.5 h-2.5 rounded-full bg-[#920513]" />
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="clean-toggle font-mono text-[10px] tracking-wider text-[#920513] font-semibold px-2.5 py-0.5 rounded inline-block depth-layer-1">
          {year}
        </div>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="VIEW"
            className="font-mono text-[11px] text-[#F4AEA8] hover:text-white inline-flex items-center gap-1 transition-colors underline-offset-4 hover:underline"
          >
            Certificate ↗
          </a>
        )}
      </div>
      <h4 className="font-display font-semibold text-lg md:text-xl mt-2.5 text-[#E1E3E4] depth-layer-2">
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="VIEW"
            className="hover:text-[#F4AEA8] transition-colors"
          >
            {title}
          </a>
        ) : (
          title
        )}
      </h4>
      <p className="text-[#BBC6CF] mt-2 max-w-xl leading-[1.65] text-[0.92rem] depth-layer-1">{body}</p>
    </motion.div>
  );
}
