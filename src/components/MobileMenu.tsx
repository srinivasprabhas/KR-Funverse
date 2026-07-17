"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Phone, MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { navLinks, site } from "@/data/site";
import { telUrl, whatsappUrl } from "@/lib/utils";

const linkVariants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] flex flex-col bg-ink/98 backdrop-blur-xl lg:hidden"
        >
          <div className="grain absolute inset-0 opacity-100" />
          <div className="relative flex h-16 items-center justify-between px-5 sm:h-20 sm:px-8">
            <span className="font-display text-2xl tracking-wide">
              FUN<span className="text-racing">VERSE</span>
            </span>
            <button
              onClick={onClose}
              className="grid h-11 w-11 place-items-center rounded-lg border border-white/15 text-chalk transition-colors hover:border-racing hover:text-racing"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="relative flex flex-1 flex-col justify-center gap-1 px-6">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                custom={i}
                variants={linkVariants}
                initial="hidden"
                animate="show"
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="block py-2 font-display text-5xl uppercase tracking-wide text-chalk transition-colors hover:text-racing sm:text-6xl"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              custom={navLinks.length}
              variants={linkVariants}
              initial="hidden"
              animate="show"
              className="mt-6"
            >
              <Link
                href="/book"
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-full bg-racing px-7 py-3 font-display text-2xl uppercase tracking-widest text-white glow-racing"
              >
                Book Now
              </Link>
            </motion.div>
          </nav>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.5 } }}
            className="relative flex items-center gap-4 border-t border-white/10 px-6 py-6 text-smoke"
          >
            <a href={telUrl()} className="flex items-center gap-2 hover:text-flag" aria-label="Call">
              <Phone size={18} /> <span className="text-sm">{site.contact.phoneDisplay}</span>
            </a>
            <div className="ml-auto flex items-center gap-3">
              <a
                href={whatsappUrl(`Hi ${site.name}, I'd like to book a session.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 hover:border-flag hover:text-flag"
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href={site.contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 hover:border-flag hover:text-flag"
                aria-label="Instagram"
              >
                <InstagramIcon size={18} />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
