import Link from "next/link";
import SupporterAccess from "./SupporterAccess";
import Countdown from "./Countdown";
import { earlyAccessConfig as config } from "./config";
import { metadataForPath } from "../seo";
import "./early-access.css";
import "./supporter-access.css";

const title = "Early Access | Shinobi New Era";
const description = "Explore Shinobi New Era early access, supporter platforms, release information, and the free public download.";

export const metadata = {
  ...metadataForPath("/early-access"),
  title,
  description,
  openGraph: { ...metadataForPath("/early-access").openGraph, title, description, images: [{ url: "/images/hero.jpg", alt: "Shinobi New Era" }] },
};

const faqs = [
  { question: "How do I get the public build?", answer: <>Visit the <Link href="/download">public download page</Link> and choose your platform.</> },
  { question: "Can I sign in with a supporter account here?", answer: "Patreon sign-in appears only when secure verification is configured and enabled. A supporter-platform visit is not a sign-in to this site." },
  { question: "Where can I find supporter updates?", answer: "Check the official Eshik Games page on the platform you support. Availability and eligibility are determined there until site verification is ready." },
  { question: "When is the next release?", answer: "No release date has been confirmed for this page. A countdown will appear only after Eshik Games provides a date." },
];

export default function EarlyAccessPage() {
  return (
    <div className="ea-page">
      <section className="ea-hero" aria-labelledby="ea-title">
        <div className="ea-hero__image" aria-hidden="true" />
        <div className="ea-hero__grain" aria-hidden="true" />
        <div className="ea-container ea-hero__content">
          <p className="ea-eyebrow"><span /> ESHIK GAMES · SHINOBI NEW ERA</p>
          <h1 id="ea-title">A new era<br /><em>begins early.</em></h1>
          <p className="ea-hero__intro">Follow upcoming builds, support development, and find the latest public version of Shinobi New Era.</p>
          <div className="ea-hero__actions">
            <a className="ea-button ea-button--red" href="#supporters">Explore supporter platforms <span aria-hidden="true">→</span></a>
            <Link className="ea-button ea-button--outline" href="/download">Get the public build <span aria-hidden="true">→</span></Link>
          </div>
          <p className="ea-hero__note">Protected downloads require a verified supporter session.</p>
        </div>
        <div className="ea-hero__index" aria-hidden="true">01 / EARLY ACCESS</div>
      </section>

      <div className="ea-container">
        <section className="ea-releases ea-section" aria-labelledby="releases-title">
          <div className="ea-section__heading"><span className="ea-kicker">RELEASE INTEL</span><h2 id="releases-title">The release board</h2><p>Confirmed details will appear here as they are announced by Eshik Games.</p></div>
          <div className="ea-release-grid">
            <article className="ea-release-card ea-release-card--current"><span className="ea-release-card__number">01 / CURRENT</span><div><p className="ea-release-card__label">Current early build</p><h3>{config.currentRelease?.version ?? "To be announced"}</h3><p>{config.currentRelease?.summary ?? "No early build has been confirmed for this page."}</p></div><span className="ea-release-card__line" /></article>
            <article className="ea-release-card"><span className="ea-release-card__number">02 / NEXT</span><div><p className="ea-release-card__label">Next release</p><h3>{config.nextRelease?.version ?? "Awaiting announcement"}</h3><p>{config.nextRelease?.summary ?? "A release date has not been set here."}</p></div><span className="ea-release-card__line" /></article>
          </div>
          <Countdown unlockAt={config.unlockAt} />
        </section>

        <section id="supporters" className="ea-section ea-supporters" aria-labelledby="supporters-title">
          <div className="ea-section__heading"><span className="ea-kicker">SUPPORT THE JOURNEY</span><h2 id="supporters-title">Choose your platform</h2><p>Visit an official Eshik Games supporter page. These links open the platform; they do not verify access on this site.</p></div>
          <div className="ea-platform-grid">
            {config.supporters.map((platform, index) => <article className={`ea-platform ea-platform--${platform.tone}`} key={platform.name}><div className="ea-platform__top"><span className="ea-platform__mark" aria-hidden="true">{platform.mark}</span><span className="ea-platform__number">0{index + 1}</span></div><h3>{platform.name}</h3>{platform.integrationStatus && <span className="ea-platform__status">{platform.integrationStatus.replace("_", " ")}</span>}<p>View the official Eshik Games page for current supporter posts and details.</p><a href={platform.href} target="_blank" rel="noopener noreferrer" aria-label={`Visit Eshik Games on ${platform.name} (opens in a new tab)`}>Visit {platform.name} <span aria-hidden="true">→</span></a></article>)}
          </div>
          <SupporterAccess releaseId={config.currentRelease?.id ?? null} />
        </section>

        <section className="ea-section ea-comparison" aria-labelledby="comparison-title">
          <div className="ea-section__heading"><span className="ea-kicker">YOUR PATH IN</span><h2 id="comparison-title">Public &amp; supporter access</h2><p>What you can do on this site today.</p></div>
          <div className="ea-compare-grid"><article><span className="ea-compare-grid__tag">OPEN TO EVERYONE</span><h3>Public build</h3><p>Download the currently listed public version from the existing download page.</p><Link href="/download">Go to public downloads <span aria-hidden="true">→</span></Link></article><article><span className="ea-compare-grid__tag">THROUGH SUPPORTER PLATFORMS</span><h3>Early access</h3><p>See each platform for its current posts and eligibility. Direct access to protected builds on this site is pending verification.</p><a href="#supporters">View the platforms <span aria-hidden="true">↑</span></a></article></div>
        </section>

        <section className="ea-section ea-faq" aria-labelledby="faq-title"><div className="ea-section__heading"><span className="ea-kicker">NEED TO KNOW</span><h2 id="faq-title">Questions, answered.</h2></div><div className="ea-faq__list">{faqs.map((faq, index) => <details key={faq.question}><summary><span className="ea-faq__index">0{index + 1}</span><span>{faq.question}</span><span className="ea-faq__plus" aria-hidden="true">+</span></summary><div className="ea-faq__answer">{faq.answer}</div></details>)}</div></section>
      </div>
    </div>
  );
}
