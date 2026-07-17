"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Menu } from "lucide-react";
import { navLinks, site } from "@/data/site";
import { cn } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";
import MobileMenu from "@/components/MobileMenu";

const sectionIds = ["home", "attractions", "pricing", "gallery", "visit"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lightweight scrollspy — only affects sections that exist on the page.
  useEffect(() => {
    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          scrolled
            ? "border-b border-white/10 bg-ink/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-8">
          {/* Logo */}
          <Link href="/#home" className="group flex items-center gap-2.5" aria-label={site.name}>
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-racing font-display text-xl leading-none text-white transition-transform duration-300 group-hover:rotate-6 sm:h-10 sm:w-10">
              KR
            </span>
            <span className="font-display text-2xl tracking-wide sm:text-3xl">
              FUN<span className="text-racing">VERSE</span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => {
              const id = link.href.split("#")[1];
              const isActive = active === id;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group relative font-display text-lg uppercase tracking-widest text-chalk/80 transition-colors hover:text-chalk"
                  >
                    {link.label}
                    <span
                      className={cn(
                        "absolute -bottom-1.5 left-0 h-0.5 bg-racing transition-all duration-300 group-hover:w-full",
                        isActive ? "w-full" : "w-0"
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <MagneticButton href="/book" size="md">
                Book Now
              </MagneticButton>
            </div>
            <button
              onClick={() => setMenuOpen(true)}
              className="grid h-11 w-11 place-items-center rounded-lg border border-white/15 text-chalk transition-colors hover:border-racing hover:text-racing lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </nav>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
