"use client";

import { useEffect, useRef, useState } from "react";

// Fixed values keep the server and browser markup identical.
const sparks = Array.from({ length: 18 }, (_, index) => ({
  left: `${(index * 37 + 9) % 100}%`,
  top: `${(index * 23 + 11) % 95}%`,
  "--spark-size": `${2 + (index % 3)}px`,
  "--spark-duration": `${15 + (index % 7) * 2}s`,
  "--spark-delay": `${-index * 2.7}s`,
  "--spark-drift": `${index % 2 ? -36 : 44}px`,
}));

export function HeroAtmosphere() {
  return (
    <div className="home-atmosphere" aria-hidden="true">
      <div className="home-pointer-glow" />
      {sparks.map((style, index) => <i className="home-spark" key={index} style={style} />)}
    </div>
  );
}

export default function HomeMotion({ children }) {
  const root = useRef(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const element = root.current;
    const hero = element.querySelector(".cinema-hero");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(min-width: 800px) and (hover: hover) and (pointer: fine)");
    let observer;
    let frame = 0;
    let x = 0;
    let y = 0;
    let sceneX = 0;
    let sceneY = 0;

    function resetPointer() {
      cancelAnimationFrame(frame);
      frame = 0;
      hero.style.removeProperty("--glow-opacity");
      hero.style.removeProperty("--scene-x");
      hero.style.removeProperty("--scene-y");
    }
    function move(event) {
      if (paused || reduced.matches || !pointer.matches) return;
      const bounds = hero.getBoundingClientRect();
      x = event.clientX - bounds.left;
      y = event.clientY - bounds.top;
      sceneX = Math.max(-1, Math.min(1, (x / bounds.width - .5) * 2)) * 14;
      sceneY = Math.max(-1, Math.min(1, (y / Math.min(bounds.height, window.innerHeight) - .5) * 2)) * 9;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        hero.style.setProperty("--glow-x", `${x}px`);
        hero.style.setProperty("--glow-y", `${y}px`);
        hero.style.setProperty("--glow-opacity", "1");
        hero.style.setProperty("--scene-x", `${sceneX.toFixed(2)}px`);
        hero.style.setProperty("--scene-y", `${sceneY.toFixed(2)}px`);
        frame = 0;
      });
    }
    function configure() {
      observer?.disconnect();
      resetPointer();
      element.querySelectorAll(".home-reveal-pending").forEach(node => node.classList.remove("home-reveal-pending"));
      if (paused || reduced.matches || !("IntersectionObserver" in window)) return;
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove("home-reveal-pending");
          observer.unobserve(entry.target);
        });
      }, { threshold: 0, rootMargin: "0px 0px -30px 0px" });
      element.querySelectorAll("[data-home-reveal]").forEach(node => {
        if (node.getBoundingClientRect().top < window.innerHeight) return;
        node.classList.add("home-reveal-pending");
        observer.observe(node);
      });
    }
    function visibility() {
      element.dataset.motionIdle = document.hidden ? "true" : "false";
      if (document.hidden) resetPointer();
    }
    configure();
    visibility();
    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", resetPointer);
    reduced.addEventListener("change", configure);
    pointer.addEventListener("change", configure);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer?.disconnect();
      resetPointer();
      element.querySelectorAll(".home-reveal-pending").forEach(node => node.classList.remove("home-reveal-pending"));
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", resetPointer);
      reduced.removeEventListener("change", configure);
      pointer.removeEventListener("change", configure);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [paused]);

  return (
    <div ref={root} className="cinema-home home-motion" data-motion-paused={paused}>
      <button className="home-motion-toggle" type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>
        <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>{paused ? "Resume animation" : "Pause animation"}
      </button>
      {children}
    </div>
  );
}
