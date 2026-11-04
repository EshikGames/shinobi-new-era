import { Art, Button, PageIntro, SectionTitle } from "@/components/Ui";
import { features } from "@/lib/site-content.mjs";
import { IconBadge } from "@/components/Icon";
import {
  gameOverview,
  gameFacts,
  gameLanguages,
  gameSources,
} from "@/lib/game-info.mjs";
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
            <p>{gameOverview}</p>
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
        <section className="game-facts" aria-label="Game details">
          {gameFacts.map((fact) => (
            <div className="game-fact panel" key={fact.label}>
              <IconBadge name={fact.icon} small />
              <div>
                <span className="eyebrow">{fact.label}</span>
                <strong>{fact.value}</strong>
              </div>
            </div>
          ))}
        </section>
        <section className="section">
          <SectionTitle
            kicker="THE EXPERIENCE"
            title="A story to spend time in."
          />
          <div className="feature-grid">
            {features.map((f) => (
              <article className="feature-card panel" key={f.number}>
                <div className="feature-top">
                  <IconBadge name={f.icon} />
                  <span className="feature-index">{f.number}</span>
                </div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
          <p className="source-note">
            Explore the{" "}
            <a
              href={gameSources.game}
              target="_blank"
              rel="noopener noreferrer"
            >
              official game page
            </a>{" "}
            and the{" "}
            <a
              href={gameSources.story}
              target="_blank"
              rel="noopener noreferrer"
            >
              v0.3 story update
            </a>
            .
          </p>
        </section>
        <section className="section language-panel panel">
          <div>
            <IconBadge name="language" />
            <p className="eyebrow">PUBLIC BETA / LOCALIZATION</p>
            <h2>A wider world of stories.</h2>
            <p>
              Dialogue and interface localization continues to improve. These
              languages are listed in the public-beta announcement.
            </p>
          </div>
          <ul className="language-list">
            {gameLanguages.map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
          <p className="source-note">
            <a
              href={gameSources.beta}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read the localization announcement ↗
            </a>
          </p>
        </section>
        <section className="section prototype-panel panel">
          <IconBadge name="combat" />
          <div>
            <span className="badge badge-muted">
              PROTOTYPE / NOT IN THE MAIN GAME
            </span>
            <h2>Another way to be a shinobi.</h2>
            <p>
              A separate combat prototype is being explored. See the developer’s
              first look and its development status.
            </p>
          </div>
          <Button href="/blog/combat-prototype-first-look" secondary>
            Explore the prototype
          </Button>
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
