import { metadataForPath } from "../seo";

export const metadata = metadataForPath("/about");

export default function AboutLayout({ children }) {
  return children;
}
