import type { Metadata } from "next";
import { HelpCircle } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import PageHeader from "@/components/ui/PageHeader";
import RateCard from "@/components/RateCard";
import MagneticButton from "@/components/ui/MagneticButton";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Go-karting and group package pricing at KR Funverse, Ghatkesar, Hyderabad. Simple rates for solo racers and full squads.",
};

const notes = [
  "Prices are indicative and may change during weekends, holidays and special events.",
  "Group and corporate packages can be customised — just ask.",
  "Safety gear is provided for every karting session at no extra cost.",
  "Call or WhatsApp us to confirm current rates and availability before you visit.",
];

export default function PricingPage() {
  return (
    <>
      <PageHeader
        kicker="Pricing"
        title={
          <>
            Simple, honest <span className="text-gradient-racing">rates</span>
          </>
        }
        subtitle="Pick a package below. Every price covers the fun — safety gear included."
      />

      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <RateCard withSection={false} />

        {/* Notes */}
        <div className="mt-20 grid gap-6 lg:grid-cols-2">
          <Reveal className="rounded-2xl border border-white/10 bg-carbon p-8">
            <h3 className="flex items-center gap-2 font-display text-2xl uppercase tracking-wide text-chalk">
              <HelpCircle size={22} className="text-racing" /> Good to know
            </h3>
            <ul className="mt-5 space-y-3">
              {notes.map((n) => (
                <li key={n} className="flex items-start gap-3 text-smoke">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-racing" />
                  {n}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal
            delay={0.1}
            className="flex flex-col items-start justify-center rounded-2xl border border-racing/40 bg-gradient-to-br from-racing/10 to-carbon p-8"
          >
            <h3 className="font-display text-4xl uppercase leading-none tracking-wide text-chalk sm:text-5xl">
              Planning a big group?
            </h3>
            <p className="mt-4 text-smoke">
              Birthdays, college crews and corporate teams get custom packages and priority slots.
              Tell us what you need and we&apos;ll build the perfect race day.
            </p>
            <div className="mt-7">
              <MagneticButton href="/book">Get a custom quote</MagneticButton>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
