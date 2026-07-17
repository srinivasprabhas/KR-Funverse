import { gallery } from "@/data/site";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import MagneticButton from "@/components/ui/MagneticButton";
import Gallery from "@/components/Gallery";

export default function GalleryPreview() {
  return (
    <section id="gallery" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            kicker="The Scene"
            title={
              <>
                Life in the <span className="text-gradient-racing">fast lane</span>
              </>
            }
            description="A peek at the speed, the smiles and the checkered-flag moments."
          />
          <Reveal>
            <MagneticButton href="/gallery" variant="outline">
              View full gallery
            </MagneticButton>
          </Reveal>
        </div>

        <div className="mt-12">
          <Gallery images={gallery.slice(0, 6)} />
        </div>
      </div>
    </section>
  );
}
