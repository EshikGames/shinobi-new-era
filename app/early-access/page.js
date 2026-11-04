import Link from "next/link";
import SupporterGuide from "@/components/SupporterGuide";
import MembershipComparison from "@/components/MembershipComparison";
import Icon from "@/components/Icon";
import { FaqList } from "@/components/Ui";
import AccessPlatforms from "./AccessPlatforms";
import Countdown from "./Countdown";
import "./lounge.css";
import { getReleaseCenter } from "@/lib/releases/server";
import { metadataForPath } from "../seo";
export const dynamic = "force-dynamic";
export const metadata = metadataForPath(
  "/early-access",
  "Early Access & Supporter Downloads | Shinobi New Era",
  "Check your Patreon, Boosty or SubscribeStar access and find available Shinobi New Era supporter builds. 14-day Early Access starts with Resonance Adept.",
);
export default async function EarlyAccess() {
  const center = await getReleaseCenter();
  const featured = center.early[0];
  const version = featured?.version ?? center.next?.version;
  const unlockAt = featured?.early_access_at ?? center.next?.early_access_at;
  return (
    <div className="ea-room ea-lounge">
      <div className="ea-room-main shell">
        <header className="ea-room-heading">
          <Link className="ea-back" href="/">← Back to Home</Link>
          <p className="eyebrow">SUPPORTER BUILDS</p>
          <h1>Early Access<span aria-hidden="true">.</span></h1>
          {version && <span className="ea-version">{featured ? "Supporter version" : "In development"} · v{version.replace(/^v/i, "")}</span>}
        </header>
        <section className="ea-launch" aria-labelledby="ea-launch-title">
          <p className="eyebrow">{featured ? "SUPPORTER RELEASE" : "THE NEXT CHAPTER"}{version && ` · v${version.replace(/^v/i, "")}`}</p>
          <h2 id="ea-launch-title">{featured ? "Your next chapter awaits." : "A new chapter is on its way."}</h2>
          {unlockAt ? <><p className="ea-launch-date">Unlocks <time dateTime={unlockAt}>{new Intl.DateTimeFormat("en-US", {dateStyle:"long", timeStyle:"short", timeZone:"UTC"}).format(new Date(unlockAt))} UTC</time></p><Countdown unlockAt={unlockAt} /></> : <div className="ea-date-pending"><Icon name="moon" /><span>Release date to be announced</span></div>}
          <p className="ea-launch-copy">Get <strong>14-day Early Access</strong> with Resonance Adept, Otsutsuki Chosen or New Era Architect.</p>
          {!featured && <p className="ea-launch-note">Full v0.4 with Act III is in development.</p>}
          <a className="button button-primary" href="#membership">Get Early Access <span aria-hidden="true">↗</span></a>
        </section>
        <AccessPlatforms releases={center.early} availability={center.availability} />
      </div>
      <div className="shell ea-membership-shell"><MembershipComparison compact /></div>
      <div className="ea-room-main shell">
        <details className="ea-gallery-details"><summary>Already a supporter? Unlock the in-game gallery <span aria-hidden="true">＋</span></summary><SupporterGuide /></details>
        <section className="section ea-room-faq">
          <p className="eyebrow">GOOD TO KNOW</p><h2>Early Access questions</h2>
          <FaqList items={[
            { question: "How do I get Early Access on this website?", answer: "Patreon sign-in requires an active Resonance Adept, Otsutsuki Chosen or New Era Architect membership. Email access uses a separate list maintained by Eshik Games: the entered email must have an active, unexpired entry with one of these tiers on an enabled platform. Every download also requires a published, unlocked build." },
            { question: "Why is there no download after I sign in?", answer: "Your subscription and release availability are checked separately. A build must be published and unlocked for your tier before a download can be issued. Signing in does not make an unpublished build available." },
            { question: "Does website sign-in unlock the gallery in the game?", answer: "No. Gallery Unlocker is included from Resonance Adept upward, but the game uses its own email-based supporter check. Follow the instructions above." },
            { question: "When will full v0.4 be released?", answer: "Full v0.4 with Act III is in development. No release date has been announced. A countdown appears only when a real unlock date has been set." },
            { question: "Are custom CGs and bonus scenes part of the main story?", answer: "No. These Patreon rewards are non-canon and subject to creator approval and project rules. They do not automatically become part of the main game. Availability and current conditions are listed on Patreon." },
          ]} />
        </section>
        <Link className="ea-bottom-back" href="/download">← Back to Guide & Downloads</Link>
      </div>
    </div>
  );
}
