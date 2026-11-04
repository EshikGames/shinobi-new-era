import Link from "next/link";
import { ReleaseDate } from "@/components/ReleaseBoard";
import { getPosts } from "@/lib/releases/server";
import { metadataForPath } from "../seo";

export const metadata = metadataForPath(
  "/blog",
  "Blog & Devlog | Shinobi New Era",
  "Follow Shinobi New Era development: character artwork, gameplay previews, localization and release notes from Eshik Games, with original itch.io devlogs.",
);

export default function Blog() {
  const posts = getPosts();
  return (
    <div className="journal-shell">
      <header className="journal-heading">
        <p className="eyebrow">DEVELOPMENT JOURNAL</p>
        <h1>Blog</h1>
        <p>Behind the scenes of Shinobi New Era. New artwork, development progress and release notes, straight from Eshik Games.</p>
        <a className="text-link" href="https://eshik-games.itch.io/shinobi-new-era/devlog" target="_blank" rel="noopener noreferrer">Follow the devlog on itch.io ↗</a>
      </header>
      <section aria-label="Development posts" className="journal-feed">
        {posts.map((post) => (
          <article className="journal-card" key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="journal-card-link">
              <div className="journal-meta"><ReleaseDate value={post.date} /><span>{post.category}</span></div>
              <h2>{post.title}</h2>
              <p>{post.summary}</p>
              <span className="journal-read">Read more <span aria-hidden="true">→</span></span>
            </Link>
          </article>
        ))}
      </section>
      <div className="journal-bottom"><span>Looking for the game?</span><Link href="/download" className="text-link">Guide & Downloads →</Link></div>
    </div>
  );
}
