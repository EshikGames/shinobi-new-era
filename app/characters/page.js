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
        title={
          <>
            Familiar faces.
            <br />
            <em>Stories to discover.</em>
          </>
        }
        number="04"
      >
        Explore the cast through the original SNE character portraits.
      </PageIntro>
      <section className="shell section">
        <CharacterCards />
        <div className="section-end">
          <p>The best way to get to know them? Step into the story.</p>
          <Button href="/play">Play online</Button>
        </div>
      </section>
    </>
  );
}
