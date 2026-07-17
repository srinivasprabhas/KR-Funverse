import Link from "next/link";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { site, navLinks } from "@/data/site";
import { telUrl, whatsappUrl, mailtoUrl } from "@/lib/utils";
import Marquee from "@/components/Marquee";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-carbon">
      <div className="border-b border-white/10 py-6">
        <Marquee items={["GO-KARTING", "BOX CRICKET", "INDOOR GAMES", "RACE. PLAY. REPEAT."]} duration={30} />
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="lg:col-span-1">
          <Link href="/#home" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-racing font-display text-xl text-white">
              KR
            </span>
            <span className="font-display text-3xl tracking-wide">
              FUN<span className="text-racing">VERSE</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-smoke">{site.intro}</p>
          <div className="mt-5 flex gap-3">
            <a
              href={whatsappUrl(`Hi ${site.name}, I'd like to book a session.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-smoke transition-colors hover:border-flag hover:text-flag"
              aria-label="WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
            <a
              href={site.contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-smoke transition-colors hover:border-flag hover:text-flag"
              aria-label="Instagram"
            >
              <InstagramIcon size={18} />
            </a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h3 className="font-display text-xl uppercase tracking-widest text-chalk">Explore</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-smoke">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-flag">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/attractions" className="transition-colors hover:text-flag">
                Attractions
              </Link>
            </li>
            <li>
              <Link href="/book" className="transition-colors hover:text-flag">
                Book a Session
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-display text-xl uppercase tracking-widest text-chalk">Get in Touch</h3>
          <ul className="mt-4 space-y-3.5 text-sm text-smoke">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-racing" />
              <a href={site.location.directionsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-flag">
                {site.location.area}, {site.location.city}, {site.location.state} {site.location.pincode}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="shrink-0 text-racing" />
              <a href={telUrl()} className="hover:text-flag">
                {site.contact.phoneDisplay}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="shrink-0 text-racing" />
              <a href={mailtoUrl(`Enquiry — ${site.name}`)} className="hover:text-flag">
                {site.contact.email}
              </a>
            </li>
          </ul>
        </div>

        {/* Hours */}
        <div>
          <h3 className="font-display text-xl uppercase tracking-widest text-chalk">Opening Hours</h3>
          <ul className="mt-4 space-y-3 text-sm text-smoke">
            {site.hours.map((h) => (
              <li key={h.days} className="flex items-start gap-3">
                <Clock size={18} className="mt-0.5 shrink-0 text-racing" />
                <span>
                  <span className="block text-chalk">{h.days}</span>
                  {h.time}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-ash sm:flex-row sm:px-8">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>Race. Play. Repeat.</p>
        </div>
      </div>
    </footer>
  );
}
