export const siteUrl = "https://shinobinewera.com/";
export const siteTitle = "Shinobi New Era | Official Site";
export const siteName = "Shinobi New Era";
export const siteDescription =
  "Shinobi New Era is an open-world visual novel inspired by the Naruto/Boruto universe. Explore Konoha, build relationships, complete quests, and experience an evolving story.";

export function metadataForPath(
  path,
  title = siteTitle,
  description = siteDescription,
) {
  const url = new URL(path, siteUrl).toString();

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type: "website",
      images: [
        {
          url: new URL("/images/hero.jpg", siteUrl).toString(),
          alt: "Shinobi New Era — Konoha at night",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [new URL("/images/hero.jpg", siteUrl).toString()],
    },
  };
}
