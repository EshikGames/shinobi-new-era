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
      name: "SubscribeStar",
      url: "https://subscribestar.adult/eshik-games",
      color: "hover:border-pink-500/50 hover:text-pink-400",
      icon: (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
          <path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
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
            Shinobi New Era v0.3
          </span>

          <h1 className="mx-auto max-w-4xl text-6xl font-black leading-[0.95] tracking-tight md:text-8xl lg:text-9xl">
            SHINOBI
            <br />
            <span className="bg-gradient-to-r from-red-500 via-red-400 to-orange-400 bg-clip-text text-transparent">
              NEW ERA
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-lg text-white/60">
            v0.3 is out now for supporters.
            <br />
            The public release arrives in one week.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="#support"
              className="w-full rounded-xl bg-red-600 px-8 py-4 font-semibold transition hover:bg-red-500 sm:w-auto"
            >
              Get v0.3 Early Access
            </Link>
            <Link
              href="/download"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-8 py-4 font-semibold backdrop-blur-sm transition hover:bg-white/10 sm:w-auto"
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
      <section id="support" className="relative mx-auto max-w-4xl scroll-mt-16 px-6 py-24">
        <div className="text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-red-400/70">
            Support
          </p>
          <h2 className="text-4xl font-black md:text-5xl">
            Support the Development
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/50">
            Get v0.3 Early Access through one of these supporter platforms.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
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
