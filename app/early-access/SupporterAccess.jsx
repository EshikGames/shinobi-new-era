"use client";
import { useEffect, useState } from "react";
import AccessStatus from "./AccessStatus";
import Countdown from "./Countdown";
export default function SupporterAccess({
  releases = [],
  availability = "ready",
}) {
  const [access, setAccess] = useState({
    status: "loading",
    loginEnabled: false,
    tiers: [],
  });
  const [downloading, setDownloading] = useState(null);
  const [notice, setNotice] = useState("");
  const [clock, setClock] = useState(null);
  useEffect(() => {
    const update = () => setClock(Date.now());
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/early-access/status", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const result = await response.json();
        if (!controller.signal.aborted)
          setAccess({
            status: result.status ?? "error",
            loginEnabled: result.loginEnabled === true,
            tiers: Array.isArray(result.tiers)
              ? result.tiers.filter((name) => typeof name === "string")
              : [],
            authRetry:
              new URLSearchParams(window.location.search).get("auth") ===
              "restart",
          });
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setAccess({ status: "error", loginEnabled: false, tiers: [] });
      });
    return () => controller.abort();
  }, []);
  async function download(releaseId) {
    if (downloading) return;
    setDownloading(releaseId);
    setNotice("");
    try {
      const response = await fetch("/api/early-access/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ releaseId }),
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) {
        if (result.error === "unauthorized" || result.error === "access_denied") {
          setAccess((current) => ({
            ...current,
            status: result.error === "unauthorized" ? "unauthorized" : "expired",
            tiers: [],
          }));
        }
        const errors = {
          unauthorized: "Your session has expired. Sign in again.",
          access_denied:
            "Your current subscription does not grant access to this build.",
          release_locked: "This build has not unlocked yet.",
          release_not_found: "This release is no longer available.",
          rate_limited: "Please wait before requesting another download.",
        };
        setNotice(
          errors[result.error] ??
            "Download verification is unavailable. Please try again later.",
        );
        return;
      }
      const url = new URL(result.url);
      if (
        url.origin !== "https://avdkvtmugeizoqqvayek.supabase.co" ||
        !url.pathname.startsWith("/storage/v1/object/sign/early-access-builds/")
      )
        throw new Error("Unexpected download origin");
      window.location.assign(url.href);
    } catch {
      setNotice(
        "The download could not be verified. No access was granted. Please try again later.",
      );
    } finally {
      setDownloading(null);
    }
  }
  async function logout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Logout failed");
      setAccess({ status: "unauthorized", loginEnabled: true, tiers: [] });
      setNotice("");
    } catch {
      setNotice("We could not finish signing out. Please try again.");
    }
  }
  return (
    <div className="supporter-access panel">
      <div className="supporter-pass">
        <div>
          <span className="eyebrow">PATREON / VERIFIED ACCESS</span>
          <AccessStatus status={access.status} />
          {access.status === "active" && (
            <p className="tier-name">
              {access.tiers.length
                ? access.tiers.join(" · ")
                : "Eligible Patreon supporter"}
            </p>
          )}
        </div>
        <div className="button-row">
          {access.loginEnabled && access.status === "unauthorized" && (
            <a className="button button-primary" href="/api/auth/patreon/start">
              Sign in with Patreon ↗
            </a>
          )}
          {access.loginEnabled &&
            ["active", "expired"].includes(access.status) && (
              <button
                className="button button-secondary"
                type="button"
                onClick={logout}
              >
                Sign out
              </button>
            )}
        </div>
      </div>
      {access.authRetry && access.status === "unauthorized" && (
        <p role="status" className="notice">
          This sign-in link has expired or was already used. Start a new Patreon
          sign-in.
        </p>
      )}
      {notice && (
        <p role="alert" className="notice">
          {notice}
        </p>
      )}
      <div className="private-release-list">
        {releases.length ? (
          releases.map((release) => {
            const locked =
              clock === null || Date.parse(release.early_access_at) > clock;
            return (
              <article className="private-release" key={release.id}>
                <div>
                  <span className="badge badge-gold">
                    {locked
                      ? "LOCKED UNTIL RELEASE"
                      : "PUBLISHED SUPPORTER BUILD"}
                  </span>
                  <h3>
                    {release.version}{" "}
                    <span> / {release.platforms.join(", ")}</span>
                  </h3>
                  <p>{release.description}</p>
                  <Countdown unlockAt={release.early_access_at} />
                </div>
                <button
                  className="button button-primary"
                  type="button"
                  disabled={
                    access.status !== "active" || locked || Boolean(downloading)
                  }
                  onClick={() => download(release.id)}
                >
                  {downloading === release.id
                    ? "Verifying download…"
                    : locked
                      ? "Not unlocked yet"
                      : `Download for ${release.platforms.join(", ")}`}
                </button>
              </article>
            );
          })
        ) : (
          <div className="empty-state">
            <span className="empty-mark" aria-hidden="true">
              ＋
            </span>
            <div>
              <h3>
                {availability === "error"
                  ? "Release information unavailable"
                  : "No early build listed yet."}
              </h3>
              <p>
                {availability === "error"
                  ? "We could not load the release list. Please try again later."
                  : "Your supporter status and release availability are separate. Protected Windows and Android downloads will appear when builds are published."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
