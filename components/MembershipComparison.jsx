import Link from "next/link";
import { membershipSource, supporterTiers, membershipComparison } from "@/lib/supporter-tiers.mjs";

function Benefit({ tier, benefit }) {
  if (!tier?.includes.includes(benefit)) return <span className="membership-no" aria-label="Not included">—</span>;
  if (benefit === "early") return <strong className="membership-days">{tier.earlyAccessDays} days</strong>;
  return <span className="membership-yes" aria-label="Included">✓</span>;
}

export default function MembershipComparison({ compact = false }) {
  const tiers = compact ? supporterTiers.filter(tier => tier.earlyAccessDays === 14) : supporterTiers;
  const benefits = compact ? membershipComparison.filter(benefit => ['early', 'gallery', 'bonus', 'community', 'customCg', 'customScene'].includes(benefit.key)) : membershipComparison;
  return (
    <section className="membership-section" id="membership" aria-labelledby="membership-title">
      <div className="membership-heading"><p className="eyebrow">CHOOSE YOUR SUPPORT</p><h2 id="membership-title">{compact ? 'Find your place in the new era.' : <>A place in the <em>new era.</em></>}</h2><p>{compact ? 'Early Access starts with Resonance Adept. Patreon prices and benefits are shown below.' : 'Compare the creator’s Patreon tiers. Resonance Adept and above include 14-day Early Access.'}</p></div>
      <p className="membership-scroll-hint">Swipe the table to compare all tiers →</p>
      <div className="membership-table-scroll" role="region" aria-label="Patreon tier comparison, scroll horizontally for all tiers" tabIndex={0}>
        <table className="membership-table">
          <caption className="sr-only">Patreon membership prices and benefits. USD per month; final pricing is shown on Patreon.</caption>
          <thead><tr><th scope="col">Benefits</th><th scope="col"><span className="membership-tier-title">Free</span><span className="membership-price">$0</span><small>Public version</small></th>{tiers.map(tier => <th scope="col" key={tier.id} className={tier.id === "29743574" ? "membership-highlight" : undefined}>
            {tier.id === "29743574" && <span className="membership-pick">14-DAY ACCESS</span>}
            <a href={membershipSource} target="_blank" rel="noopener noreferrer" className="membership-tier-title">{tier.name}</a>
            <span className="membership-price">${tier.monthlyUsd}<small>/ month</small></span>
          </th>)}</tr></thead>
          <tbody><tr><th scope="row">Public game</th>{[null, ...tiers].map(tier => <td key={tier?.id ?? "free"} className={tier?.id === "29743574" ? "membership-highlight" : undefined}><span className="membership-yes" aria-label="Included">✓</span></td>)}</tr>
            {benefits.map(benefit => <tr key={benefit.key}><th scope="row">{benefit.label}{benefit.detail && <small>{benefit.detail}</small>}</th><td><Benefit benefit={benefit.key} /></td>{tiers.map(tier => <td key={tier.id} className={tier.id === "29743574" ? "membership-highlight" : undefined}><Benefit tier={tier} benefit={benefit.key} /></td>)}</tr>)}
          </tbody>
          <tfoot><tr><th scope="row">Explore</th><td><Link href="/download">Free download →</Link></td>{tiers.map(tier => <td key={tier.id} className={tier.id === "29743574" ? "membership-highlight" : undefined}><a href={membershipSource} target="_blank" rel="noopener noreferrer" aria-label={`View ${tier.name} on Patreon`}>View tier ↗</a></td>)}</tr></tfoot>
        </table>
      </div>
      {compact && <p className="ea-support-links">Support on <a href={membershipSource} target="_blank" rel="noopener noreferrer">Patreon ↗</a><a href="https://subscribestar.adult/eshik-games" target="_blank" rel="noopener noreferrer">SubscribeStar ↗</a><a href="https://boosty.to/eshikgames" target="_blank" rel="noopener noreferrer">Boosty ↗</a></p>}
      <p className="membership-source">USD monthly prices checked on November 4, 2026. Taxes, currency and checkout totals may vary. <a href={membershipSource} target="_blank" rel="noopener noreferrer">See current Patreon terms ↗</a></p>
      <p className="membership-note"><strong>Website downloads:</strong> only active Resonance Adept, Otsutsuki Chosen and New Era Architect memberships qualify for this site’s Early Access builds. Karma Bearer’s supporter builds are a separate Patreon benefit. Every website download also requires a published, unlocked release.</p>
      <details className="membership-details"><summary>See the full benefits and custom-content conditions</summary><div className="membership-details-grid">{supporterTiers.map(tier => <article key={tier.id}><h3>{tier.name}</h3><ul>{tier.benefits.map(benefit => <li key={benefit}>{benefit}</li>)}</ul>{tier.caveat && <p>{tier.caveat}</p>}</article>)}</div></details>
    </section>
  );
}
