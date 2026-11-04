import { Art, Button, PageIntro, SectionTitle } from "@/components/Ui";
import { features } from "@/lib/site-content.mjs";
import { metadataForPath } from "../seo";
export const metadata = metadataForPath(
  "/about",
  "The Game | Shinobi New Era",
  "Discover Eshik Games’ sandbox visual novel: explore Konoha, follow quests and meet the cast of Shinobi New Era.",
);
export default function About() {
  return (
    <>
      <PageIntro
        kicker="ABOUT THE GAME"
        title={
          <>
            A world you know.
            <br />
            <em>A path of your own.</em>
          </>
        }
        number="03"
      >
        A sandbox visual novel by Eshik Games, inspired by the world of Naruto
        and Boruto.
      </PageIntro>
      <div className="shell">
        <section className="section about-split">
          <Art
            src="/images/1.jpg"
            alt="Official Shinobi New Era promotional art"
          />
          <div className="about-copy">
            <p className="eyebrow">BEGIN YOUR LEGACY</p>
            <h2>
              Find your place
              <br />
              in <em>Konoha.</em>
            </h2>
            <p>
              Explore the world, spend time with familiar characters and follow
              the story through quests and encounters. Shinobi New Era brings
              visual novel storytelling into a sandbox setting.
            </p>
            <p>
              The game continues to develop. The Release Center is the home for
              confirmed versions, downloads and future release notes.
            </p>
            <div className="button-row">
              <Button href="/play">Play online</Button>
              <Button href="/download" secondary>
                Find your build
              </Button>
            </div>
          </div>
        </section>
        <section className="section">
          <SectionTitle
            kicker="THE EXPERIENCE"
            title="A story to spend time in."
          />
          <div className="feature-grid">
            {features.map((f) => (
              <article className="feature-card panel" key={f.number}>
                <span className="feature-index">{f.number}</span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="section studio-note panel">
          <p className="eyebrow">FROM ESHIK GAMES</p>
          <h2>Follow the journey.</h2>
          <p>
            Explore the cast, see the public artwork and follow official updates
            as new chapters take shape.
          </p>
          <div className="button-row">
            <Button href="/characters" secondary>
              Meet the characters
            </Button>
            <Button href="/blog" secondary>
              Development journal
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
