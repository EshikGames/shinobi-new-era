import { notFound } from "next/navigation";
import Link from "next/link";
import { Art } from "@/components/Ui";
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
    image: new URL(post.cover ?? "/images/hero.jpg", siteUrl).href,
  };
  return (
    <article className="shell section article-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structured).replace(/</g, "\\u003c"),
        }}
      />
      <Link href="/blog" className="text-link">
        ← Back to the journal
      </Link>
      <p className="eyebrow">{post.category}</p>
      <h1>{post.title}</h1>
      <ReleaseDate value={post.date} />
      <Art src={post.cover ?? "/images/hero.jpg"} alt={post.title} />
      <p className="article-lead">{post.summary}</p>
      {post.source && (
        <p className="source-note">
          Summary of an official Eshik Games update.{" "}
          <a href={post.source} target="_blank" rel="noopener noreferrer">
            Read the original on itch.io ↗
          </a>
        </p>
      )}
      {post.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </section>
      ))}
      <Link href="/download" className="button button-primary">
        Visit the Release Center ↗
      </Link>
    </article>
  );
}
