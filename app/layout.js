import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { metadataForPath, siteDescription, siteName, siteTitle, siteUrl } from "./seo";

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
    <html lang="ru">
      <body className="min-h-screen bg-[#0a0a0f] text-white antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {/* Свечение сверху */}
        <div className="pointer-events-none fixed inset-x-0 top-0 h-[500px] bg-gradient-to-b from-red-600/10 via-transparent to-transparent" />

        <Navbar />

        {/* Отступ под фикс-навбар */}
        <main className="relative pt-16">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
