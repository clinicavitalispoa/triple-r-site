'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

// Coverflow carousel with a lenticular sheen: cards rotate in 3D as they move away from the
// centre, and a striped holographic layer shifts with each card's angle.
export default function SectorCarousel({ items, autoplay = 4500 }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(track.children).forEach((card, i) => {
      const mid = card.offsetLeft + card.offsetWidth / 2;
      const d = (mid - center) / card.offsetWidth; // -n..n
      const c = Math.max(-1.6, Math.min(1.6, d));
      card.style.setProperty('--d', c.toFixed(3));
      card.style.setProperty('--abs', Math.abs(c).toFixed(3));
      if (Math.abs(d) < bestDist) {
        bestDist = Math.abs(d);
        best = i;
      }
    });
    setActive(best);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [update]);

  const go = useCallback(i => {
    const track = trackRef.current;
    if (!track) return;
    const n = track.children.length;
    const idx = ((i % n) + n) % n;
    const card = track.children[idx];
    track.scrollTo({ left: card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!autoplay || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      if (!pausedRef.current && document.visibilityState === 'visible') go(active + 1);
    }, autoplay);
    return () => clearInterval(id);
  }, [active, autoplay, go]);

  // drag to scroll with the mouse
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let down = null;
    const onDown = e => {
      if (e.pointerType !== 'mouse') return;
      down = { x: e.clientX, left: track.scrollLeft, moved: false };
      track.classList.add('is-dragging');
    };
    const onMove = e => {
      if (!down) return;
      const dx = e.clientX - down.x;
      if (Math.abs(dx) > 4) down.moved = true;
      track.scrollLeft = down.left - dx;
    };
    const onUp = () => {
      if (!down) return;
      const moved = down.moved;
      down = null;
      track.classList.remove('is-dragging');
      if (moved) {
        const block = e => {
          e.preventDefault();
          e.stopPropagation();
        };
        track.addEventListener('click', block, { capture: true, once: true });
        setTimeout(() => track.removeEventListener('click', block, { capture: true }), 50);
      }
    };
    track.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      track.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  return (
    <div
      className="lenti"
      onPointerEnter={() => (pausedRef.current = true)}
      onPointerLeave={() => (pausedRef.current = false)}
      onFocus={() => (pausedRef.current = true)}
      onBlur={() => (pausedRef.current = false)}
    >
      <div className="lenti__track" ref={trackRef}>
        {items.map((it, i) => (
          <Link key={it.href} href={it.href} className={`lenti__card${i === active ? ' is-active' : ''}`} draggable={false}>
            <span className="lenti__img" style={{ backgroundImage: `url(${it.image})` }} />
            <span className="lenti__sheen" aria-hidden="true" />
            <span className="lenti__shade" aria-hidden="true" />
            <span className="lenti__body">
              <span className="lenti__num">{String(i + 1).padStart(2, '0')}</span>
              <b>{it.title}</b>
              <span className="lenti__text">{it.text}</span>
              <span className="lenti__cta">Conheça →</span>
            </span>
          </Link>
        ))}
      </div>
      <div className="lenti__nav">
        <button type="button" aria-label="Setor anterior" onClick={() => go(active - 1)}>←</button>
        <div className="lenti__dots">
          {items.map((it, i) => (
            <button key={it.href} type="button" aria-label={`Ir para ${it.title}`} aria-current={i === active} onClick={() => go(i)} />
          ))}
        </div>
        <button type="button" aria-label="Próximo setor" onClick={() => go(active + 1)}>→</button>
      </div>
    </div>
  );
}
