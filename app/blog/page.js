import Link from "next/link";
import { Art, EmptyState, PageIntro } from "@/components/Ui";
import { ReleaseDate } from "@/components/ReleaseBoard";
import { getPosts } from "@/lib/releases/server";
import { metadataForPath } from "../seo";
export const metadata = metadataForPath(
  "/blog",
  "Devlog | Shinobi New Era",
  "Official development updates, confirmed release notes and behind-the-scenes posts from Eshik Games.",
);
export default function Blog() {
  const posts = getPosts();
  return (
    <>
      <PageIntro
        kicker="FROM THE STUDIO"
        title="Updates"
        number="06"
      >
        Development notes, official announcements and release changelogs from
        Eshik Games.
      </PageIntro>
      <section className="shell section">
        {posts.length ? (
          <div className="blog-grid">
            {posts.map((post) => (
              <Link
                className="blog-card panel"
                href={`/blog/${post.slug}`}
                key={post.slug}
              >
                <Art src={post.cover ?? "/images/hero.jpg"} alt={post.title} />
                <div>
                  <span className="eyebrow">{post.category}</span>
                  <h2>{post.title}</h2>
                  <p>{post.summary}</p>
                  <ReleaseDate value={post.date} />
                  <span className="text-link">Read the update ↗</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="The journal is waiting for its first post.">
            Confirmed announcements and dated release notes will appear here. In
            the meantime, find the current version in Downloads.
          </EmptyState>
        )}
        <div className="section-end">
          <Link href="/download" className="button button-secondary">
            View downloads ↗
          </Link>
        </div>
      </section>
    </>
  );
}
