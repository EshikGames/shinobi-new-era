import CharacterCards from "@/components/CharacterCards";
import { Button, PageIntro } from "@/components/Ui";
import { metadataForPath } from "../seo";
export const metadata = metadataForPath(
  "/characters",
  "Characters | Shinobi New Era",
  "Meet the cast through the original Shinobi New Era character artwork.",
);
export default function Characters() {
  return (
    <>
      <PageIntro
        kicker="THE PEOPLE OF SHINOBI NEW ERA"
        title="Characters"
        number="04"
      >
        Meet the people in Boruto’s story. These descriptions follow the SNE
        alternate universe; relationships should not be assumed from the original series.
      </PageIntro>
      <section className="shell section">
        <CharacterCards />
        <div className="section-end">
          <p>Kakashi’s further missions and Ino’s Act III storyline are in development. All characters involved in adult romantic content are adults in this alternate universe.</p>
          <Button href="/play">Play online</Button>
        </div>
      </section>
    </>
  );
}
