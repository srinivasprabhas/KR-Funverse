"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Check } from "lucide-react";
import type { Attraction } from "@/data/site";

export default function AttractionCard({ attraction }: { attraction: Attraction }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
      className="group relative flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 sm:min-h-[30rem]"
    >
      <Image
        src={attraction.image}
        alt={attraction.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
      <div className="absolute inset-0 bg-ink/10 transition-colors duration-500 group-hover:bg-transparent" />

      {/* Category badge */}
      <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-ink/50 px-3 py-1 font-display text-sm uppercase tracking-widest text-flag backdrop-blur">
        {attraction.kicker}
      </span>

      <div className="relative p-6 sm:p-7">
        <h3 className="font-display text-4xl uppercase leading-none tracking-wide sm:text-5xl">
          {attraction.name}
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-smoke">
          {attraction.blurb}
        </p>

        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
          {attraction.features.map((f) => (
            <li key={f} className="flex items-center gap-1.5 text-xs text-chalk/70">
              <Check size={13} className="text-racing" />
              {f}
            </li>
          ))}
        </ul>

        <Link
          href="/attractions"
          className="mt-5 inline-flex items-center gap-1.5 font-display text-lg uppercase tracking-widest text-chalk transition-colors hover:text-flag"
        >
          Explore
          <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Link>
      </div>
    </motion.article>
  );
}
