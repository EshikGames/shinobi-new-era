"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Play() {
  const [started, setStarted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  // 🔗 Replace with your game's embed URL
  // Examples: Itch.io embed, your own HTML5 build, Ren'Py Web, etc.
  const GAME_URL = "/game/index.html";

  const handleFullscreen = () => {
    const frame = document.getElementById("game-frame");
    if (frame?.requestFullscreen) {
      frame.requestFullscreen();
    }
    setFullscreen(true);
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      {/* Header */}
      <div className="mb-8 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-red-400/70">
          Play Online
        </p>
        <h1 className="text-4xl font-black md:text-5xl">Play in Browser</h1>
        <p className="mx-auto mt-4 max-w-lg text-white/50">
          No download required. Start your adventure right now!
        </p>
      </div>

      {/* Game window */}
      <div className="relative mx-auto aspect-video w-full overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">
        {!started ? (
          /* Start screen */
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Blurred background */}
            <img
              src="/images/1.jpg"
              alt="Shinobi New Era"
              className="absolute inset-0 h-full w-full object-cover opacity-40 blur-sm"
            />
            <div className="absolute inset-0 bg-black/50" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <h2 className="text-3xl font-black md:text-5xl">
                SHINOBI
                <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
                  {" "}NEW ERA
                </span>
              </h2>
              <p className="mt-3 text-white/60">Ready to begin?</p>

              <button
                onClick={() => setStarted(true)}
                className="mt-8 flex items-center gap-3 rounded-full bg-red-600 px-10 py-4 text-lg font-bold transition hover:scale-105 hover:bg-red-500"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play Now
              </button>

              <p className="mt-4 text-xs text-white/30">
                Loads directly in your browser · No install needed
              </p>
            </motion.div>
          </div>
        ) : (
          /* Actual game iframe */
          <iframe
            id="game-frame"
            src={GAME_URL}
            title="Shinobi New Era"
            className="h-full w-full"
            allow="autoplay; fullscreen; gamepad; microphone"
            allowFullScreen
          />
        )}
      </div>

      {/* Controls under the game */}
      {started && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleFullscreen}
            className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold transition hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
            </svg>
            Fullscreen
          </button>

          <button
            onClick={() => setStarted(false)}
            className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold transition hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
            </svg>
            Restart
          </button>

          <Link
            href="/download"
            className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-500"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
            Download App
          </Link>
        </div>
      )}

      {/* Info block */}
      <div className="mx-auto mt-14 max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-8">
        <h4 className="mb-4 font-bold">Tips for the best experience</h4>
        <ul className="space-y-3 text-sm text-white/50">
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20 text-xs text-red-400">✓</span>
            Use a desktop browser (Chrome / Edge) for best performance.
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20 text-xs text-red-400">✓</span>
            Enable fullscreen for a more immersive experience.
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20 text-xs text-red-400">✓</span>
            Want to save progress offline? Download the full app version.
          </li>
        </ul>
      </div>
    </section>
  );
}