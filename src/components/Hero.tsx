"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { MapPin, ChevronDown } from "lucide-react";
import { site, attractions } from "@/data/site";
import { stagger, wordReveal, fadeUp } from "@/lib/motion";
import MagneticButton from "@/components/ui/MagneticButton";

const words = ["Race.", "Play.", "Repeat."];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      id="home"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Parallax background */}
      <motion.div style={{ y: imgY }} className="absolute inset-0 -z-10">
        <Image
          src="/images/hero.jpg"
          alt="Go-kart racing action at KR Funverse"
          fill
          priority
          sizes="100vw"
          className="scale-110 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/45 to-ink" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 to-transparent" />
        <div className="spotlight absolute inset-0" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="mx-auto w-full max-w-7xl px-5 pt-24 sm:px-8"
      >
        <motion.div variants={stagger(0.12, 0.1)} initial="hidden" animate="show">
          <motion.div
            variants={fadeUp}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur"
          >
            <MapPin size={15} className="text-racing" />
            <span className="text-xs uppercase tracking-[0.2em] text-chalk/80">
              {site.location.city} · Telangana
            </span>
          </motion.div>

          <h1 className="font-display text-[19vw] leading-[0.82] sm:text-[15vw] lg:text-[11rem]">
            <span className="sr-only">Race. Play. Repeat.</span>
            <span aria-hidden className="flex flex-wrap gap-x-6">
              {words.map((w, i) => (
                <span key={w} className="overflow-hidden">
                  <motion.span
                    variants={wordReveal}
                    className={
                      i === 2
                        ? "inline-block text-gradient-racing"
                        : "inline-block"
                    }
                  >
                    {w}
                  </motion.span>
                </span>
              ))}
            </span>
          </h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-lg leading-relaxed text-smoke sm:text-xl"
          >
            {site.intro}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-4">
            <MagneticButton href="/book" size="lg">
              Book Your Race
            </MagneticButton>
            <MagneticButton href="/#attractions" variant="outline" size="lg">
              Explore the Arena
            </MagneticButton>
          </motion.div>

          {/* Activity pills */}
          <motion.ul
            variants={fadeUp}
            className="mt-10 flex flex-wrap gap-2.5"
          >
            {attractions.map((a) => (
              <li
                key={a.id}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 font-display text-base uppercase tracking-widest text-chalk/75 backdrop-blur"
              >
                {a.name}
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-ash"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={20} />
        </motion.span>
      </motion.div>
    </section>
  );
}
