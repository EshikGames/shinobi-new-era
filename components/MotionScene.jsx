"use client";
import { useEffect, useRef } from "react";
export default function MotionScene({ children }) {
  const root = useRef(null);
  useEffect(() => {
    const element = root.current;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const move = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        element?.style.setProperty(
          "--drift",
          `${Math.min(window.scrollY * 0.12, 80)}px`,
        );
        frame = 0;
      });
    };
    const update = () => {
      window.removeEventListener("scroll", move);
      if (!media.matches && window.innerWidth > 800)
        window.addEventListener("scroll", move, { passive: true });
      else element?.style.setProperty("--drift", "0px");
    };
    update();
    media.addEventListener("change", update);
    window.addEventListener("resize", update);
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.06 },
    );
    element
      ?.querySelectorAll("[data-reveal]")
      .forEach((node) => observer.observe(node));
    return () => {
      window.removeEventListener("scroll", move);
      window.removeEventListener("resize", update);
      media.removeEventListener("change", update);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div ref={root} className="motion-scene">
      {children}
    </div>
  );
}
