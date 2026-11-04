import { gallery } from "@/lib/site-content.mjs";
import Gallery from "@/components/Gallery";
import { PageIntro } from "@/components/Ui";
import { metadataForPath } from "../seo";
export const metadata = metadataForPath(
  "/gallery",
  "Gallery | Shinobi New Era",
  "Explore public Shinobi New Era promotional artwork and the world of Konoha in the official gallery.",
);
export default function GalleryPage() {
  return (
    <>
      <PageIntro
        kicker="THE WORLD, IN FRAMES"
        title="Artwork gallery"
        number="05"
      >
        Public SNE artwork: {gallery.length} images to explore. Select a frame to take a closer look.
        This website gallery is separate from the supporter gallery inside the game.
      </PageIntro>
      <section className="shell section">
        <Gallery />
      </section>
    </>
  );
}
