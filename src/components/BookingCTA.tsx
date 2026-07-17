import Image from "next/image";
import { Phone, MessageCircle } from "lucide-react";
import { site } from "@/data/site";
import { telUrl, whatsappUrl } from "@/lib/utils";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import EnquiryForm from "@/components/EnquiryForm";

export default function BookingCTA() {
  return (
    <section id="book" className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
      <Image
        src="/images/cta.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-ink/85" />
      <div className="spotlight absolute inset-0" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <div>
          <SectionHeading
            kicker="Ready?"
            title={
              <>
                Book your <span className="text-gradient-racing">lap</span>
              </>
            }
            description="Drop your details and we'll lock in your slot — or reach us instantly on call and WhatsApp. Let's get you on the track."
          />

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={telUrl()}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 transition-colors hover:border-flag"
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
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 transition-colors hover:border-flag"
            >
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#25D366] text-white">
                <MessageCircle size={20} />
              </span>
              <span>
                <span className="block text-xs uppercase tracking-widest text-smoke">WhatsApp</span>
                <span className="font-display text-xl tracking-wide text-chalk">Chat now</span>
              </span>
            </a>
          </div>
        </div>

        <Reveal delay={0.1}>
          <EnquiryForm />
        </Reveal>
      </div>
    </section>
  );
}
