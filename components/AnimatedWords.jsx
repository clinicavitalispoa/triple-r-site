'use client';

import { useEffect, useRef, useState } from 'react';

// Word-by-word blur-in. The words are the real text (no screen-reader copy), so crawlers and
// text readers see the heading once.
export default function AnimatedWords({ text, as: Tag = 'span', className = '', delay = 90, start = 0, onView = false }) {
  const ref = useRef(null);
  const [on, setOn] = useState(!onView);
  useEffect(() => {
    if (!onView) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        setOn(true);
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [onView]);
  const words = text.split(' ');
  return (
    <Tag ref={ref} className={`aw${on ? ' is-on' : ''} ${className}`}>
      {words.map((w, i) => (
        <span key={i} className="aw__w" style={{ animationDelay: `${start + i * delay}ms` }}>
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
