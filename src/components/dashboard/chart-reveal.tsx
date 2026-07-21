"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

/**
 * Scroll-triggered reveal for one chart.
 *
 * The chart stays mounted the whole time — so the card never collapses and
 * recharts can measure its real width — but is held at opacity 0 until it
 * scrolls into view. On entry the card fades/rises and the series replay their
 * mount animation.
 *
 * Why the remount key: recharts 3.x caches each series' last geometry in a ref
 * (previousRectanglesRef / previousPointsRef / previousSectorsRef). While
 * animation is off it writes the FINAL geometry there, so simply flipping
 * `isAnimationActive` later interpolates final -> final and shows nothing.
 * Changing `chartKey` remounts the chart root, clearing those refs so the
 * series genuinely grow from zero.
 */
export type ChartRevealArgs = {
  /** Put on the <AreaChart>/<BarChart>/<PieChart> element: key={chartKey}. */
  chartKey: string;
  /** Spread onto every <Area>/<Bar>/<Pie>: {...anim}. */
  anim: {
    isAnimationActive: boolean | "auto";
    animationDuration: number;
    animationEasing: "ease-out";
  };
};

/** Series defaults differ (Bar 400ms, Area/Pie 1500ms) — normalise them. */
const DURATION = 800;

export function ChartReveal({
  children,
  className,
}: {
  children: (args: ChartRevealArgs) => React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  // `once` so a chart never re-animates when the user scrolls back up.
  const inView = useInView(ref, { once: true, amount: 0.3 });
  // null until mounted; treat that as "no preference".
  const reduced = useReducedMotion() ?? false;
  const shown = inView || reduced;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={
        reduced ? { duration: 0 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
      }
    >
      {children({
        chartKey: shown ? "shown" : "idle",
        anim: {
          // "auto" lets recharts resolve prefers-reduced-motion itself.
          isAnimationActive: shown ? "auto" : false,
          animationDuration: DURATION,
          animationEasing: "ease-out",
        },
      })}
    </motion.div>
  );
}
