import Link from "next/link";
import { EmptyState, PageIntro, SectionTitle } from "@/components/Ui";
import { ReleaseDate } from "@/components/ReleaseBoard";
import { changelogSections } from "@/lib/releases/model.mjs";
import { getReleaseCenter } from "@/lib/releases/server";
import { guide } from "@/lib/site-content.mjs";
import { IconBadge } from "@/components/Icon";
import { gameSources, publicBetaNote, publicFiles } from "@/lib/game-info.mjs";
import { metadataForPath } from "../seo";
export const dynamic = "force-dynamic";
export const metadata = metadataForPath(
  "/download",
  "Guide & Downloads | Shinobi New Era",
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
            <IconBadge
              name={
                {
                  Windows: "windows",
                  Android: "android",
                  macOS: "macos",
                  Linux: "terminal",
                }[platform]
              }
            />
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
                  {link.url === gameSources.game
                    ? "Open on itch.io"
                    : i === 0
                      ? "Download"
                      : `Mirror ${i + 1}`}
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
      <PageIntro kicker="GET STARTED" title="Guide & Downloads">
        Download the free public version, check Early Access or find installation help.
      </PageIntro>
      <div className="shell">
        <section className="section download-main" id="latest">
          <SectionTitle title={center.current ? `Current version · ${center.current.version}` : "No public release announced"} />
          <Link className="guide-early-access" href="/early-access">
            <span><strong>Patreon Early Access</strong><small>Check your membership and available early builds.</small></span>
            <span className="guide-early-access-label">For supporters <span aria-hidden="true">→</span></span>
          </Link>
          <p className="guide-download-note">Choose your platform. All current download buttons open the official itch.io page.</p>
          {center.current && <DownloadCards release={center.current} />}
          <p className="notice">{publicBetaNote}</p>
          <div className="simple-links"><Link href="/play">Play the 0.4beta.fix browser edition →</Link><a href="#guide">Installation help →</a><a href="#previous">Older versions →</a></div>
          <details className="simple-details">
            <summary>Which file should I choose on itch.io?</summary>
            <ul className="public-file-list">{publicFiles.map((file) => <li key={file.name}><strong>{file.platforms}</strong> — {file.name} · {file.size}</li>)}</ul>
            <p>Windows and Linux use the PC archive. These are the 0.4beta.fix files listed on itch.io.</p>
          </details>
        </section>
        <section className="section" id="guide">
          <SectionTitle title="Installation & help" />
          <div className="guide-grid simple-guide">
            {guide.slice(0, 3).map((entry) => <article className="panel guide-card" key={entry.title}><IconBadge name={entry.icon} small /><h3>{entry.title}</h3><p>{entry.text}</p></article>)}
          </div>
          <p className="guide-support">Need help? <Link className="text-link" href="/faq">Read the FAQ →</Link></p>
        </section>
        <section className="section simple-update-section" id="next">
          <SectionTitle title={center.next ? `Next update · v${center.next.version}` : "Next update"} />
          <p>Full v0.4, including Act III, is in development. <ReleaseDate value={center.next?.public_release_at} />.</p>
          <div className="simple-links"><Link href="/blog/v04-development-progress">Development progress →</Link><Link href="/early-access">Check Early Access →</Link></div>
          <p id="supporter-builds" className="muted">{center.availability === "error" ? "Early Access availability could not be checked. Please try again later." : center.early.length ? "Published supporter builds are available on the Early Access page, subject to your membership and each release’s unlock date." : "No Early Access build is currently listed on this website."}</p>
        </section>
        <section className="section" id="changelog">
          <SectionTitle title="Release notes & older versions" />
          <details className="simple-details">
            <summary>What changed in the public Beta?</summary>
            <p>Based on the <a href={gameSources.beta} target="_blank" rel="noopener noreferrer">official Beta announcement</a>.</p>
            {changelogSections.filter((category) => center.current?.changelog?.[category]?.length).map((category) => <div className="simple-changelog" key={category}><h3>{category}</h3><ul>{center.current.changelog[category].map((entry) => <li key={entry}>{entry}</li>)}</ul></div>)}
          </details>
          <div id="previous">
            {center.previous.length ? center.previous.map((release) => (
              <details className="simple-details" key={release.version}>
                <summary>Older version · {release.version}</summary>
                <p>{release.description}</p>
                <DownloadCards release={release} />
              </details>
            )) : <EmptyState title="No older versions listed">Confirmed archive links will appear here.</EmptyState>}
          </div>
        </section>
      </div>
    </>
  );
}
