import type { Metadata } from "next";
import { gallery } from "@/data/site";
import PageHeader from "@/components/ui/PageHeader";
import Gallery from "@/components/Gallery";
import MagneticButton from "@/components/ui/MagneticButton";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "See the speed and the smiles — photos from KR Funverse go-karting arena in Ghatkesar, Hyderabad.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        kicker="Gallery"
        title={
          <>
            Life in the <span className="text-gradient-racing">fast lane</span>
          </>
        }
        subtitle="Every apex, every overtake, every checkered-flag celebration."
        image="/images/gallery-1.jpg"
      />

      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <Gallery images={gallery} />

        <Reveal className="mt-16 flex flex-col items-center gap-5 text-center">
          <p className="max-w-lg text-smoke">
            Ready to make your own highlight reel? Book a session and bring your crew.
          </p>
          <MagneticButton href="/book" size="lg">
            Book Your Race
          </MagneticButton>
        </Reveal>
      </div>
    </>
  );
}
