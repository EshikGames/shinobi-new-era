"use client";

import { motion } from "framer-motion";

export default function Characters() {
  const characters = [
    { name: "Boruto", img: "/images/characters/boruto.jpg" },
    { name: "Momoshiki", img: "/images/characters/momoshiki.jpg" },
    { name: "Hinata", img: "/images/characters/hinata.jpg" },
    { name: "Himawari", img: "/images/characters/himawari.jpg" },
    { name: "Sakura", img: "/images/characters/sakura.jpg" },
    { name: "Sumire", img: "/images/characters/sumire.jpg" },
    { name: "Sarada", img: "/images/characters/sarada.jpg" },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-12 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-red-400/70">
          Characters
        </p>
        <h2 className="text-4xl font-black md:text-5xl">Meet the Heroes</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {characters.map((c, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -8 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={c.img}
                alt={c.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-0 p-5">
              <p className="text-lg font-bold">{c.name}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}