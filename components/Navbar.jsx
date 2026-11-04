"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
const links = [
  ["/", "Home"],
  ["/play", "Play"],
  ["/download", "Downloads"],
  ["/early-access", "Early Access"],
  ["/blog", "Updates"],
];
export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  function escape(event) {
    if (event.key === "Escape" && open) {
      setOpen(false);
      toggle.current?.focus();
    }
  }
  return (
    <header className="site-header" onKeyDown={escape}>
      <div className="header-inner shell">
        <Link href="/" className="brand" aria-label="Shinobi New Era — Home" onClick={() => setOpen(false)}>
          <span className="brand-symbol" aria-hidden="true">
            S<span>N</span>E
          </span>
          <span className="brand-copy">
            <strong>
              SHINOBI <b>NEW ERA</b>
            </strong>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={
                pathname === href ||
                (href !== "/" && pathname.startsWith(`${href}/`))
                  ? "page"
                  : undefined
              }
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link className="header-play" href="/play">
          Play online ↗
        </Link>
        <button
          ref={toggle}
          className="menu-toggle"
          aria-controls="mobile-navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation" : "Open navigation"}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav shell"
          aria-label="Mobile navigation"
        >
          {[
            ...links,
            ["/about", "About the game"],
            ["/characters", "Characters"],
            ["/gallery", "Gallery"],
            ["/faq", "Help"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
