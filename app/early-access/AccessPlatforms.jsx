"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import SupporterAccess from "./SupporterAccess";
import SupporterListAccess from "./SupporterListAccess";

const platforms = [
  { id: "patreon", name: "Patreon" },
  { id: "subscribestar", name: "SubscribeStar" },
  { id: "boosty", name: "Boosty" },
];

export default function AccessPlatforms({ releases, availability }) {
  const [provider, setProvider] = useState("patreon");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const followAnchor = () => {
      if (["#manual-access-title", "#boosty-access"].includes(window.location.hash)) setProvider("boosty");
      if (window.location.hash === "#subscribestar-access") setProvider("subscribestar");
      if (["#supporters", "#patreon-access"].includes(window.location.hash)) setProvider("patreon");
    };
    const frame = requestAnimationFrame(followAnchor);
    window.addEventListener("hashchange", followAnchor);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("hashchange", followAnchor); };
  }, []);

  return <section className="ea-entry" id="supporters" aria-labelledby="ea-signin-title">
    <span id="patreon-access" className="ea-anchor" />
    <span id="manual-access-title" className="ea-anchor" />
    <span id="boosty-access" className="ea-anchor" />
    <span id="subscribestar-access" className="ea-anchor" />
    <div className="ea-entry-heading"><p className="eyebrow">ALREADY A SUPPORTER?</p><h2 id="ea-signin-title">Your next chapter starts here.</h2><p>Choose your platform to check your access.</p></div>
    <div className="ea-platform-switch" role="group" aria-label="Choose your supporter platform">
      {platforms.map(item => <button key={item.id} type="button" aria-pressed={provider === item.id} aria-controls={item.id === "patreon" ? "ea-patreon-panel" : "ea-email-panel"} disabled={busy} onClick={() => { setProvider(item.id); window.history.replaceState(window.history.state, "", `#${item.id}-access`); }}><Icon name={item.id} /><span>{item.name}</span></button>)}
    </div>
    <div id="ea-patreon-panel" hidden={provider !== "patreon"}><SupporterAccess releases={releases} availability={availability} /></div>
    <div id="ea-email-panel" hidden={provider === "patreon"}>
      {provider !== "patreon" && <SupporterListAccess key={provider} releases={releases} selectedProvider={provider} onBusyChange={setBusy} compact />}
    </div>
    <Link className="ea-free-link" href="/download">Just looking for the free version? Download it here →</Link>
  </section>;
}
