"use client";

import { useEffect, useState } from "react";
import AccessStatus from "./AccessStatus";

export default function SupporterAccess({ releaseId = null }) {
  const [access, setAccess] = useState({ status: "loading", loginEnabled: false });
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/early-access/status", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const result = await response.json();
        setAccess({
          status: result.status ?? "error", loginEnabled: result.loginEnabled === true,
          authRetry: new URLSearchParams(window.location.search).get("auth") === "restart",
        });
      })
      .catch(() => { if (!controller.signal.aborted) setAccess({ status: "error", loginEnabled: false }); });
    return () => controller.abort();
  }, []);

  async function download() {
    if (!releaseId || downloading) return;
    setDownloading(true);
    try {
      const response = await fetch("/api/early-access/download", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ releaseId }), cache: "no-store",
      });
      if (!response.ok) throw new Error("Download denied");
      const result = await response.json();
      if (typeof result.url !== "string") throw new Error("Invalid download response");
      window.location.assign(result.url);
    } catch {
      setAccess({ status: "error", loginEnabled: true });
    } finally {
      setDownloading(false);
    }
  }

  async function logout() {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST", cache: "no-store" });
      if (!response.ok) throw new Error("Logout failed");
      setAccess({ status: "unauthorized", loginEnabled: true });
    } catch {
      setAccess({ status: "error", loginEnabled: true });
    }
  }

  return <div className="ea-access">
    <AccessStatus status={access.status} />
    {access.loginEnabled && access.status === "unauthorized" && access.authRetry &&
      <p role="status">This sign-in link has expired or was already used. Please start a new Patreon sign-in.</p>}
    {access.loginEnabled && access.status === "unauthorized" &&
      <a className="ea-button ea-button--red" href="/api/auth/patreon/start">Sign in with Patreon</a>}
    {access.loginEnabled && ["active", "expired"].includes(access.status) &&
      <button className="ea-button ea-button--outline" type="button" onClick={logout}>Sign out</button>}
    {access.status === "active" && releaseId &&
      <button className="ea-button ea-button--red" type="button" disabled={downloading} onClick={download}>
        {downloading ? "Checking download…" : "Get early build"}
      </button>}
  </div>;
}
