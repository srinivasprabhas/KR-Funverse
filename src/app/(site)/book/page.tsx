import type { Metadata } from "next";
import { Phone, MessageCircle, Clock, MapPin, Navigation } from "lucide-react";
import { site } from "@/data/site";
import { telUrl, whatsappUrl } from "@/lib/utils";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata: Metadata = {
  title: "Book a Session",
  description:
    "Book go-karting, box cricket or indoor games at KR Funverse, Ghatkesar, Hyderabad. Send a request or reach us on call & WhatsApp.",
};

export default function BookPage() {
  return (
    <>
      <PageHeader
        kicker="Book"
        title={
          <>
            Lock in your <span className="text-gradient-racing">lap</span>
          </>
        }
        subtitle="Send us your details and we'll confirm your slot — or reach us instantly on call and WhatsApp."
      />

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Form */}
          <Reveal>
            <EnquiryForm />
          </Reveal>

          {/* Contact + map */}
          <div className="flex flex-col gap-6">
            <Reveal delay={0.1} className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a
                href={telUrl()}
                className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-carbon px-5 py-4 transition-colors hover:border-flag"
              >
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-racing text-white">
                  <Phone size={20} />
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-widest text-smoke">Call us</span>
                  <span className="font-display text-xl tracking-wide text-chalk">
                    {site.contact.phoneDisplay}
                  </span>
                </span>
              </a>
              <a
                href={whatsappUrl(`Hi ${site.name}, I'd like to book a session.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-carbon px-5 py-4 transition-colors hover:border-flag"
              >
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#25D366] text-white">
                  <MessageCircle size={20} />
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-widest text-smoke">WhatsApp</span>
                  <span className="font-display text-xl tracking-wide text-chalk">Chat now</span>
                </span>
              </a>
            </Reveal>

            <Reveal delay={0.15} className="rounded-2xl border border-white/10 bg-carbon p-6">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-racing" />
                <p className="text-smoke">
                  <span className="text-chalk">{site.location.area}</span>
                  <br />
                  {site.location.city}, {site.location.state} {site.location.pincode}
                </p>
              </div>
              <div className="mt-4 flex items-start gap-3">
                <Clock size={18} className="mt-0.5 shrink-0 text-racing" />
                <ul className="space-y-1 text-smoke">
                  {site.hours.map((h) => (
                    <li key={h.days}>
                      <span className="text-chalk/90">{h.days}:</span> {h.time}
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href={site.location.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 font-display text-lg uppercase tracking-widest text-flag hover:underline"
              >
                <Navigation size={17} /> Get Directions
              </a>
            </Reveal>

            <Reveal delay={0.2} className="overflow-hidden rounded-2xl border border-white/10">
              <iframe
                title={`${site.name} location map`}
                src={site.location.mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-64 w-full grayscale-[0.3]"
              />
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
}
