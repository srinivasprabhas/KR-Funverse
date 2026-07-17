import { stats } from "@/data/site";
import Reveal from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";

export default function StatsCounter() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-carbon">
      <div className="grid-lines absolute inset-0 opacity-60" />
      <div className="spotlight absolute inset-0" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-5 py-16 sm:px-8 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 0.08}
            className="flex flex-col items-center text-center"
          >
            <div className="font-display text-6xl leading-none text-chalk sm:text-7xl">
              <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
            </div>
            <p className="mt-3 text-xs uppercase tracking-[0.25em] text-smoke sm:text-sm">
              {s.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
