"use client";

import { motion } from "motion/react";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

type MarqueeProps = {
  items: string[];
  duration?: number;
  reverse?: boolean;
  className?: string;
};

export default function Marquee({
  items,
  duration = 26,
  reverse = false,
  className,
}: MarqueeProps) {
  const row = [...items, ...items];
  return (
    <div className={cn("relative flex overflow-hidden select-none", className)}>
      <motion.div
        className="flex shrink-0 items-center gap-8 pr-8"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
        aria-hidden
      >
        {row.map((item, i) => (
          <Fragment key={i}>
            <span className="font-display text-3xl uppercase tracking-wider text-chalk/90 sm:text-4xl">
              {item}
            </span>
            <span className="text-racing text-2xl">✦</span>
          </Fragment>
        ))}
      </motion.div>
    </div>
  );
}
