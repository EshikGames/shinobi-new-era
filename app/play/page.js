"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PageIntro } from "@/components/Ui";
export default function Play() {
  const [state, setState] = useState("idle");
  const [notice, setNotice] = useState("");
  const player = useRef(null);
  const request = useRef(null);
  const GAME_URL = "/game/index.html";
  useEffect(() => () => request.current?.abort(), []);
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
  async function start() {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setNotice("");
    setState("checking");
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
      setState("loading");
    } catch {
      if (!controller.signal.aborted) {
        setState("error");
        setNotice(
          "The browser build could not be reached. Please retry, or visit Downloads for an offline edition.",
        );
      }
    }
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
      <PageIntro
        kicker="PLAY ONLINE"
        title={
          <>
            The world is
            <br />
            <em>one click away.</em>
          </>
        }
        number="PLAY"
      >
        Launch the existing browser edition. Give the game a moment to load,
        then make yourself at home.
      </PageIntro>
      <section className="shell section play-section">
        <div ref={player} className="game-player">
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
        <div className="player-toolbar">
          <span className="mono">
            {state === "ready" ? "GAME FRAME CONNECTED" : "BROWSER EDITION"}
          </span>
          <div>
            {state === "ready" && (
              <>
                <button onClick={fullscreen}>Fullscreen ↗</button>
                <button onClick={stop}>Return to launcher</button>
              </>
            )}
            <Link href="/download">Download ↗</Link>
            <Link href="/early-access">Support ↗</Link>
          </div>
        </div>
        {notice && state === "ready" && (
          <p role="status" className="notice">
            {notice}
          </p>
        )}
        <div className="guide-grid section">
          <article className="panel guide-card">
            <h3>Take your time.</h3>
            <p>
              The game’s own loading screen can continue after the frame
              connects. Download time depends on your connection.
            </p>
          </article>
          <article className="panel guide-card">
            <h3>Keep your progress.</h3>
            <p>
              Use the game’s save system. Browser data may contain saves; avoid
              clearing site data without a backup.
            </p>
          </article>
          <article className="panel guide-card">
            <h3>Find your platform.</h3>
            <p>
              A downloadable edition can be a better fit for your device. Check
              the Release Center for version-labelled links.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
