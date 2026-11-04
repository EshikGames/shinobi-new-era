import { FaqList, PageIntro } from "@/components/Ui";
import { community, faqs } from "@/lib/site-content.mjs";
import { metadataForPath } from "../seo";
export const metadata = metadataForPath(
  "/faq",
  "FAQ & Help | Shinobi New Era",
  "Answers about Shinobi New Era downloads, browser play, Patreon verification, upcoming versions and official support.",
);
export default function Faq() {
  const structured = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structured).replace(/</g, "\\u003c"),
        }}
      />
      <PageIntro
        kicker="A LITTLE GUIDANCE"
        title="Help & FAQ"
        number="FAQ"
      >
        Downloads, access and getting started. Find your answer here.
      </PageIntro>
      <section className="shell section narrow">
        <FaqList items={faqs} />
        <div className="help-callout panel">
          <h2>Still need help?</h2>
          <p>Tell us your version, platform and what happened.</p>
          <a
            className="button button-primary"
            href={community[0].href}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ask on Discord ↗
          </a>
        </div>
      </section>
    </>
  );
}
