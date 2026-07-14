export default function About() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div>
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-red-400/70">
            About
          </p>
          <h2 className="text-4xl font-black leading-tight md:text-5xl">
            Your story.
            <br />
            Your rules.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/50">
            Dive into a world where every action has consequences. Build
            relationships, explore an open world, and shape the fate of the
            shinobi.
          </p>
          <div className="mt-8 space-y-4">
            {[
              "Branching Paths",
              "Open sandbox world to explore",
              "Deep relationship system",
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-xs text-red-400">
                  ✓
                </span>
                <span className="text-white/70">{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-red-600/20 to-orange-500/10 blur-2xl" />
          <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="aspect-video overflow-hidden rounded-2xl bg-gradient-to-br from-red-900/40 to-black">
              <img src="/images/1.jpg" alt="Shinobi" className="h-full w-full object-cover" />
            </div>
            <p className="mt-6 text-sm text-white/40">Latest update</p>
            <p className="text-xl font-bold">Chapter 1: Coming Home</p>
          </div>
        </div>
      </div>
    </section>
  );
}