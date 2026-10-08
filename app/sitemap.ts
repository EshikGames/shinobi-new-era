import type { MetadataRoute } from "next";
import { siteUrl } from "./seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/about", "/characters", "/download", "/faq", "/play"];

  return routes.map((route) => ({
    url: new URL(route, siteUrl).toString(),
  }));
}
