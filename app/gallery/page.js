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
        title={
          <>
            A glimpse of
            <br />
            <em>the new era.</em>
          </>
        }
        number="05"
      >
        Original public SNE artwork. Select a frame to take a closer look.
      </PageIntro>
      <section className="shell section">
        <Gallery />
      </section>
    </>
  );
}
