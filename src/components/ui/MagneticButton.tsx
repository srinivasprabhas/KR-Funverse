"use client";

import Link from "next/link";
import { motion, useSpring, useReducedMotion } from "motion/react";
import type { MouseEvent } from "react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "ghost";
type Size = "md" | "lg";

type MagneticButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: Variant;
  size?: Size;
  className?: string;
  ariaLabel?: string;
};

const base =
  "group relative inline-flex items-center justify-center gap-2 font-display uppercase tracking-[0.12em] rounded-full transition-[filter,background-color,color,border-color] duration-300 will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flag focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

const sizes: Record<Size, string> = {
  md: "text-lg px-6 py-2.5",
  lg: "text-2xl px-8 py-3.5",
};

const variants: Record<Variant, string> = {
  solid:
    "bg-racing text-white hover:brightness-110 glow-racing shadow-lg shadow-racing/20",
  outline:
    "border border-white/25 text-chalk hover:border-flag hover:text-flag bg-white/[0.02] backdrop-blur",
  ghost: "text-chalk hover:text-flag",
};

export default function MagneticButton({
  children,
  href,
  onClick,
  type = "button",
  variant = "solid",
  size = "md",
  className,
  ariaLabel,
}: MagneticButtonProps) {
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 160, damping: 15, mass: 0.4 });
  const y = useSpring(0, { stiffness: 160, damping: 15, mass: 0.4 });

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  const classes = cn(base, sizes[size], variants[variant], className);
  const isInternal = href?.startsWith("/") && !href.startsWith("//");
  const isHash = href?.startsWith("/#") || href?.startsWith("#");

  const inner = isInternal ? (
    <Link
      href={href!}
      aria-label={ariaLabel}
      className={classes}
      scroll={!isHash}
    >
      {children}
    </Link>
  ) : href ? (
    <a
      href={href}
      aria-label={ariaLabel}
      className={classes}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ) : (
    <button type={type} onClick={onClick} aria-label={ariaLabel} className={classes}>
      {children}
    </button>
  );

  return (
    <motion.div
      style={{ x, y }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className="inline-block"
    >
      {inner}
    </motion.div>
  );
}
