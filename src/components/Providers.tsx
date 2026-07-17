"use client";

import { MotionConfig } from "motion/react";

/**
 * App-wide motion configuration. `reducedMotion="user"` makes every Motion
 * animation honor the visitor's OS "reduce motion" setting automatically.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </MotionConfig>
  );
}
