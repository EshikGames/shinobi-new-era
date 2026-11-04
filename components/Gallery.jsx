"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { gallery } from "@/lib/site-content.mjs";
export default function Gallery() {
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  const opener = useRef(null);
  function open(index, event) {
    opener.current = event.currentTarget;
    setSelected(index);
    dialog.current.showModal();
  }
  function close() {
    dialog.current.close();
    setSelected(null);
    opener.current?.focus();
  }
  function step(direction) {
    setSelected(
      (value) => (value + direction + gallery.length) % gallery.length,
    );
  }
  const item = selected === null ? null : gallery[selected];
  return (
    <>
      <div className="gallery-filters" role="group" aria-label="Filter artwork">
        {["All", "World", "Artwork"].map((name) => (
          <button
            key={name}
            aria-pressed={category === name}
            onClick={() => setCategory(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="gallery-grid">
        {gallery.map((entry, index) =>
          category === "All" || entry.category === category ? (
            <button
              className="gallery-item"
              key={entry.src}
              onClick={(event) => open(index, event)}
              aria-label={`Enlarge ${entry.title}`}
            >
              <span className="art">
                <Image
                  src={entry.src}
                  alt={entry.alt}
                  fill
                  sizes="(max-width: 700px) 100vw, 50vw"
                />
              </span>
              <span>
                <small>{entry.category}</small>
                <strong>{entry.title}</strong>
                <b aria-hidden="true">↗</b>
              </span>
            </button>
          ) : null,
        )}
      </div>
      <dialog
        ref={dialog}
        className="lightbox"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        aria-labelledby="lightbox-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            step(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
      >
        <div className="lightbox-content">
          <div className="lightbox-toolbar">
            <p id="lightbox-title">{item?.title ?? "Artwork"}</p>
            <button onClick={close} aria-label="Close artwork">
              Close ×
            </button>
          </div>
          {item && (
            <div className="lightbox-image">
              <Image src={item.src} alt={item.alt} fill sizes="95vw" />
            </div>
          )}
          <div className="lightbox-controls">
            <button onClick={() => step(-1)}>← Previous</button>
            <span aria-live="polite">
              {selected === null ? 0 : selected + 1} / {gallery.length}
            </span>
            <button onClick={() => step(1)}>Next →</button>
          </div>
        </div>
      </dialog>
    </>
  );
}
