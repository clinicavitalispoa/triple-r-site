import Link from 'next/link';

export default function PageHero({ eyebrow, title, text, crumbs = [], children }) {
  return (
    <section className="page-hero">
      <div className="hero-r" aria-hidden="true" />
      <div className="container page-hero__inner">
        {crumbs.length ? (
          <nav className="crumbs" aria-label="Você está em">
            <Link href="/">Home</Link>
            {crumbs.map(c => (
              <span key={c.label}>
                <span aria-hidden="true">/</span> {c.href ? <Link href={c.href}>{c.label}</Link> : c.label}
              </span>
            ))}
          </nav>
        ) : null}
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h1>{title}</h1>
        {text ? <p className="lead">{text}</p> : null}
        {children}
      </div>
    </section>
  );
}
