"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { attractions } from "@/data/site";
import { cn } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";
import AttractionCard from "@/components/AttractionCard";

const filters = ["All", "Race", "Play"] as const;
type Filter = (typeof filters)[number];

export default function AttractionsGrid() {
  const [filter, setFilter] = useState<Filter>("All");
  const visible =
    filter === "All"
      ? attractions
      : attractions.filter((a) => a.category === filter);

  return (
    <section id="attractions" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            kicker="The Arena"
            title={
              <>
                Pick your <span className="text-gradient-racing">thrill</span>
              </>
            }
            description="Three ways to get the heart racing. Filter by what you're in the mood for."
          />

          {/* Filters */}
          <div className="flex gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "relative rounded-full px-5 py-2 font-display text-lg uppercase tracking-widest transition-colors",
                  filter === f ? "text-white" : "text-smoke hover:text-chalk"
                )}
              >
                {filter === f && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-racing"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {f}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          layout
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((a) => (
              <AttractionCard key={a.id} attraction={a} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
