import type { Variants, Transition } from "motion/react";

export const easeOutExpo: Transition["ease"] = [0.16, 1, 0.3, 1];

/** Fade + rise, used for most scroll reveals. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOutExpo },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: easeOutExpo } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

/** Stagger container — children should use `fadeUp` (or similar). */
export const stagger = (staggerChildren = 0.1, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
});

/** Word-by-word reveal for headlines. */
export const wordReveal: Variants = {
  hidden: { opacity: 0, y: "0.7em", rotateX: 40 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.75, ease: easeOutExpo },
  },
};

/** Shared viewport config so reveals fire once, a little before fully on-screen. */
export const inView = { once: true, amount: 0.25 } as const;
