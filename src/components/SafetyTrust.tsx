import { ShieldCheck, HardHat, Cctv, Ruler } from "lucide-react";
import { safety } from "@/data/site";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

const icons = { ShieldCheck, HardHat, Cctv, Ruler } as const;

export default function SafetyTrust() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          align="center"
          kicker="Peace of Mind"
          title={
            <>
              Fast, but <span className="text-gradient-racing">safe</span>
            </>
          }
          description="Speed is the thrill — safety is the standard. Here's how we look after every racer."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {safety.map((s, i) => {
            const Icon = icons[s.icon as keyof typeof icons] ?? ShieldCheck;
            return (
              <Reveal
                key={s.title}
                delay={i * 0.08}
                className="group rounded-2xl border border-white/10 bg-carbon p-7 transition-colors hover:border-racing/60"
              >
                <span className="grid h-14 w-14 place-items-center rounded-xl bg-racing/12 text-racing transition-transform duration-300 group-hover:scale-110">
                  <Icon size={26} />
                </span>
                <h3 className="mt-5 font-display text-2xl uppercase tracking-wide text-chalk">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-smoke">{s.desc}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
