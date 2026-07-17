"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Phone, MessageCircle } from "lucide-react";
import { site } from "@/data/site";
import { telUrl, whatsappUrl } from "@/lib/utils";

export default function FloatingActions() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-5 right-5 z-40 flex flex-col gap-3 sm:bottom-7 sm:right-7"
        >
          <a
            href={whatsappUrl(`Hi ${site.name}, I'd like to book a session.`)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="group relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 transition-transform hover:scale-110"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/50" />
            <MessageCircle size={26} className="relative" />
          </a>
          <a
            href={telUrl()}
            aria-label="Call us"
            className="grid h-14 w-14 place-items-center rounded-full bg-racing text-white shadow-lg shadow-black/40 transition-transform hover:scale-110"
          >
            <Phone size={24} />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
