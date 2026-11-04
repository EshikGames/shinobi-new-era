import Link from "next/link";
import { community } from "@/lib/site-content.mjs";

export default function SupporterGuide() {
  return (
    <section className="section gallery-help" id="supporter-guide" aria-labelledby="supporter-guide-title">
      <h2 id="supporter-guide-title">Unlock the in-game gallery</h2>
      <p>Gallery access is checked inside the game using your supporter email. Signing in on this website is only for Early Access downloads.</p>
      <ol className="simple-steps">
        <li>Open the supporter check in your installed game.</li>
        <li>Enter the email associated with your supporter account.</li>
        <li>Read the result shown by the game.</li>
      </ol>
      <details className="simple-details">
        <summary>My email is not recognized</summary>
        <p>Check for typing errors and confirm the email linked to your subscription. Review your payment and subscription status on the platform. If it still does not work, contact Eshik Games with your game version, platform and error message. Keep your email and account details out of public posts.</p>
        <a className="text-link" href={community[0].href} target="_blank" rel="noopener noreferrer">Get help on Discord ↗</a>
      </details>
      <details className="simple-details">
        <summary>What happens if I cancel my subscription?</summary>
        <p>Stopping renewal and reaching the end of a paid period are different. Check your platform’s current membership status. Website downloads and the in-game gallery check access separately; no fixed grace period is promised.</p>
      </details>
      <p className="muted">The <Link href="/gallery">website artwork gallery</Link> is public and separate from the gallery inside the game.</p>
    </section>
  );
}