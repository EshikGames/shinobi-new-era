export const siteUrl = "https://shinobinewera.com/";
export const siteTitle = "Shinobi New Era Official Site";
export const siteName = "Shinobi New Era";
export const siteDescription =
  "Shinobi New Era is an open-world visual novel inspired by the Naruto/Boruto universe. Explore Konoha, build relationships, complete quests, and experience an evolving story.";

export function metadataForPath(path) {
  const url = new URL(path, siteUrl).toString();

  return {
    alternates: { canonical: url },
    openGraph: {
      title: siteTitle,
      description: siteDescription,
      url,
      siteName,
      type: "website",
    },
  };
}
