"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // ✅ состояние меню

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/characters", label: "Characters" },
    { href: "/play", label: "Play" },
    { href: "/download", label: "Download" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo + subtitle */}
        <Link href="/" className="flex flex-col leading-none" onClick={() => setOpen(false)}>
          <span className="text-lg font-black tracking-tight">
            SHINOBI<span className="text-red-500">.</span>
          </span>
          <span className="text-[10px] font-medium tracking-wide text-white/40">
            by Eshik Games
          </span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden gap-8 text-sm md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`transition ${
                pathname === l.href ? "text-white" : "text-white/50 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop Play button */}
        <Link
          href="/play"
          className="hidden rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90 md:block"
        >
          Play
        </Link>

        {/* ☰ Burger button (only mobile) */}
        <button
          onClick={() => setOpen(!open)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <span
            className={`h-0.5 w-6 bg-white transition ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <div className="flex flex-col gap-1 border-t border-white/5 bg-[#0a0a0f]/95 px-6 py-4 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`rounded-lg px-2 py-3 text-sm transition ${
                pathname === l.href
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}

          {/* Play button in mobile menu */}
          <Link
            href="/play"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Play
          </Link>
        </div>
      )}
    </nav>
  );
}