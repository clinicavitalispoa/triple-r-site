'use client';

import { useEffect, useRef } from 'react';

// Scroll-driven timeline: the centre line fills as you scroll and each milestone
// pops in (dot, year, card) when the line reaches it.
export default function Timeline({ items }) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nodes = Array.from(root.querySelectorAll('.tl2-item'));
    let raf = 0;
    const tick = () => {
      raf = 0;
      const r = root.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = reduce ? 1 : Math.max(0, Math.min(1, (vh * 0.62 - r.top) / r.height));
      root.style.setProperty('--p', progress.toFixed(4));
      const lineY = r.top + progress * r.height;
      nodes.forEach(n => {
        const nr = n.getBoundingClientRect();
        n.classList.toggle('is-on', reduce || nr.top + 24 <= lineY);
      });
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, []);

  return (
    <ol className="tl2" ref={ref}>
      <span className="tl2-line" aria-hidden="true">
        <span className="tl2-fill" />
      </span>
      {items.map((it, i) => (
        <li className={`tl2-item ${i % 2 ? 'is-right' : 'is-left'}`} key={it.year}>
          <span className="tl2-dot" aria-hidden="true" />
          <div className="tl2-card">
            {it.image ? <span className="tl2-img" style={{ backgroundImage: `url(${it.image})` }} /> : null}
            <span className="tl2-year">{it.year}</span>
            <p>{it.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
