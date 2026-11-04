import Link from "next/link";
import SupporterGuide from "@/components/SupporterGuide";
import MembershipComparison from "@/components/MembershipComparison";
import Icon from "@/components/Icon";
import { FaqList } from "@/components/Ui";
import SupporterAccess from "./SupporterAccess";
import SupporterListAccess from "./SupporterListAccess";
import Countdown from "./Countdown";
import { earlyAccessConfig } from "./config";
import { membershipSource } from "@/lib/supporter-tiers.mjs";
import { getReleaseCenter } from "@/lib/releases/server";
import { metadataForPath } from "../seo";
export const dynamic = "force-dynamic";
export const metadata = metadataForPath(
  "/early-access",
  "Patreon Early Access & Memberships | Shinobi New Era",
  "Compare Eshik Games Patreon tiers, check your membership and find available Shinobi New Era Early Access builds. 14-day Early Access starts with Resonance Adept.",
);
export default async function EarlyAccess() {
  const center = await getReleaseCenter();
  const featured = center.early[0];
  const version = featured?.version ?? center.next?.version;
  const unlockAt = featured?.early_access_at ?? center.next?.early_access_at;
  return (
    <div className="ea-room">
      <div className="ea-room-main shell">
        <header className="ea-room-heading">
          <Link className="ea-back" href="/download">← Guide & Downloads</Link>
          <p className="eyebrow">SUPPORTER BUILDS</p>
          <h1>Early <em>Access</em></h1>
          <p>Play the next chapter early. Help bring the new era to life.</p>
          {version && <span className="ea-version">{featured ? "Supporter version" : "In development"} · v{version.replace(/^v/i, "")}</span>}
        </header>
        <section className="ea-launch" aria-labelledby="ea-launch-title">
          <span className="ea-launch-symbol" aria-hidden="true"><Icon name="moon" /></span>
          <p className="eyebrow">{featured ? "SUPPORTER RELEASE" : "THE NEXT CHAPTER"}</p>
          <h2 id="ea-launch-title">{featured ? `Shinobi New Era v${featured.version.replace(/^v/i, "")}` : "A little closer to the new era."}</h2>
          {unlockAt ? <><p className="ea-launch-date">Release unlock: <time dateTime={unlockAt}>{new Intl.DateTimeFormat("en-US", {dateStyle:"long", timeStyle:"short", timeZone:"UTC"}).format(new Date(unlockAt))} UTC</time></p><Countdown unlockAt={unlockAt} /></> : <p className="ea-launch-date">Release date to be announced</p>}
          <p className="ea-launch-copy"><strong>Resonance Adept, Otsutsuki Chosen and New Era Architect</strong> include 14-day Early Access to future updates. Sign in below to check your active membership and available builds.</p>
          {!featured && <p className="ea-launch-note">Full v0.4 with Act III is in development. Act III is not included in the public Beta.</p>}
          <a className="button button-primary" href={membershipSource} target="_blank" rel="noopener noreferrer"><Icon name="patreon" />Explore Patreon tiers ↗</a>
        </section>
        <section className="ea-signin" aria-labelledby="ea-signin-title">
          <div className="ea-signin-heading"><p className="eyebrow">YOUR MEMBERSHIP</p><h2 id="ea-signin-title">Check your access</h2><p>Use Patreon sign-in, or enter your Boosty supporter email below.</p></div>
          <nav className="ea-provider-links" aria-label="Supporter platforms">
            <a href="#patreon-access" className="ea-provider-current"><Icon name="patreon" /><span>Patreon<small>Website sign-in</small></span></a>
            {earlyAccessConfig.supporters.filter(platform => platform.name !== "Patreon").map(platform => platform.name === 'Boosty'
              ? <a href="#manual-access-title" key={platform.name}><Icon name={platform.icon} /><span>{platform.name}<small>Email access</small></span></a>
              : <a href={platform.href} key={platform.name} target="_blank" rel="noopener noreferrer"><Icon name={platform.icon} /><span>{platform.name}<small>Creator page ↗</small></span></a>)}
          </nav>
          <div id="patreon-access"><SupporterAccess releases={center.early} availability={center.availability} /></div>
          <p className="ea-provider-note">Patreon uses official OAuth. Boosty email access uses the list maintained by Eshik Games. SubscribeStar website access is not enabled.</p>
          <SupporterListAccess releases={center.early} />
          <Link className="ea-free-link" href="/download">Looking for the free public version? Download it here →</Link>
        </section>
      </div>
      <div className="shell ea-membership-shell"><MembershipComparison /></div>
      <div className="ea-room-main shell">
        <SupporterGuide />
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
