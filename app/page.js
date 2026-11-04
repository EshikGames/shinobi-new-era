import Link from "next/link";
import { Art, Button, FaqList, SectionTitle } from "@/components/Ui";
import CharacterCards from "@/components/CharacterCards";
import { IconBadge } from "@/components/Icon";
import { browserEdition, gameLanguages, gameOverview } from "@/lib/game-info.mjs";
import { community, faqs } from "@/lib/site-content.mjs";
import { getReleaseCenter } from "@/lib/releases/server";
import { metadataForPath } from "./seo";

export const dynamic = "force-dynamic";
export const metadata = metadataForPath(
  "/",
  "Shinobi New Era — Play & Download",
  "An 18+ sandbox visual novel by Eshik Games. Download the free public version, play the browser edition or check Patreon Early Access.",
);

export default async function Home() {
  const center = await getReleaseCenter();
  return (
    <div className="simple-home">
      <section className="welcome-hero">
        <Art src="/images/hero.jpg" alt="" eager sizes="100vw" />
        <div className="shell welcome-content">
          <p className="eyebrow">18+ SANDBOX VISUAL NOVEL · ESHIK GAMES</p>
          <h1>SHINOBI<br /><span>NEW ERA</span></h1>
          <p className="welcome-description">Naruto and Sasuke are missing. Explore Konoha with Boruto and uncover the mystery of Karma.</p>
          <div className="button-row">
            <Button href="/download">Download free{center.current ? ` · ${center.current.version}` : ""}</Button>
            <Button href="/play" secondary>Play in browser</Button>
          </div>
          <p className="welcome-note">Windows · macOS · Linux · Android<br />Browser edition: v{browserEdition.version} · {gameLanguages.length} languages in the public Beta</p>
        </div>
      </section>
      <div className="shell update-banner">
        <div><strong>{center.next ? `Full v${center.next.version} is in development` : "Follow the next update"}</strong><p>Act III is not included in the current Beta. No release date announced.</p></div>
        <Link className="text-link" href="/early-access">Early Access →</Link>
      </div>
      <section className="shell section simple-about">
        <div><p className="eyebrow">ABOUT THE GAME</p><h2>A new story in Konoha.</h2></div>
        <div><p>{gameOverview}</p><p>Explore the world, follow quests and get to know the characters in this alternate story.</p><div className="simple-links"><Link href="/about">More about the game →</Link><Link href="/gallery">View artwork →</Link><Link href="/blog">Latest updates →</Link></div></div>
      </section>
      <section className="shell section home-cast">
        <SectionTitle title="Meet the characters" href="/characters" linkLabel="All characters" />
        <CharacterCards limit={4} />
      </section>
      <section className="shell section" id="support">
        <SectionTitle title="Support & community">Support development or join other players. Check <Link href="/early-access">Early Access</Link> for website downloads and <Link href="/early-access#supporter-guide">in-game gallery help</Link>.</SectionTitle>
        <div className="community-shortcuts">
          {community.map((item) => <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer"><IconBadge name={item.icon} small /><span>{item.name}</span><span aria-hidden="true">↗</span></a>)}
        </div>
      </section>
      <section className="shell section faq-section">
        <SectionTitle title="Common questions" href="/faq" linkLabel="All questions" />
        <FaqList items={[faqs[0], faqs[7], faqs[9], faqs[3]]} />
      </section>
    </div>
  );
}