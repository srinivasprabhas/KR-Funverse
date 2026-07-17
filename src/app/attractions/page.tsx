import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import { attractions } from "@/data/site";
import { cn } from "@/lib/utils";
import Reveal from "@/components/ui/Reveal";
import PageHeader from "@/components/ui/PageHeader";
import MagneticButton from "@/components/ui/MagneticButton";
import SafetyTrust from "@/components/SafetyTrust";

export const metadata: Metadata = {
  title: "Attractions",
  description:
    "Go-karting, box cricket and indoor games at KR Funverse, Ghatkesar, Hyderabad. Three ways to play under one roof.",
};

export default function AttractionsPage() {
  return (
    <>
      <PageHeader
        kicker="Attractions"
        title={
          <>
            Three ways to <span className="text-gradient-racing">play</span>
          </>
        }
        subtitle="From flat-out karting to floodlit box cricket and a floor of indoor games — here's everything waiting for you at the arena."
        image="/images/attraction-karting.jpg"
      />

      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="flex flex-col gap-24 sm:gap-32">
          {attractions.map((a, i) => {
            const reverse = i % 2 === 1;
            return (
              <div
                key={a.id}
                id={a.id}
                className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-2"
              >
                <Reveal className={cn(reverse && "lg:order-2")}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
                    <Image
                      src={a.image}
                      alt={a.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
                  </div>
                </Reveal>

                <div className={cn(reverse && "lg:order-1")}>
                  <Reveal className="mb-3 flex items-center gap-3">
                    <span className="h-px w-8 bg-racing" />
                    <span className="font-display text-lg uppercase tracking-[0.3em] text-racing">
                      {a.kicker}
                    </span>
                  </Reveal>
                  <Reveal delay={0.05}>
                    <h2 className="font-display text-5xl uppercase leading-none tracking-wide sm:text-6xl">
                      {a.name}
                    </h2>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <p className="mt-5 text-lg leading-relaxed text-smoke">{a.blurb}</p>
                  </Reveal>
                  <Reveal delay={0.15}>
                    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                      {a.features.map((f) => (
                        <li key={f} className="flex items-center gap-2.5 text-chalk/85">
                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-racing/15 text-racing">
                            <Check size={14} />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                  <Reveal delay={0.2} className="mt-8">
                    <MagneticButton href="/book">Book {a.name}</MagneticButton>
                  </Reveal>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <SafetyTrust />
    </>
  );
}
