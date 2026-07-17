"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "@/data/site";
import { cn } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    const id = setInterval(() => emblaApi.scrollNext(), 5500);
    return () => {
      clearInterval(id);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-carbon py-24 sm:py-32">
      <div className="spotlight absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          align="center"
          kicker="Racer Reviews"
          title={
            <>
              Loved by the <span className="text-gradient-racing">grid</span>
            </>
          }
        />

        <div className="mt-14 overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="min-w-0 flex-[0_0_100%] px-3 sm:flex-[0_0_80%] lg:flex-[0_0_60%]"
              >
                <figure className="h-full rounded-2xl border border-white/10 bg-ink/60 p-8 text-center sm:p-10">
                  <Quote className="mx-auto text-racing" size={34} />
                  <div className="mt-4 flex justify-center gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={18} className="fill-flag text-flag" />
                    ))}
                  </div>
                  <blockquote className="mt-5 text-lg leading-relaxed text-chalk sm:text-xl">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-6">
                    <span className="block font-display text-2xl uppercase tracking-wide text-chalk">
                      {t.name}
                    </span>
                    <span className="text-sm text-smoke">{t.role}</span>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-chalk transition-colors hover:border-flag hover:text-flag"
            aria-label="Previous review"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  selected === i ? "w-6 bg-racing" : "w-2 bg-white/20 hover:bg-white/40"
                )}
                aria-label={`Go to review ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-chalk transition-colors hover:border-flag hover:text-flag"
            aria-label="Next review"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
