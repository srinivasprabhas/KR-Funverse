import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";

type PageHeaderProps = {
  kicker?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  image?: string;
};

export default function PageHeader({ kicker, title, subtitle, image }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 pb-14 pt-32 sm:pt-40">
      {image ? (
        <>
          <Image src={image} alt="" fill sizes="100vw" className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/75 to-ink" />
        </>
      ) : (
        <div className="grid-lines absolute inset-0 opacity-60" />
      )}
      <div className="spotlight absolute inset-0" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-ash">
          <Link href="/" className="transition-colors hover:text-flag">
            Home
          </Link>
          <span>/</span>
          {kicker && <span className="text-racing">{kicker}</span>}
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="font-display text-6xl leading-[0.9] sm:text-7xl md:text-8xl">{title}</h1>
        </Reveal>
        {subtitle && (
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-2xl text-lg text-smoke">{subtitle}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
