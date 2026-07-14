"use client";

import { motion } from "framer-motion";

export default function Download() {
  const platforms = [
    {
      name: "Windows",
      version: "v0.02b · PC",
      size: "406 MB",
      // 🔗 Replace with your real download link
      url: "https://mega.nz/file/96InnALA#803Y8r-9-hRqJNQrjtm8pJUX2bMssH6-dimb_mf-Po8",
      color: "hover:border-blue-500/50",
      iconColor: "text-blue-400",
      icon: (
        <svg viewBox="0 0 24 24" className="h-12 w-12" fill="currentColor">
          <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.351" />
        </svg>
      ),
    },
    {
      name: "macOS",
      version: "v0.02b · Mac",
      size: "401 MB",
      url: "https://mega.nz/file/EiJDQaCA#BP3fqQZR770PRVuMK3XaCXSYkQBKmzRtd9CvE2azYDw",
      color: "hover:border-slate-400/50",
      iconColor: "text-slate-300",
      icon: (
        <svg viewBox="0 0 24 24" className="h-12 w-12" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.84M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
      ),
    },
    {
      name: "Android",
      version: "v0.02b · APK",
      size: "416 MB",
      url: "https://mega.nz/file/N3pz3aCK#_nnzLYTwyYB05zRrfbYA7EXH4PrGwmTYqoI5FrNSKRc",
      color: "hover:border-green-500/50",
      iconColor: "text-green-400",
      icon: (
        <svg viewBox="0 0 24 24" className="h-12 w-12" fill="currentColor">
          <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85a.637.637 0 0 0-.83.22l-1.88 3.24a11.463 11.463 0 0 0-8.94 0L5.65 5.67a.643.643 0 0 0-.87-.2c-.28.18-.37.54-.22.83L6.4 9.48A10.78 10.78 0 0 0 1 18h22a10.78 10.78 0 0 0-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      {/* Header */}
      <div className="mb-14 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-red-400/70">
          Download
        </p>
        <h1 className="text-4xl font-black md:text-5xl">Choose Your Platform</h1>
        <p className="mx-auto mt-4 max-w-lg text-white/50">
          Shinobi New Era is completely free. Pick your device and start playing!
        </p>
      </div>

      {/* Platform cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {platforms.map((p, i) => (
          <motion.a
            key={i}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            download
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -6 }}
            className={`group flex flex-col items-center rounded-3xl border border-white/10 bg-white/5 p-8 text-center transition ${p.color}`}
          >
            <div className={`mb-6 ${p.iconColor} transition group-hover:scale-110`}>
              {p.icon}
            </div>

            <h3 className="text-2xl font-black">{p.name}</h3>
            <p className="mt-1 text-sm text-white/40">{p.version}</p>
            <p className="mt-1 text-xs text-white/30">{p.size}</p>

            <span className="mt-6 w-full rounded-xl bg-red-600 px-6 py-3 font-semibold transition group-hover:bg-red-500">
              Download
            </span>
          </motion.a>
        ))}
      </div>

      {/* System requirements */}
      <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-8">
        <h4 className="mb-4 font-bold">System Requirements</h4>
        <div className="grid gap-4 text-sm text-white/50 sm:grid-cols-2">
          <div>
            <p className="mb-1 font-semibold text-white/70">Minimum</p>
            <p>OS: Windows 10 / macOS 11 / Android 8</p>
            <p>RAM: 4 GB</p>
            <p>Storage: 2 GB free space</p>
          </div>
          <div>
            <p className="mb-1 font-semibold text-white/70">Recommended</p>
            <p>OS: Windows 11 / macOS 13 / Android 12</p>
            <p>RAM: 8 GB</p>
            <p>Storage: 3 GB free space</p>
          </div>
        </div>
      </div>

      {/* Note */}
      <p className="mt-8 text-center text-xs text-white/30">
        By downloading, you agree to our terms of use. This game is intended for adult audiences.
      </p>
    </section>
  );
}