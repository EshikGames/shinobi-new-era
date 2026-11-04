"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { browserEdition } from "@/lib/game-info.mjs";
import Icon from "@/components/Icon";
import "./play.css";
export default function Play() {
  const [state, setState] = useState("checking");
  const [notice, setNotice] = useState("");
  const player = useRef(null);
  const stage = useRef(null);
  const help = useRef(null);
  const request = useRef(null);
  const GAME_URL = "/game/index.html";
  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => {
    const element = stage.current;
    const resize = () => element.style.setProperty('--game-scale', String(Math.min(element.clientWidth / 1280, element.clientHeight / 720)));
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (state !== "loading") return;
    const timer = setTimeout(() => {
      setState("error");
      setNotice(
        "The game frame did not finish loading. Try again or use a downloadable build.",
      );
    }, 90000);
    return () => clearTimeout(timer);
  }, [state]);
  useEffect(() => {
    if (state !== "checking") return;
    const controller = new AbortController();
    request.current = controller;
    async function load() {
      try {
        const response = await fetch(GAME_URL, {
        method: "HEAD",
        cache: "no-store",
        signal: AbortSignal.any([
          controller.signal,
          AbortSignal.timeout(10000),
        ]),
      });
        if (!response.ok) throw new Error("Game unavailable");
        if (!controller.signal.aborted) setState("loading");
      } catch {
        if (!controller.signal.aborted) {
          setState("error");
          setNotice(
            "The browser build could not be reached. Please retry, or visit Downloads for an offline edition.",
          );
        }
      }
    }
    load();
    return () => controller.abort();
  }, [state]);
  function start() {
    setNotice("");
    setState("checking");
  }
  async function fullscreen() {
    try {
      if (!document.fullscreenElement)
        await player.current?.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      setNotice(
        "Fullscreen is not available in this browser. You can continue playing in the window.",
      );
    }
  }
  function stop() {
    if (
      !window.confirm(
        "Return to the launcher? Unsaved game progress may be lost.",
      )
    )
      return;
    request.current?.abort();
    setState("idle");
    setNotice("");
  }
  return (
    <>
      <section ref={player} className="play-screen" aria-labelledby="play-title">
        <h1 id="play-title" className="sr-only">Play Shinobi New Era online</h1>
        <div ref={stage} className="game-player">
          {["loading", "ready"].includes(state) && (
            <iframe
              id="game-frame"
              src={GAME_URL}
              title="Shinobi New Era browser game"
              allow="autoplay; fullscreen; gamepad; microphone"
              allowFullScreen
              onLoad={() => setState("ready")}
              onError={() => {
                setState("error");
                setNotice(
                  "The game frame could not load. Try the downloadable edition.",
                );
              }}
            />
          )}
          {state !== "ready" && (
            <div
              className={`game-launcher ${state === "loading" ? "game-loading" : ""}`}
            >
              <Image src="/images/hero.jpg" alt="" fill sizes="100vw" />
              <div className="launcher-copy">
                <p className="eyebrow">SHINOBI NEW ERA / WEB EDITION</p>
                <h2>
                  {state === "error"
                    ? "Let’s try that again."
                    : state === "checking" || state === "loading"
                      ? "Opening your world…"
                      : "Begin your legacy."}
                </h2>
                <p role="status">
                  {state === "error"
                    ? notice
                    : state === "loading"
                      ? "Loading the game frame. The game may continue preparing its assets after this screen."
                      : state === "checking"
                        ? "Checking the browser build…"
                        : "Your next chapter starts in Konoha."}
                </p>
                {["idle", "error"].includes(state) && (
                  <button className="button button-primary" onClick={start}>
                    {state === "error" ? "Retry loading" : "Launch game"}{" "}
                    <span aria-hidden="true">▶</span>
                  </button>
                )}
                {["checking", "loading"].includes(state) && (
                  <div className="loading-line" aria-hidden="true" />
                )}
              </div>
            </div>
          )}
        </div>
        <footer className="play-dock">
          <nav className="play-dock-support" aria-label="Support the game">
            <a href="https://subscribestar.adult/eshik-games" target="_blank" rel="noopener noreferrer" aria-label="SubscribeStar"><Icon name="subscribestar" /><span>SubscribeStar</span></a>
            <a href="https://www.patreon.com/cw/eshikgames" target="_blank" rel="noopener noreferrer" aria-label="Patreon"><Icon name="patreon" /><span>Patreon</span></a>
            <a href="https://boosty.to/eshikgames" target="_blank" rel="noopener noreferrer" aria-label="Boosty"><Icon name="boosty" /><span>Boosty</span></a>
          </nav>
          <nav className="play-dock-nav" aria-label="Game navigation"><Link href="/">Home</Link><span aria-current="page">Play</span><Link href="/download">Guide & Downloads</Link><Link href="/blog">Blog</Link></nav>
          <div className="play-dock-tools">
            <button type="button" onClick={() => help.current?.showModal()} aria-haspopup="dialog">Help & sound</button>
            <a href="https://eshik-games.itch.io/shinobi-new-era" target="_blank" rel="noopener noreferrer" aria-label="Shinobi New Era on itch.io"><Icon name="itchio" /><span>itch.io</span></a>
            <button type="button" onClick={fullscreen} aria-label="Toggle fullscreen"><span aria-hidden="true">⛶</span><span>Fullscreen</span></button>
          </div>
        </footer>
        {notice && state === "ready" && (
          <p role="status" className="play-toast">
            {notice}
          </p>
        )}
        <dialog className="play-help-dialog" ref={help} aria-labelledby="play-help-title">
          <div className="play-help-heading"><h2 id="play-help-title">Playing in your browser</h2><button type="button" onClick={() => help.current?.close()} aria-label="Close help">×</button></div>
          <p>Browser archive · v{browserEdition.version}. This is the older web edition, separate from the current public Beta.</p>
          <h3>Sound</h3><p>Click or tap inside the game to allow audio. Use the game’s Settings menu to adjust music and sound volume.</p>
          <h3>Loading & saves</h3><p>The first load can take a moment. Save using the game’s own menu, and keep a backup before clearing browser data.</p>
          <div className="play-help-actions"><Link href="/download">Get the current version ↗</Link><a href="https://discord.gg/HpGgzDgycE" target="_blank" rel="noopener noreferrer">Report an issue ↗</a>{state === 'ready' && <button type="button" onClick={() => { help.current?.close(); stop(); }}>Close game</button>}</div>
        </dialog>
      </section>
    </>
  );
}
