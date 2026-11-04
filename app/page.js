import Link from "next/link";
import { Art, Button, FaqList, SectionTitle } from "@/components/Ui";
import CharacterCards from "@/components/CharacterCards";
import ReleaseBoard from "@/components/ReleaseBoard";
import MotionScene from "@/components/MotionScene";
import { IconBadge } from "@/components/Icon";
import { gameOverview } from "@/lib/game-info.mjs";
import { community, faqs, features } from "@/lib/site-content.mjs";
import { getReleaseCenter, getPosts } from "@/lib/releases/server";
import { metadataForPath } from "./seo";
export const dynamic = "force-dynamic";
export const metadata = metadataForPath(
  "/",
  "Shinobi New Era — Begin your legacy",
  "Explore Konoha, meet the characters and find the latest public and supporter release information. An independent visual novel by Eshik Games.",
);
export default async function Home() {
  const center = await getReleaseCenter();
  const posts = getPosts();
  return (
    <MotionScene>
      <section className="home-hero">
        <div className="hero-landscape">
          <Art src="/images/hero.jpg" alt="" eager sizes="100vw" />
        </div>
        <div className="hero-shade" />
        <div className="hero-embers" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="shell hero-content">
          <div className="hero-topline">
            <span className="eyebrow">ESHIK GAMES PRESENTS</span>
            <span className="hero-coordinate mono">
              VISUAL NOVEL / SANDBOX / 18+
            </span>
          </div>
          <div className="hero-heading">
            <span className="hero-overline">YOUR WORLD. YOUR CHOICES.</span>
            <h1>
              SHINOBI
              <br />
              <span>NEW ERA</span>
              <b aria-hidden="true">.</b>
            </h1>
          </div>
          <div className="hero-bottom">
            <div>
              <p>
                A familiar world.
                <br />A story that becomes <em>yours.</em>
              </p>
              <div className="button-row">
                <Button href="/download">Download the game</Button>
                <Button href="/play" secondary>
                  Play online
                </Button>
              </div>
              <Link className="hero-support-link" href="/early-access">
                Discover Early Access →
              </Link>
            </div>
            <aside className="hero-release">
              <span className="badge">
                <i />
                RELEASE INTEL
              </span>
              <strong>{center.current?.version ?? "TBA"}</strong>
              <span>Current public version</span>
              <Link href="/download">Open Release Center ↗</Link>
            </aside>
          </div>
          <div className="hero-baseline">
            <span>BEGIN YOUR LEGACY</span>
            <span>SCROLL TO DISCOVER ↓</span>
            <span>01 / THE NEW ERA</span>
          </div>
        </div>
      </section>
      <div className="chapter-strip">
        <div className="shell">
          <span>EXPLORE KONOHA</span>
          <i>✦</i>
          <span>FOLLOW YOUR STORY</span>
          <i>✦</i>
          <span>MEET THE CHARACTERS</span>
          <i>✦</i>
          <span>SHAPE YOUR PATH</span>
        </div>
      </div>
      <section className="shell section" data-reveal>
        <SectionTitle
          kicker="THE RELEASE BOARD"
          title="The story moves forward."
          href="/download"
          linkLabel="All releases"
        >
          Current information. Official downloads. Everything in one place.
        </SectionTitle>
        <ReleaseBoard center={center} compact />
      </section>
      <section className="shell section about-split" data-reveal>
        <div className="about-art">
          <Art src="/images/1.jpg" alt="Shinobi New Era promotional artwork" />
          <span className="image-caption">SNE / OFFICIAL ARTWORK</span>
        </div>
        <div className="about-copy">
          <p className="eyebrow">WELCOME TO SHINOBI NEW ERA</p>
          <h2>
            A familiar world.
            <br />A story of <em>your own.</em>
          </h2>
          <p>{gameOverview}</p>
          <p>
            From everyday encounters to quests that pull you further into the
            world, your next chapter is waiting.
          </p>
          <Button href="/about" secondary>
            Explore the game
          </Button>
        </div>
      </section>
      <section className="shell section" data-reveal>
        <SectionTitle kicker="THE EXPERIENCE" title="More than a chapter." />
        <div className="feature-grid">
          {features.map((f) => (
            <article className="feature-card panel" key={f.number}>
              <div className="feature-top">
                <IconBadge name={f.icon} />
                <span className="feature-index">{f.number}</span>
              </div>
              <p className="eyebrow">{f.tag}</p>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section character-section" data-reveal>
        <div className="shell">
          <SectionTitle
            kicker="FAMILIAR FACES. NEW STORIES."
            title="People make the world."
            href="/characters"
            linkLabel="Meet the cast"
          />
          <CharacterCards limit={4} />
        </div>
      </section>
      <section className="shell section gallery-tease" data-reveal>
        <SectionTitle
          kicker="A GLIMPSE INSIDE"
          title="Welcome to Konoha."
          href="/gallery"
          linkLabel="Open gallery"
        />
        <Link href="/gallery" className="gallery-panorama">
          <Art
            src="/images/hero.jpg"
            alt="Panoramic night view of Konoha"
            sizes="100vw"
          />
          <span>
            THE WORLD OF SHINOBI NEW ERA <b aria-hidden="true">↗</b>
          </span>
        </Link>
      </section>
      <section className="shell section" id="support" data-reveal>
        <SectionTitle
          kicker="BUILT TOGETHER"
          title="Be part of the next chapter."
        >
          Follow the project, meet other players, or support Eshik Games.
        </SectionTitle>
        <div className="community-grid">
          {community.map((item) => (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="community-card panel"
              key={item.name}
            >
              <IconBadge name={item.icon} small />
              <h3>
                {item.name}
                <span aria-hidden="true">↗</span>
              </h3>
              <p>{item.detail}</p>
            </a>
          ))}
        </div>
      </section>
      <section className="shell section home-devlog" data-reveal>
        <SectionTitle
          kicker="FROM THE STUDIO"
          title="Development journal."
          href="/blog"
          linkLabel="Visit the devlog"
        />
        <p>
          {posts.length
            ? `${posts.length} confirmed updates from Eshik Games.`
            : "The journal is ready for official announcements. New posts will appear when Eshik Games publishes them."}
        </p>
      </section>
      <section className="shell section faq-section" data-reveal>
        <SectionTitle
          kicker="BEFORE YOU BEGIN"
          title="A few things to know."
          href="/faq"
          linkLabel="All questions"
        />
        <FaqList items={faqs.slice(0, 4)} />
      </section>
    </MotionScene>
  );
}
