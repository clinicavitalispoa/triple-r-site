'use client';

import { useEffect, useRef, useState } from 'react';

export default function CountUp({ to, duration = 1600, prefix = '', suffix = '', locale = 'pt-BR' }) {
  const ref = useRef(null);
  // render the final number on the server (crawlers, no-JS); animate from 0 only once visible
  const [value, setValue] = useState(to);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(entries => {
      if (!entries.some(e => e.isIntersecting)) return;
      io.disconnect();
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const start = performance.now();
      const step = now => {
        const t = Math.min(1, (now - start) / duration);
        setValue(Math.round(to * (1 - Math.pow(1 - t, 3))));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);
  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString(locale)}
      {suffix}
    </span>
  );
}
