import type { MetadataRoute } from "next";
import { siteUrl } from "./seo";
import { getPosts } from "../lib/releases/server";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/about",
    "/characters",
    "/download",
    "/early-access",
    "/faq",
    "/play",
    "/gallery",
    "/blog",
    ...getPosts().map((post: { slug: string }) => `/blog/${post.slug}`),
  ];

  return routes.map((route) => ({
    url: new URL(route, siteUrl).toString(),
  }));
}
