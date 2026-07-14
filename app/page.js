"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const supportLinks = [
    {
      name: "Boosty",
      url: "https://boosty.to/eshikgames", // 🔗 replace
      color: "hover:border-orange-500/50 hover:text-orange-400",
      icon: (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
          <path d="M12 2L4 14h5l-2 8 9-12h-5l3-8z" />
        </svg>
      ),
    },
    {
      name: "Patreon",
      url: "https://www.patreon.com/cw/eshikgames", // 🔗 replace
      color: "hover:border-red-500/50 hover:text-red-400",
      icon: (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
          <path d="M14.82 2.41c3.96 0 7.18 3.24 7.18 7.21 0 3.96-3.22 7.18-7.18 7.18-3.97 0-7.21-3.22-7.21-7.18 0-3.97 3.24-7.21 7.21-7.21M2 21.6h3.5V2.41H2V21.6z" />
        </svg>
      ),
    },
    {
      name: "Itch.io",
      url: "https://eshik-games.itch.io/shinobi-new-era", // 🔗 replace
      color: "hover:border-pink-500/50 hover:text-pink-400",
      icon: (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
          <path d="M3.13 1.34C2.29 1.84.03 4.42 0 5.09v1.12c0 1.42 1.33 2.66 2.53 2.66 1.44 0 2.64-1.19 2.64-2.6 0 1.41 1.15 2.6 2.59 2.6s2.55-1.19 2.55-2.6c0 1.41 1.23 2.6 2.67 2.6h.03c1.44 0 2.67-1.19 2.67-2.6 0 1.41 1.11 2.6 2.55 2.6s2.59-1.19 2.59-2.6c0 1.41 1.2 2.6 2.64 2.6 1.2 0 2.53-1.24 2.53-2.66V5.09c-.03-.67-2.29-3.25-3.13-3.75C19.94 1.28 17.19 1.19 12 1.19s-8.06.09-8.87.15zM9.4 9.87c-.62.87-1.67 1.45-2.86 1.45-1.19 0-2.24-.58-2.86-1.45-.35 1.24-.51 2.72-.55 4.05l-.02 1.65c0 3.71.09 5.85 1.11 6.87.6.6 1.62.83 3.02.93 1.62.12 3.35.13 5.72.13s4.1-.01 5.72-.13c1.4-.1 2.42-.33 3.02-.93 1.02-1.02 1.11-3.16 1.11-6.87l-.02-1.65c-.04-1.33-.2-2.81-.55-4.05-.62.87-1.67 1.45-2.86 1.45-1.19 0-2.24-.58-2.86-1.45-.62.87-1.65 1.45-2.83 1.45h-.03c-1.18 0-2.21-.58-2.83-1.45zm-1.44 3.16h.01c.66 0 1.24.01 1.94.79l.6.01.6-.01c.7-.78 1.28-.79 1.94-.79.66 0 1.98 0 2.94 1.02l.28 1.02c.09.42-.28.42-.75.42h-.03c-.7-.02-1.14-.53-1.61-1.09-.47.56-.95 1.09-1.72 1.09-.77 0-1.28-.53-1.75-1.09l-.13-.15-.13.15c-.47.56-.98 1.09-1.75 1.09-.77 0-1.25-.53-1.72-1.09-.47.56-.91 1.07-1.61 1.09h-.03c-.47 0-.84 0-.75-.42l.28-1.02c.96-1.02 2.28-1.02 2.94-1.02z" />
        </svg>
      ),
    },
    {
      name: "Discord",
      url: "https://discord.gg/HpGgzDgycE", // 🔗 replace
      color: "hover:border-indigo-500/50 hover:text-indigo-400",
      icon: (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
          <path d="M20.32 4.37a19.8 19.8 0 0 0-4.89-1.52.07.07 0 0 0-.08.04c-.21.38-.44.87-.61 1.25a18.27 18.27 0 0 0-5.49 0 12.6 12.6 0 0 0-.62-1.25.08.08 0 0 0-.08-.04c-1.71.3-3.35.81-4.89 1.52a.07.07 0 0 0-.03.03C.53 9.05-.32 13.58.1 18.06a.08.08 0 0 0 .03.06 19.9 19.9 0 0 0 5.99 3.03.08.08 0 0 0 .09-.03c.46-.63.87-1.29 1.23-1.99a.08.08 0 0 0-.04-.11c-.65-.25-1.27-.55-1.87-.89a.08.08 0 0 1-.01-.13c.13-.09.25-.19.37-.29a.07.07 0 0 1 .08-.01c3.93 1.79 8.18 1.79 12.06 0a.07.07 0 0 1 .08.01c.12.1.24.2.37.29a.08.08 0 0 1-.01.13c-.6.35-1.22.64-1.87.89a.08.08 0 0 0-.04.11c.36.7.78 1.36 1.23 1.99a.08.08 0 0 0 .09.03 19.9 19.9 0 0 0 6-3.03.08.08 0 0 0 .03-.06c.5-5.18-.84-9.67-3.55-13.66a.06.06 0 0 0-.03-.03zM8.02 15.33c-1.18 0-2.16-1.08-2.16-2.42s.95-2.42 2.16-2.42c1.22 0 2.19 1.09 2.17 2.42 0 1.34-.96 2.42-2.17 2.42zm7.97 0c-1.18 0-2.16-1.08-2.16-2.42s.95-2.42 2.16-2.42c1.22 0 2.19 1.09 2.17 2.42 0 1.34-.95 2.42-2.17 2.42z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative">
      {/* Hero background image */}
      <div className="pointer-events-none absolute inset-0 h-screen overflow-hidden">
        <img
          src="/images/hero.jpg"
          alt="Shinobi New Era"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#0a0a0f]/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-[#0a0a0f]/50" />
      </div>

      {/* HERO */}
      <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            New chapter available now
          </span>

          <h1 className="mx-auto max-w-4xl text-6xl font-black leading-[0.95] tracking-tight md:text-8xl lg:text-9xl">
            SHINOBI
            <br />
            <span className="bg-gradient-to-r from-red-500 via-red-400 to-orange-400 bg-clip-text text-transparent">
              NEW ERA
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-lg text-white/60">
            An interactive RPG visual novel where every choice shapes the fate
            of the Hidden Leaf.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/download"
              className="w-full rounded-xl bg-red-600 px-8 py-4 font-semibold transition hover:bg-red-500 sm:w-auto"
            >
              Download for free
            </Link>
            <Link
              href="/about"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-8 py-4 font-semibold backdrop-blur-sm transition hover:bg-white/10 sm:w-auto"
            >
              Learn more
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-8 border-t border-white/10 pt-8 md:gap-16">
          {[
            { num: "2K+", label: "Players" },
            { num: "20+", label: "Scenes" },
            { num: "∞", label: "Branching Paths" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-black md:text-4xl">{s.num}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-white/50">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SUPPORT SECTION */}
      <section className="relative mx-auto max-w-4xl px-6 py-24">
        <div className="text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-red-400/70">
            Support
          </p>
          <h2 className="text-4xl font-black md:text-5xl">
            Support the Development
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/50">
            Help us keep creating new content. Every contribution matters!
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {supportLinks.map((s, i) => (
            <a
              key={i}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70 transition ${s.color}`}
            >
              <span className="transition group-hover:scale-110">{s.icon}</span>
              <span className="font-semibold">{s.name}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}