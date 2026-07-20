import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import AboutIntro from "@/components/AboutIntro";
import AttractionsGrid from "@/components/AttractionsGrid";
import StatsCounter from "@/components/StatsCounter";
import RateCard from "@/components/RateCard";
import SafetyTrust from "@/components/SafetyTrust";
import EventsSection from "@/components/EventsSection";
import GalleryPreview from "@/components/GalleryPreview";
import Testimonials from "@/components/Testimonials";
import LocationVisit from "@/components/LocationVisit";
import BookingCTA from "@/components/BookingCTA";

export default function Home() {
  return (
    <>
      <Hero />

      <div className="border-y border-white/10 bg-carbon py-6">
        <Marquee items={["GO-KARTING", "BOX CRICKET", "INDOOR GAMES", "BIRTHDAYS", "CORPORATE DAYS"]} />
      </div>

      <AboutIntro />
      <AttractionsGrid />
      <StatsCounter />
      <RateCard />
      <SafetyTrust />
      <EventsSection />
      <GalleryPreview />
      <Testimonials />
      <LocationVisit />
      <BookingCTA />
    </>
  );
}
