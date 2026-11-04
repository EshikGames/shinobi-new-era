import { Art, Button, PageIntro, SectionTitle } from "@/components/Ui";
import { features } from "@/lib/site-content.mjs";
import { IconBadge } from "@/components/Icon";
import { gameOverview, gameLanguages, storyContext, publicBetaNote, developmentFeatures } from "@/lib/game-info.mjs";
import { metadataForPath } from "../seo";
export const metadata = metadataForPath(
  "/about",
  "About the Game | Shinobi New Era",
  "Discover Eshik Games’ sandbox visual novel: explore Konoha, follow quests and meet the cast of Shinobi New Era.",
);
export default function About() {
  return (
    <>
      <PageIntro title="About the game" kicker="SHINOBI NEW ERA">
        An 18+ single-player sandbox visual novel by Eshik Games, built with Ren’Py.
      </PageIntro>
      <div className="shell">
        <section className="section about-split">
          <Art src="/images/1.jpg" alt="Official Shinobi New Era promotional art" />
          <div className="about-copy">
            <h2>The story</h2>
            <p>{gameOverview}</p>
            <p>{storyContext}</p>
            <div className="button-row"><Button href="/download">Download free</Button><Button href="/characters" secondary>Meet the characters</Button></div>
          </div>
        </section>
        <section className="section">
          <SectionTitle title="What you can do" />
          <div className="feature-grid">
            {features.map((feature) => <article className="feature-card panel" key={feature.number}><IconBadge name={feature.icon} /><h3>{feature.title}</h3><p>{feature.text}</p></article>)}
          </div>
          <details className="simple-details">
            <summary>{gameLanguages.length} languages in the public Beta</summary>
            <ul className="language-list">{gameLanguages.map((language) => <li key={language}>{language}</li>)}</ul>
            <p>Interface and dialogue translations continue to improve.</p>
          </details>
        </section>
        <section className="section simple-update-section">
          <SectionTitle title="Current version & next update" />
          <p>Acts I and II introduce the story, locations, relationships and quests.</p>
          <p>{publicBetaNote}</p>
          <details className="simple-details">
            <summary>Full v0.4 — what is in development?</summary>
            <ul>{developmentFeatures.map((item) => <li key={item}>{item}</li>)}</ul>
            <p>These features are in development. Combat was first shown as a separate prototype; it is not a confirmed feature of the public Beta. No release date has been announced.</p>
          </details>
          <Button href="/blog" secondary>Read development updates</Button>
        </section>
      </div>
    </>
  );
}