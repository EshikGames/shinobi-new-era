export default function Footer() {
  const links = [
    { name: "Boosty", url: "https://boosty.to/eshikgames" },
    { name: "Patreon", url: "https://www.patreon.com/cw/eshikgames" },
    { name: "Itch.io", url: "https://eshik-games.itch.io/shinobi-new-era" },
    { name: "Discord", url: "https://discord.gg/HpGgzDgycE" },
  ];

  return (
    <footer className="mt-20 flex flex-col items-center gap-4 border-t border-white/5 py-16 text-center">
      <div className="flex flex-col leading-none items-center">
        <span className="text-lg font-black">
          SHINOBI<span className="text-red-500">.</span>
        </span>
        <span className="text-[10px] font-medium tracking-wide text-white/40">
          by Eshik Games
        </span>
      </div>
      <div className="flex gap-6 text-sm text-white/40">
        {links.map((l) => (
          <a
            key={l.name}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            {l.name}
          </a>
        ))}
      </div>
      <p className="text-xs text-white/20">© 2026 Shinobi New Era</p>
    </footer>
  );
}