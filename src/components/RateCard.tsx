import { Check, Star } from "lucide-react";
import { rateCard } from "@/data/site";
import { cn } from "@/lib/utils";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import MagneticButton from "@/components/ui/MagneticButton";

export default function RateCard({ withSection = true }: { withSection?: boolean }) {
  const grid = (
    <>
      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {rateCard.map((tier, i) => (
          <Reveal
            key={tier.name}
            delay={i * 0.1}
            className={cn(
              "relative flex flex-col rounded-2xl border p-7 sm:p-8",
              tier.popular
                ? "border-racing bg-gradient-to-b from-racing/10 to-carbon glow-racing lg:-translate-y-4"
                : "border-white/10 bg-carbon"
            )}
          >
            {tier.popular && (
              <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-racing px-4 py-1 font-display text-sm uppercase tracking-widest text-white">
                <Star size={13} className="fill-white" /> Most Popular
              </span>
            )}
            <h3 className="font-display text-3xl uppercase tracking-wide text-chalk">
              {tier.name}
            </h3>
            <p className="mt-1 text-sm text-smoke">{tier.note}</p>

            <div className="mt-6 flex items-end gap-2">
              <span className="font-display text-6xl leading-none text-chalk">
                ₹{tier.price}
              </span>
              <span className="pb-1 text-sm text-smoke">/ {tier.unit}</span>
            </div>

            <ul className="mt-7 space-y-3">
              {tier.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-chalk/85">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-racing/15 text-racing">
                    <Check size={13} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-2">
              <MagneticButton
                href="/book"
                variant={tier.popular ? "solid" : "outline"}
                className="w-full"
              >
                Book {tier.name}
              </MagneticButton>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.15}>
        <p className="mt-8 text-center text-xs text-ash">
          * Sample pricing shown. Please call us for current rates, lap counts and group packages.
        </p>
      </Reveal>
    </>
  );

  if (!withSection) return grid;

  return (
    <section id="pricing" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          align="center"
          kicker="Rate Card"
          title={
            <>
              Pick a <span className="text-gradient-racing">package</span>
            </>
          }
          description="Straightforward pricing for solo racers and full squads alike."
        />
        {grid}
      </div>
    </section>
  );
}
