import Link from "next/link";
import Icon from "./Icon";
import { community } from "@/lib/site-content.mjs";

export default function Footer() {
  return (
    <footer className="site-footer simple-footer">
      <div className="shell">
        <div className="simple-footer-top">
          <Link href="/" className="footer-brand">SHINOBI <span>NEW ERA</span><small>© {new Date().getFullYear()} Eshik Games · 18+</small></Link>
          <nav aria-label="Footer navigation">
            {[["/about", "About"], ["/download", "Downloads"], ["/play", "Play online"], ["/early-access", "Early Access"], ["/characters", "Characters"], ["/gallery", "Gallery"], ["/blog", "Updates"], ["/faq", "Help"]].map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
          </nav>
        </div>
        <div className="simple-footer-social">
          {community.map((item) => <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer"><Icon name={item.icon} />{item.name}<span aria-hidden="true">↗</span></a>)}
        </div>
      </div>
    </footer>
  );
}