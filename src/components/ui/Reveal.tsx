"use client";

import { motion } from "motion/react";
import type { Variants } from "motion/react";
import { fadeUp, inView } from "@/lib/motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variants?: Variants;
  /** Render as a different element (e.g. "li", "span"). Defaults to div. */
  as?: keyof typeof motion;
};

/**
 * Drop-in scroll reveal. Animates from hidden → show once the element scrolls
 * into view. Reduced-motion is handled globally via <MotionConfig>.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  variants = fadeUp,
  as = "div",
}: RevealProps) {
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      transition={{ delay }}
    >
      {children}
    </Tag>
  );
}
