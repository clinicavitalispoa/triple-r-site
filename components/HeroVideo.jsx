'use client';

import { useEffect, useRef, useState } from 'react';

// Muted looping background video for the home hero. Lighter file on small screens, poster only
// for visitors who prefer reduced motion, paused while off screen.
export default function HeroVideo() {
  const ref = useRef(null);
  const [src, setSrc] = useState(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setSrc(window.matchMedia('(max-width: 760px)').matches ? '/video/hero-720.mp4' : '/video/hero.mp4');
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v || !src) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()));
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  return (
    <video ref={ref} className="hero-video" src={src || undefined} poster="/video/hero-poster.jpg" muted loop playsInline autoPlay preload="metadata" aria-hidden="true" tabIndex={-1} />
  );
}
