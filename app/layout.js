import "./globals.css";
import "./cinematic.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  metadataForPath,
  siteDescription,
  siteName,
  siteTitle,
  siteUrl,
} from "./seo";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  ...metadataForPath("/"),
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  alternateName: siteTitle,
  url: siteUrl,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Navbar />

        {/* Отступ под фикс-навбар */}
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
