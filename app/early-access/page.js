import Link from "next/link";
import { IconBadge } from "@/components/Icon";
import { EmptyState, FaqList, PageIntro, SectionTitle } from "@/components/Ui";
import ReleaseBoard from "@/components/ReleaseBoard";
import SupporterAccess from "./SupporterAccess";
import { earlyAccessConfig } from "./config";
import { getReleaseCenter } from "@/lib/releases/server";
import { metadataForPath } from "../seo";
export const dynamic = "force-dynamic";
export const metadata = metadataForPath(
  "/early-access",
  "Patreon Early Access | Shinobi New Era",
  "Verify your Patreon subscription, check supporter build availability and find official Early Access information for Shinobi New Era.",
);
export default async function EarlyAccess() {
  const center = await getReleaseCenter();
  return (
    <>
      <PageIntro
        kicker="FOR THE NEXT CHAPTER"
        title={
          <>
            Support the story.
            <br />
            <em>Step in early.</em>
          </>
        }
        number="EA"
      >
        Connect Patreon to check your supporter access. Availability depends on
        the published build, eligible tier and unlock date.
      </PageIntro>
      <div className="shell">
        <section className="section" id="supporters">
          <SectionTitle
            kicker="YOUR SUPPORTER PASS"
            title="A place in the new era."
          />
          <SupporterAccess
            releases={center.early}
            availability={center.availability}
          />
        </section>
        <section className="section">
          <SectionTitle
            kicker="THE SAME STORY. A NEW CHAPTER."
            title="The release board."
            href="/download"
            linkLabel="Open Release Center"
          />
          <ReleaseBoard center={center} />
        </section>
        <section className="section">
          <SectionTitle
            kicker="CHOOSE YOUR PLATFORM"
            title="Support Eshik Games."
          >
            Visit official creator pages for their current subscriptions and
            posts.
          </SectionTitle>
          <div className="support-platforms">
            {earlyAccessConfig.supporters.map((platform) => (
              <article className="panel support-platform" key={platform.name}>
                <IconBadge name={platform.icon} />
                <h3>{platform.name}</h3>
                <span className="badge badge-muted">
                  {platform.integrationStatus?.replaceAll("_", " ") ??
                    "PATREON VERIFICATION"}
                </span>
                <p>
                  {platform.name === "Patreon"
                    ? "Sign in above to check your current subscription. Visiting the creator page alone does not verify access."
                    : "Account linking is not available on this site. Visit the platform for its current posts and details."}
                </p>
                <a
                  className="text-link"
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit {platform.name} ↗
                </a>
              </article>
            ))}
          </div>
        </section>
        <section className="section">
          <SectionTitle
            kicker="WHAT YOUR PASS MEANS"
            title="Public & supporter access."
          />
          <div className="table-scroll">
            <table className="comparison-table">
              <caption>Benefits implemented by this website</caption>
              <thead>
                <tr>
                  <th scope="col">On this site</th>
                  <th scope="col">Public</th>
                  <th scope="col">Eligible Patreon supporter</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Listed public downloads</th>
                  <td>Available</td>
                  <td>Available</td>
                </tr>
                <tr>
                  <th scope="row">Browser edition</th>
                  <td>Available</td>
                  <td>Available</td>
                </tr>
                <tr>
                  <th scope="row">Published early builds</th>
                  <td>Not included</td>
                  <td>After tier & unlock checks</td>
                </tr>
                <tr>
                  <th scope="row">Current eligible tiers</th>
                  <td>—</td>
                  <td>
                    Resonance Adept · Otsutsuki Chosen · New Era Architect
                  </td>
                </tr>
                <tr>
                  <th scope="row">Guaranteed release dates</th>
                  <td>None announced</td>
                  <td>None announced</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="muted">
            Other platform benefits are described on the creator’s official
            page. This table makes no promise of unannounced builds or in-game
            privileges.
          </p>
        </section>
        <section className="section narrow">
          <SectionTitle
            kicker="BEFORE YOU CONNECT"
            title="Access, explained."
          />
          <FaqList
            items={[
              {
                question: "Does signing in guarantee a download?",
                answer:
                  "No. The server checks the live subscription, eligible tier, published release and unlock date before issuing a temporary link. An empty release list means there is no build to download here.",
              },
              {
                question: "Which Patreon tiers are eligible?",
                answer:
                  "Resonance Adept, Otsutsuki Chosen and New Era Architect are configured for this site’s Early Access. The current subscription must be active.",
              },
              {
                question: "Can I use SubscribeStar or Boosty to sign in?",
                answer:
                  "SubscribeStar is pending approval and Boosty is under review. Neither has a working sign-in flow on this website.",
              },
            ]}
          />
          {center.availability === "error" && (
            <EmptyState title="Release information is temporarily unavailable">
              Please try again later. Download access remains protected.
            </EmptyState>
          )}
          <Link href="/download" className="text-link">
            Get a public build ↗
          </Link>
        </section>
      </div>
    </>
  );
}
