import { MapPin, Clock, Phone, Navigation } from "lucide-react";
import { site } from "@/data/site";
import { telUrl, whatsappUrl } from "@/lib/utils";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import MagneticButton from "@/components/ui/MagneticButton";

export default function LocationVisit() {
  return (
    <section id="visit" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          kicker="Find Us"
          title={
            <>
              Come race <span className="text-gradient-racing">with us</span>
            </>
          }
          description="We're in Ghatkesar, East Hyderabad — easy to reach and ready when you are."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Info */}
          <Reveal className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-carbon p-7 sm:p-9">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-racing/12 text-racing">
                <MapPin size={20} />
              </span>
              <div>
                <h3 className="font-display text-xl uppercase tracking-wide text-chalk">Location</h3>
                <p className="mt-1 text-smoke">
                  {site.location.area}
                  <br />
                  {site.location.city}, {site.location.state} {site.location.pincode}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-racing/12 text-racing">
                <Clock size={20} />
              </span>
              <div>
                <h3 className="font-display text-xl uppercase tracking-wide text-chalk">Hours</h3>
                <ul className="mt-1 space-y-1 text-smoke">
                  {site.hours.map((h) => (
                    <li key={h.days}>
                      <span className="text-chalk/90">{h.days}:</span> {h.time}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-racing/12 text-racing">
                <Phone size={20} />
              </span>
              <div>
                <h3 className="font-display text-xl uppercase tracking-wide text-chalk">Call / WhatsApp</h3>
                <a href={telUrl()} className="mt-1 block text-smoke transition-colors hover:text-flag">
                  {site.contact.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="mt-auto flex flex-wrap gap-3 pt-2">
              <MagneticButton href={site.location.directionsUrl} size="md">
                <Navigation size={18} /> Get Directions
              </MagneticButton>
              <MagneticButton
                href={whatsappUrl(`Hi ${site.name}, I'd like to book a session.`)}
                variant="outline"
                size="md"
              >
                WhatsApp Us
              </MagneticButton>
            </div>
          </Reveal>

          {/* Map */}
          <Reveal delay={0.1} className="overflow-hidden rounded-2xl border border-white/10">
            <iframe
              title={`${site.name} location map`}
              src={site.location.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[22rem] w-full grayscale-[0.3]"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
