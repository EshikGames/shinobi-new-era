import { notFound } from "next/navigation";
import Link from "next/link";
import { ReleaseDate } from "@/components/ReleaseBoard";
import { getPosts } from "@/lib/releases/server";
import { metadataForPath, siteUrl } from "../../seo";
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPosts().find((item) => item.slug === slug);
  return post
    ? metadataForPath(
        `/blog/${slug}`,
        `${post.title} | Eshik Games`,
        post.summary,
      )
    : { title: "Post not found", robots: { index: false } };
}
export default async function Post({ params }) {
  const { slug } = await params;
  const post = getPosts().find((item) => item.slug === slug);
  if (!post) notFound();
  const structured = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    author: { "@type": "Organization", name: "Eshik Games" },
    mainEntityOfPage: new URL(`/blog/${post.slug}`, siteUrl).href,
    ...(post.source ? { isBasedOn: post.source } : {}),
    image: new URL(post.cover ?? "/images/hero.jpg", siteUrl).href,
  };
  return (
    <article className="journal-shell journal-article">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structured).replace(/</g, "\\u003c"),
        }}
      />
      <Link href="/blog" className="text-link">
        ← Back to Blog
      </Link>
      <header className="journal-article-heading">
        <p className="eyebrow">{post.category}</p>
        <h1>{post.title}</h1>
        <div className="journal-meta"><ReleaseDate value={post.date} /><span>By Eshik Games</span></div>
        <p className="journal-lead">{post.summary}</p>
      </header>
      {post.source && (
        <p className="journal-source">
          Adapted from our official devlog.{" "}
          <a href={post.source} target="_blank" rel="noopener noreferrer">
            Read the original on itch.io ↗
          </a>
        </p>
      )}
      {post.sections.map((section) => (
        <section className="journal-article-section" key={section.heading}>
          <h2>{section.heading}</h2>
          {section.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </section>
      ))}
      <footer className="journal-bottom"><Link href="/blog" className="text-link">← All posts</Link><Link href="/download" className="text-link">Current downloads →</Link></footer>
    </article>
  );
}
