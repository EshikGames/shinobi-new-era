import Link from "next/link";
import Image from "next/image";
import { Art, FaqList } from "@/components/Ui";
import Icon from "@/components/Icon";
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
  const supportOrder = ["Patreon", "SubscribeStar", "Boosty", "Discord", "Itch.io"];
  return (
    <div className="cinema-home">
      <section className="cinema-hero" aria-labelledby="game-title">
        <div className="cinema-landscape"><Art src="/images/hero.jpg" alt="" eager sizes="100vw" /></div>
        <div className="cinema-cast" aria-hidden="true">
          <Image className="cinema-boruto" src="/images/characters/boruto-art-v2.png" alt="" width={1024} height={1536} sizes="(max-width: 700px) 1px, 40vw" />
          <Image className="cinema-hinata" src="/images/characters/hinata-art-v2.png" alt="" width={1024} height={1536} sizes="(max-width: 700px) 100vw, 50vw" fetchPriority="high" loading="eager" />
        </div>
        <div className="cinema-vignette" />
        <div className="shell cinema-hero-inner">
          <div className="cinema-copy">
            <p className="eyebrow">AN OPEN-WORLD VISUAL NOVEL · 18+</p>
            <h1 id="game-title">Shinobi<br /><span>New Era</span></h1>
            <p className="cinema-tagline">A familiar world. An untold story.<br />Follow Boruto into the mystery of Karma.</p>
            <p className="cinema-credit">by <strong>Eshik Games</strong></p>
            <div className="cinema-actions" aria-label="Play and download">
              <Link href="/play" className="cinema-action cinema-play"><Icon name="play" /><span>Play in browser</span><small>v{browserEdition.version}</small></Link>
              <Link href="/download" className="cinema-action cinema-download"><Icon name="download" /><span>Download free</span><small>{center.current?.version ?? "Public"}</small></Link>
            </div>
            <p className="cinema-platforms">Windows · macOS · Linux · Android<br />Browser edition is an older version.</p>
            <div className="cinema-languages">
              <p><Icon name="language" />{gameLanguages.length} languages in the public Beta</p>
              <div className="language-preview"><span>English</span><span>Русский</span><span>Español</span><span>Português</span></div>
              <details><summary>See all languages</summary><ul>{gameLanguages.map(language => <li key={language}>{language}</li>)}</ul></details>
            </div>
            <aside className="cinema-release" aria-label="Next release">
              <span className="cinema-status"><i /> IN DEVELOPMENT</span>
              <h2>{center.next ? `Shinobi New Era ${center.next.version}` : "The next chapter"}</h2>
              <p>Act III is being developed. It is not included in the public Beta. No release date announced.</p>
              <div><Link href="/blog/v04-development-progress">Release details →</Link><Link href="/early-access">Get Early Access →</Link></div>
            </aside>
            <div className="cinema-support" id="support">
              <p className="eyebrow">SUPPORT & COMMUNITY</p>
              {supportOrder.map(name => {
                const item = community.find(entry => entry.name === name);
                return <a key={name} href={item.href} target="_blank" rel="noopener noreferrer" className={name === "Patreon" ? "cinema-social cinema-social-featured" : "cinema-social"}>
                  <Icon name={item.icon} /><span>{name}</span><small>{name === "Patreon" ? "EARLY ACCESS" : "↗"}</small>
                </a>;
              })}
            </div>
          </div>
          <p className="cinema-art-caption"><span>THE WORLD OF SNE</span>Different stories. A new beginning.</p>
        </div>
      </section>
      <section className="shell cinema-about section" id="about">
        <p className="eyebrow">ABOUT THE GAME</p>
        <h2>Return to a changed <em>Konoha.</em></h2>
        <p className="cinema-about-intro">{gameOverview}</p>
        <div className="cinema-feature-row">
          <article><Icon name="compass" /><h3>Explore freely</h3><p>Visit locations and follow quests in an open world.</p></article>
          <article><Icon name="people" /><h3>Meet the characters</h3><p>Discover the people at the heart of Boruto’s story.</p></article>
          <article><Icon name="story" /><h3>Uncover the mystery</h3><p>Search for Naruto and Sasuke and learn about Karma.</p></article>
        </div>
        <div className="cinema-facts"><div><strong>14</strong><span>LANGUAGES</span></div><div><strong>4</strong><span>DOWNLOAD PLATFORMS</span></div><div><strong>18+</strong><span>MATURE AUDIENCES</span></div></div>
        <div className="cinema-explore"><Link href="/about">About the game →</Link><Link href="/characters">Characters →</Link><Link href="/gallery">Artwork →</Link></div>
      </section>
      <section className="shell section cinema-faq" id="faq">
        <p className="eyebrow">YOUR QUESTIONS, ANSWERED</p><h2>Before you <em>begin.</em></h2>
        <FaqList items={[faqs[0], faqs[7], faqs[9], faqs[2], faqs[3], faqs[11]]} />
        <Link className="text-link" href="/faq">All questions & help →</Link>
      </section>
      <section className="shell cinema-community">
        <Icon name="chat" /><p className="eyebrow">JOIN THE COMMUNITY</p><h2>The next chapter starts <em>together.</em></h2>
        <p>Talk about the game, share feedback and follow the latest news from Eshik Games.</p>
        <a className="button button-primary" href={community.find(item => item.name === "Discord").href} target="_blank" rel="noopener noreferrer">Join Discord ↗</a>
        <Link className="text-link" href="/blog">Read development updates →</Link>
      </section>
    </div>
  );
}