"use client";

import { useState } from "react";

export default function Faq() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: "What is Shinobi New Era?", a: "An RPG visual novel with a branching storyline where your decisions change the fate of the world." },
    { q: "Is the game free?", a: "Yes, completely! Boosty subscribers get early access to updates." },
    { q: "Which platforms are supported?", a: "PC (Windows, Mac, Linux), Android, and directly in your browser." },
    { q: "How often are updates released?", a: "Every 2-4 weeks: new story, characters, and improvements." },
  ];

  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <div className="mb-12 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-red-400/70">
          Questions
        </p>
        <h2 className="text-4xl font-black md:text-5xl">Frequently Asked Questions</h2>
      </div>

      <div className="space-y-3">
        {faqs.map((item, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="flex w-full items-center justify-between px-6 py-5 text-left"
            >
              <span className="font-medium text-white/90">{item.q}</span>
              <span className={`text-white/40 transition-transform ${openFaq === i ? "rotate-45" : ""}`}>
                +
              </span>
            </button>
            {openFaq === i && <p className="px-6 pb-5 text-white/50">{item.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}