import Link from "next/link";
import SupporterGuide from "@/components/SupporterGuide";
import { IconBadge } from "@/components/Icon";
import { FaqList, PageIntro, SectionTitle } from "@/components/Ui";
import SupporterAccess from "./SupporterAccess";
import { earlyAccessConfig } from "./config";
import { getReleaseCenter } from "@/lib/releases/server";
import { metadataForPath } from "../seo";
export const dynamic = "force-dynamic";
export const metadata = metadataForPath(
  "/early-access",
  "Patreon Early Access | Shinobi New Era",
  "Check your Patreon membership, download available Early Access builds and find help with the in-game gallery.",
);
export default async function EarlyAccess() {
  const center = await getReleaseCenter();
  return (
    <>
      <PageIntro kicker="FOR SUPPORTERS" title="Early Access">
        Sign in with Patreon to check your membership and see available early builds.
      </PageIntro>
      <div className="shell">
        <section className="section access-main" id="supporters">
          <p className="access-intro">Eligible tiers: <strong>Resonance Adept, Otsutsuki Chosen and New Era Architect</strong>. An active subscription is required.</p>
          <SupporterAccess releases={center.early} availability={center.availability} />
          <div className="simple-links"><Link href="/download">Looking for the free version? Download it here →</Link><a href="#supporter-guide">How to unlock the in-game gallery →</a></div>
        </section>
        <SupporterGuide />
        <section className="section">
          <SectionTitle title="Support development">Visit the official creator pages for subscriptions and posts.</SectionTitle>
          <div className="support-platforms">
            {earlyAccessConfig.supporters.map((platform) => (
              <article className="panel support-platform" key={platform.name}>
                <IconBadge name={platform.icon} />
                <h3>{platform.name}</h3>
                <p>{platform.name === "Patreon" ? "Use Patreon sign-in above to check Early Access on this website." : "Visit the creator page. Website sign-in is not available for this platform."}</p>
                <a className="text-link" href={platform.href} target="_blank" rel="noopener noreferrer">Visit {platform.name} ↗</a>
              </article>
            ))}
          </div>
        </section>
        <section className="section">
          <SectionTitle title="Early Access questions" />
          <FaqList items={[
            { question: "Is the public game free?", answer: "Yes. Public downloads and the older browser edition are available without a supporter subscription." },
            { question: "Why is there no download after I sign in?", answer: "A download is available only when a build has been published and unlocked for your active Patreon tier. Signing in does not make an unpublished build available." },
            { question: "Does website sign-in unlock the gallery in the game?", answer: "No. In-game gallery access uses the game’s own email-based supporter check. Follow the gallery instructions above." },
            { question: "When will the next build be released?", answer: "Full v0.4 with Act III is in development. No release date has been announced. Follow Updates for news." },
          ]} />
        </section>
      </div>
    </>
  );
}