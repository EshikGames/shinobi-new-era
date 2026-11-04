import Link from "next/link";
import Countdown from "@/app/early-access/Countdown";
export function ReleaseDate({ value, fallback = "Date not announced" }) {
  return value && Number.isFinite(Date.parse(value)) ? (
    <time dateTime={value}>
      {new Intl.DateTimeFormat("en", {
        dateStyle: "long",
        timeZone: "UTC",
      }).format(new Date(value))}
    </time>
  ) : (
    <span>{fallback}</span>
  );
}
export default function ReleaseBoard({ center, compact = false }) {
  return (
    <div className={`release-board ${compact ? "release-board-compact" : ""}`}>
      <article className="release-current panel">
        <div className="release-card-top">
          <span className="badge">
            <i />
            PUBLIC RELEASE
          </span>
          <span className="mono">01 / NOW</span>
        </div>
        <div className="release-version">
          {center.current?.version ?? "—"}
          <span>PUBLIC</span>
        </div>
        <h3>{center.current?.title ?? "No public release announced"}</h3>
        <p>
          {center.current?.description ?? "Confirmed details will appear here."}
        </p>
        <div className="release-card-footer">
          <ReleaseDate
            value={center.current?.public_release_at}
            fallback="Publication date not listed"
          />
          <Link href="/download#latest">Release details ↗</Link>
        </div>
      </article>
      <article className="release-next panel">
        <div className="release-card-top">
          <span className="badge badge-gold">ON THE HORIZON</span>
          <span className="mono">02 / NEXT</span>
        </div>
        <div className="release-version">
          {center.next?.version ?? "—"}
          <span>UPCOMING</span>
        </div>
        <h3>{center.next?.title ?? "Awaiting announcement"}</h3>
        <p>
          {center.next?.description ??
            "There is no confirmed next release yet."}
        </p>
        <Countdown unlockAt={center.next?.public_release_at} />
        <div className="release-card-footer">
          <ReleaseDate value={center.next?.public_release_at} />
          <Link href="/early-access">Early Access ↗</Link>
        </div>
      </article>
    </div>
  );
}
