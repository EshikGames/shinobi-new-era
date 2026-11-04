import Image from "next/image";
import Link from "next/link";
export function Button({ href, children, secondary = false, ...props }) {
  return (
    <Link
      href={href}
      className={`button ${secondary ? "button-secondary" : "button-primary"}`}
      {...props}
    >
      {children}
      <span aria-hidden="true">↗</span>
    </Link>
  );
}
export function SectionTitle({
  kicker,
  title,
  children,
  href,
  linkLabel = "Explore",
}) {
  return (
    <div className="section-heading">
      <div>
        {kicker && <p className="eyebrow">{kicker}</p>}
        <h2>{title}</h2>
        {children && <p className="section-intro">{children}</p>}
      </div>
      {href && (
        <Link className="text-link" href={href}>
          {linkLabel} <span aria-hidden="true">↗</span>
        </Link>
      )}
    </div>
  );
}
export function PageIntro({ kicker, title, children }) {
  return (
    <header className="page-intro shell">
      <div>
        {kicker && <p className="eyebrow">{kicker}</p>}
        <h1>{title}</h1>
        {children && <p>{children}</p>}
      </div>
    </header>
  );
}
export function Art({
  src,
  alt,
  className = "",
  sizes = "(max-width: 700px) 100vw, 50vw",
  eager = false,
}) {
  return (
    <div className={`art ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
      />
    </div>
  );
}
export function EmptyState({ title, children }) {
  return (
    <div className="empty-state">
      <span className="empty-mark" aria-hidden="true">
        ＋
      </span>
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </div>
  );
}
export function FaqList({ items }) {
  return (
    <div className="faq-list">
      {items.map((item, index) => (
        <details key={item.question}>
          <summary>
            <span className="faq-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            {item.question}
            <span className="faq-plus" aria-hidden="true">
              ＋
            </span>
          </summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
