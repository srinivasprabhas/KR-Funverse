import Image from "next/image";
import { Flag, Gauge, Sparkles } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import MagneticButton from "@/components/ui/MagneticButton";

const points = [
  { icon: Flag, title: "Three ways to play", desc: "Karting, box cricket and indoor games under one roof." },
  { icon: Gauge, title: "Built for adrenaline", desc: "A proper race-day buzz from the moment you arrive." },
  { icon: Sparkles, title: "Made for groups", desc: "Birthdays, friends, teams — the more the merrier." },
];

export default function AboutIntro() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
        {/* Image */}
        <Reveal>
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[5/4]">
              <Image
                src="/images/about.jpg"
                alt="Go-karts lined up on the KR Funverse track"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
            </div>
            {/* Checkered accent */}
            <div className="checkers absolute -left-4 -top-4 -z-10 h-24 w-24 text-white/10" />
            {/* Floating badge */}
            <div className="absolute -bottom-5 -right-3 rounded-xl border border-white/10 bg-carbon/90 px-5 py-4 backdrop-blur sm:-right-5">
              <p className="font-display text-4xl leading-none text-flag">NEW</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-smoke">in Ghatkesar</p>
            </div>
          </div>
        </Reveal>

        {/* Copy */}
        <div>
          <SectionHeading
            kicker="Welcome"
            title={
              <>
                Hyderabad&apos;s new
                <br />
                home of <span className="text-gradient-racing">speed</span>
              </>
            }
            description="KR Funverse brings the thrill of the track to Ghatkesar. Whether you're chasing your first checkered flag or defending your lap record, there's a lane here with your name on it — then keep the energy rolling with box cricket and a floor full of indoor games."
          />

          <ul className="mt-10 space-y-5">
            {points.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.08} className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-racing">
                  <p.icon size={20} />
                </span>
                <span>
                  <span className="block font-display text-xl uppercase tracking-wide text-chalk">
                    {p.title}
                  </span>
                  <span className="text-sm text-smoke">{p.desc}</span>
                </span>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.1} className="mt-10">
            <MagneticButton href="/attractions" variant="outline">
              See what&apos;s inside
            </MagneticButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
