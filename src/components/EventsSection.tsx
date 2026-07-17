import Image from "next/image";
import Link from "next/link";
import { Cake, Briefcase, Users, ArrowUpRight } from "lucide-react";
import { events } from "@/data/site";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

const icons = { Cake, Briefcase, Users } as const;

export default function EventsSection() {
  return (
    <section id="events" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          kicker="Celebrate Here"
          title={
            <>
              Events &amp; <span className="text-gradient-racing">group fun</span>
            </>
          }
          description="Birthdays, team outings or a big group of friends — we'll turn it into a race day to remember."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {events.map((e, i) => {
            const Icon = icons[e.icon as keyof typeof icons] ?? Users;
            return (
              <Reveal key={e.title} delay={i * 0.1}>
                <Link
                  href="/book"
                  className="group relative flex min-h-[24rem] flex-col justify-end overflow-hidden rounded-2xl border border-white/10"
                >
                  <Image
                    src={e.image}
                    alt={e.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />
                  <div className="relative p-7">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-racing text-white">
                      <Icon size={22} />
                    </span>
                    <h3 className="mt-5 font-display text-3xl uppercase tracking-wide text-chalk">
                      {e.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-smoke">{e.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 font-display text-lg uppercase tracking-widest text-flag">
                      Plan yours
                      <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
