import Link from "next/link";
import { EmptyState, PageIntro, SectionTitle } from "@/components/Ui";
import ReleaseBoard, { ReleaseDate } from "@/components/ReleaseBoard";
import { changelogSections } from "@/lib/releases/model.mjs";
import { getReleaseCenter } from "@/lib/releases/server";
import { guide } from "@/lib/site-content.mjs";
import { metadataForPath } from "../seo";
export const dynamic = "force-dynamic";
export const metadata = metadataForPath(
  "/download",
  "Downloads & Release Center | Shinobi New Era",
  "Find public downloads, upcoming releases, changelogs, previous versions and installation help for Shinobi New Era.",
);
function DownloadCards({ release }) {
  return (
    <div className="download-grid">
      {release.platforms.map((platform) => {
        const links = release.public_download_urls.filter(
          (link) => link.platform === platform,
        );
        return (
          <article className="download-card panel" key={platform}>
            <div className="platform-symbol" aria-hidden="true">
              {platform === "Windows"
                ? "⊞"
                : platform === "Android"
                  ? "◉"
                  : "⌘"}
            </div>
            <span className="badge badge-muted">{release.version}</span>
            <h3>{platform}</h3>
            <p>{links[0]?.size ?? "File details not confirmed"}</p>
            {links.length ? (
              links.map((link, i) => (
                <a
                  className={i === 0 ? "button button-primary" : "text-link"}
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {i === 0 ? "Download" : `Mirror ${i + 1}`}
                  <span aria-hidden="true">↗</span>
                </a>
              ))
            ) : (
              <span className="button button-disabled" aria-disabled="true">
                Link awaiting confirmation
              </span>
            )}
          </article>
        );
      })}
    </div>
  );
}
export default async function Downloads() {
  const center = await getReleaseCenter();
  return (
    <>
      <PageIntro
        kicker="THE RELEASE CENTER"
        title={
          <>
            Your next chapter.
            <br />
            <em>One place to begin.</em>
          </>
        }
        number="02"
      >
        Public builds, upcoming chapters and the details in between.
      </PageIntro>
      <div className="shell">
        <nav className="section-nav" aria-label="Release Center sections">
          {[
            ["latest", "Latest release"],
            ["next", "Next release"],
            ["changelog", "Changelog"],
            ["previous", "Previous versions"],
            ["guide", "Game guide"],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
        <section className="section" id="latest">
          <SectionTitle
            kicker="LATEST PUBLIC RELEASE"
            title={
              center.current
                ? `Shinobi New Era ${center.current.version}`
                : "No public release announced"
            }
          />
          <ReleaseBoard center={center} />
          {center.current && (
            <>
              <div className="release-note">
                <span className="badge badge-gold">DOWNLOAD LINKS PENDING</span>
                <p>
                  The current version is confirmed. Its download links have not
                  been confirmed for this page yet. The original v0.2b links
                  remain available under Previous Versions.
                  {" "}<a href="#previous" className="text-link">Open v0.2b downloads ↗</a>
                </p>
              </div>
              <DownloadCards release={center.current} />
            </>
          )}
        </section>
        <section className="section next-release-callout panel" id="next">
          <div>
            <p className="eyebrow">
              NEXT RELEASE / {center.next?.version ?? "TBA"}
            </p>
            <h2>
              A new chapter
              <br />
              <em>on the horizon.</em>
            </h2>
            <p>
              {center.next?.description ??
                "No next release has been announced."}
            </p>
            <p>
              <ReleaseDate value={center.next?.public_release_at} /> · Early
              Access timing not announced
            </p>
          </div>
          <Link href="/early-access" className="button button-primary">
            Check Early Access ↗
          </Link>
        </section>
        <section className="section" id="changelog">
          <SectionTitle kicker="WHAT HAS CHANGED" title="Full changelog." />
          {changelogSections.map((category) => (
            <details className="changelog-category" key={category}>
              <summary>
                {category}
                <span aria-hidden="true">＋</span>
              </summary>
              {center.current?.changelog?.[category]?.length ? (
                <ul>
                  {center.current.changelog[category].map((entry) => (
                    <li key={entry}>{entry}</li>
                  ))}
                </ul>
              ) : (
                <p>
                  No confirmed {category.toLowerCase()} notes have been
                  published for {center.current?.version ?? "this release"}.
                </p>
              )}
            </details>
          ))}
        </section>
        <section className="section" id="previous">
          <SectionTitle kicker="THE ARCHIVE" title="Previous versions." />
          {center.previous.length ? (
            center.previous.map((release, index) => (
              <details className="archive-release" key={release.version} open={index === 0}>
                <summary>
                  <span className="mono">PUBLIC ARCHIVE</span>
                  <strong>{release.version}</strong>
                  <span>
                    <ReleaseDate
                      value={release.public_release_at}
                      fallback="Original website links"
                    />
                  </span>
                  <b aria-hidden="true">＋</b>
                </summary>
                <div className="archive-body">
                  <p>{release.description}</p>
                  <DownloadCards release={release} />
                  <p className="muted">
                    Historical changelog and publication date have not been
                    supplied.
                  </p>
                </div>
              </details>
            ))
          ) : (
            <EmptyState title="No previous versions listed">
              Archives will appear when confirmed links are available.
            </EmptyState>
          )}
        </section>
        <section className="section" id="guide">
          <SectionTitle kicker="GET YOUR BEARINGS" title="The field guide.">
            Practical starting points. Version-specific mechanics will be
            documented as they are confirmed.
          </SectionTitle>
          <div className="guide-grid">
            {guide.map((entry, i) => (
              <article className="panel guide-card" key={entry.title}>
                <span className="mono">0{i + 1}</span>
                <h3>{entry.title}</h3>
                <p>{entry.text}</p>
              </article>
            ))}
          </div>
          <p className="guide-support">
            Need more help?{" "}
            <Link className="text-link" href="/faq">
              Read the FAQ ↗
            </Link>
          </p>
        </section>
      </div>
    </>
  );
}
