import Image from "next/image";

// Original SNE symbols, not official platform logos. Visible text identifies each service.
const platformNames = new Set([
  "windows",
  "macos",
  "android",
  "patreon",
  "subscribestar",
  "boosty",
  "terminal",
  "itchio",
  "discord",
]);
const generatedNames = new Set([...platformNames].filter((name) => name !== "terminal"));
const paths = {
  interface: [
    "M3 3h18v18H3ZM3 8h18M9 8v13",
    "M12 12h6m-6 4h4M6 5.5h.01m3 0h.01",
  ],
  compass: [
    "M12 2 20.7 7v10L12 22l-8.7-5V7Z",
    "m16 8-2.5 5.5L8 16l2.5-5.5Z",
    "M12 2v3m0 14v3M3.3 7l2.6 1.5m12.2 7 2.6 1.5",
  ],
  story: [
    "M5 3h12a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3",
    "M7 3v13m-3 0h16M10 7h6m-6 4h4",
  ],
  people: [
    "M12 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z",
    "M6 21v-5a6 6 0 0 1 12 0v5M3 9a2.5 2.5 0 0 1 3 4m15-4a2.5 2.5 0 0 0-3 4M2 20v-3m20 3v-3",
  ],
  language: [
    "M3 5h12M9 2v3m-4 4c1 4 5 7 9 8M12 5c0 6-4 10-9 12",
    "m13 21 4-12 4 12m-6.5-4h5",
  ],
  moon: [
    "M20 14A8 8 0 0 1 10 4a8.5 8.5 0 1 0 10 10Z",
    "m17 2 1 3 3 1-3 1-1 3-1-3-3-1 3-1Z",
  ],
  combat: [
    "m4 3 5 2 11 13-2 2L5 9Zm16 0-5 2-4 5m-3 3-4 5 2 2 4-4",
    "m14 19 5-5M5 14l5 5M3 21l3-3m12 0 3 3",
  ],
  shield: ["m12 2 8 3v6c0 5-4 9-8 11-4-2-8-6-8-11V5Z", "m8 12 3 3 5-6"],
  download: ["M12 3v12m-5-5 5 5 5-5", "M4 16v5h16v-5"],
  desktop: ["M3 4h18v13H3ZM8 21h8m-4-4v4", "m8 9 3 3 5-5"],
  terminal: ["M3 4h18v16H3Z", "m6 8 3 3-3 3m6 1h5"],
  save: ["M4 3h13l3 3v15H4Z", "M8 3v6h8V3M8 21v-8h8v8"],
  quest: [
    "M6 3h14v18H6ZM6 7H3m3 5H3m3 5H3",
    "m10 8 1 1 2-2m2 1h2m-7 7 1 1 2-2m2 1h2",
  ],
  chat: ["M3 4h18v13H9l-6 4Z", "M7 8h10M7 12h6"],
  support: ["M12 7c-4-6-12 0-6 6l6 6 6-6c6-6-2-12-6-6Z", "M9 11h6m-3-3v6"],
  store: ["m4 3-2 5v3h20V8l-2-5Zm0 8v10h16V11", "M9 21v-7h6v7M8 3 7 8m9-5 1 5"],
  play: ["M8 4 21 12 8 20Z", "M3 6v12"],
};
export default function Icon({ name = "compass", className = "" }) {
  if (generatedNames.has(name)) {
    return (
      <Image
        src={`/images/platforms/${name}-minimal-v3.png`}
        alt=""
        aria-hidden="true"
        width={128}
        height={128}
        sizes="82px"
        className={`sne-icon platform-image ${className}`}
      />
    );
  }
  return (
    <svg
      className={`sne-icon${platformNames.has(name) ? " platform-glyph" : ""} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {(paths[name] ?? paths.compass).map((d, i) => (
        <path d={d} key={i} className={i === 1 ? "icon-accent" : undefined} />
      ))}
    </svg>
  );
}
export function IconBadge({ name, small = false }) {
  return (
    <span
      className={`icon-badge${small ? " icon-badge-small" : ""}${platformNames.has(name) ? " icon-badge-platform" : ""}`}
    >
      <Icon name={name} />
    </span>
  );
}
