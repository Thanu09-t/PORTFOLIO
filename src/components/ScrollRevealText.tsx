"use client";

/**
 * ScrollRevealText
 * ─────────────────────────────────────────────────────────────────
 * Splits text into words. Each word fades + lifts from dim to bright
 * as it scrolls through the viewport center, creating a flowing
 * "highlight" wave effect driven entirely by scroll position.
 *
 * Usage:
 *   <ScrollRevealText text="Hello world" className="your-heading-classes" />
 *   <ScrollRevealText as="h3" text="Sub heading" stagger={0.6} />
 */

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type Tag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";

interface Props {
  text: string;
  as?: Tag;
  className?: string;
  /** 0–1 fraction: how much of the scroll range each word occupies. Default 0.5 */
  stagger?: number;
  /** Scroll offset start. Default "start 0.85" */
  start?: string;
  /** Scroll offset end. Default "start 0.1" */
  end?: string;
}

function WordSpan({
  word,
  index,
  total,
  stagger,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  stagger: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const band = stagger / total;
  const wordStart = (index / total) * stagger;
  const wordEnd = wordStart + band;

  const opacity = useTransform(progress, [wordStart, wordEnd], [0.12, 1]);
  const y = useTransform(progress, [wordStart, wordEnd], [12, 0]);
  /* Crimson → white color sweep */
  const color = useTransform(
    progress,
    [wordStart, wordStart + band * 0.3, wordEnd],
    ["#6B1018", "#D94050", "#E1E3E4"]
  );

  return (
    <motion.span
      style={{ opacity, y, color, display: "inline-block", marginRight: "0.28em" }}
    >
      {word}
    </motion.span>
  );
}

export default function ScrollRevealText({
  text,
  as: Tag = "h2",
  className = "",
  stagger = 0.55,
  start = "start 0.85",
  end = "start 0.1",
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref as React.RefObject<HTMLElement>,
    offset: [start, end] as any,
  });

  const words = text.split(" ");

  return (
    <Tag
      /* @ts-expect-error — dynamic tag ref typing */
      ref={ref}
      className={className}
      aria-label={text}
    >
      {words.map((word, i) => (
        <WordSpan
          key={i}
          word={word}
          index={i}
          total={words.length}
          stagger={stagger}
          progress={scrollYProgress}
        />
      ))}
    </Tag>
  );
}
