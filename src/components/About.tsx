"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const STATEMENT =
  "I build intelligent systems that turn raw data into decisions people can act on.";

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.7", "start 0.1"],
  });
  const words = STATEMENT.split(" ");

  return (
    <section id="about" className="px-6 md:px-24 py-44">
      <div className="grid md:grid-cols-[1.3fr_0.8fr] gap-20">
        <div>
          <motion.p
            className="eyebrow text-[#F4AEA8]"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            variants={fadeUp}
          >
            ABOUT
          </motion.p>

          <h2
            ref={ref}
            className="font-display font-medium text-[1.7rem] md:text-[2.7rem] leading-[1.28] tracking-tight mt-4 text-[#E1E3E4]"
          >
            {words.map((w, i) => (
              <Word key={i} word={w} index={i} total={words.length} progress={scrollYProgress} />
            ))}
          </h2>

          <motion.p
            className="mt-8 max-w-xl text-[#BBC6CF] text-[1.02rem] leading-[1.75]"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
          >
            I&rsquo;m pursuing a B.E. in Artificial Intelligence and Machine
            Learning, and I spend most of my time in the space between
            research and product — training models, shaping the pipelines
            around them, and building the interfaces that make them usable.
            Recent work spans acoustic diagnostics, generative-AI copilots,
            computer vision, and media forensics.
          </motion.p>
        </div>

        <div className="flex flex-col gap-4">
          {[
            ["SPECIALIZATION", "Applied ML & Generative AI"],
            ["EDUCATION", "B.E. — AI & Machine Learning"],
            ["CURRENT FOCUS", "LLM tooling & applied deep learning"],
          ].map(([k, v]) => (
            <motion.div
              key={k}
              className="card-panel rounded-md p-5 border border-[#4C5665] card-3d"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.6 }}
              variants={fadeUp}
            >
              <div className="font-mono text-[10px] tracking-wider text-[#920513] font-semibold depth-layer-1">{k}</div>
              <div className="font-display text-base md:text-lg mt-1.5 font-medium text-[#E1E3E4] depth-layer-2">{v}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Word({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [0.4, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block mr-[0.25em]">
      {word}
    </motion.span>
  );
}
