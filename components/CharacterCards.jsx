import { characters } from "@/lib/site-content.mjs";
import { Art } from "./Ui";
export default function CharacterCards({ limit }) {
  return (
    <div className="character-grid">
      {characters.slice(0, limit ?? characters.length).map((character, i) => (
        <article className="character-card" key={character.name}>
          <Art
            src={character.image}
            alt={`${character.name} — Shinobi New Era portrait`}
            sizes="(max-width: 600px) 46vw, (max-width: 1000px) 30vw, 24vw"
          />
          <div className="character-caption">
            <span className="mono">{String(i + 1).padStart(2, "0")} / SNE</span>
            <h3>{character.name}</h3>
          </div>
        </article>
      ))}
    </div>
  );
}
