import Link from "next/link";
import Icon from "./Icon";
import { community } from "@/lib/site-content.mjs";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-top">
        <div>
          <p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
          <h2>
            Stay in the <em>story.</em>
          </h2>
          <p>
            Development updates, new chapters and a world worth coming back to.
          </p>
          <a
            className="text-link"
            href={community[0].href}
            target="_blank"
            rel="noopener noreferrer"
          >
            Join the Discord ↗
          </a>
        </div>
        <div className="footer-links">
          <div>
            <h3>Explore</h3>
            {[
              ["/about", "The game"],
              ["/characters", "Characters"],
              ["/gallery", "Gallery"],
              ["/play", "Play online"],
            ].map(([href, label]) => (
              <Link href={href} key={href}>
                {label}
              </Link>
            ))}
          </div>
          <div>
            <h3>Keep up</h3>
            {[
              ["/download", "Release Center"],
              ["/early-access", "Early Access"],
              ["/blog", "Devlog"],
              ["/faq", "FAQ & help"],
            ].map(([href, label]) => (
              <Link href={href} key={href}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="shell footer-bottom">
        <Link href="/" className="footer-brand">
          SHINOBI <span>NEW ERA</span>
          <small>© {new Date().getFullYear()} Eshik Games</small>
        </Link>
        <div>
          {community.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name={item.icon} />
              {item.name} ↗
            </a>
          ))}
        </div>
        <span className="adult-label">18+ · MATURE AUDIENCES</span>
      </div>
    </footer>
  );
}
