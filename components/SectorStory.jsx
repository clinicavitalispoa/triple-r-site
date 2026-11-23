'use client';

import { useEffect, useRef, useState } from 'react';

// Scroll-telling: a sticky picture that "opens" and then zooms into each numbered point
// while the matching text scrolls by.
export default function SectorStory({ story, image }) {
  const [step, setStep] = useState(-1); // -1 = closed intro, 0..n-1 = points, n = outro
  const refs = useRef([]);
  const n = story.steps.length;

  useEffect(() => {
    const els = refs.current.filter(Boolean);
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setStep(Number(e.target.dataset.step));
        });
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const s = step >= 0 && step < n ? story.steps[step] : null;
  const zoom = s ? s.zoom : 1;
  // move the point to the centre of the stage, clamped so the picture always covers it
  const clamp = (v, z) => Math.max(0.5 / z, Math.min(1 - 0.5 / z, v));
  const cx = s ? clamp(s.x, zoom) : 0.5;
  const cy = s ? clamp(s.y, zoom) : 0.5;
  const tx = (0.5 - cx) * 100 * zoom;
  const ty = (0.5 - cy) * 100 * zoom;
  const open = step >= 0;

  const block = (i, content, extra = '') => (
    <div key={i} className={`story__step ${extra}${step === i ? ' is-active' : ''}`} data-step={i} ref={el => (refs.current[i + 1] = el)}>
      {content}
    </div>
  );

  return (
    <section className="story" aria-label={story.intro.title}>
      <div className="story__stage">
        <div className={`story__frame${open ? ' is-open' : ''}`} style={{ aspectRatio: story.ratio }}>
          <div className="story__pan" style={{ transform: `translate(${tx}%, ${ty}%) scale(${zoom})` }}>
            <img src={image} alt={story.intro.title} />
            {story.steps.map((p, i) => (
              <span key={i} className={`story__ping${step === i ? ' is-on' : ''}${step === n ? ' is-all' : ''}`} style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%`, '--z': zoom }} aria-hidden="true" />
            ))}
          </div>
          <div className="story__shutter story__shutter--l" aria-hidden="true" />
          <div className="story__shutter story__shutter--r" aria-hidden="true" />
          {s ? (
            <div className="story__badge" key={step}>
              <b>{s.n}</b> {s.title}
            </div>
          ) : null}
        </div>
        <ol className="story__progress" aria-hidden="true">
          {story.steps.map((p, i) => (
            <li key={i} className={step >= i ? 'is-done' : ''} />
          ))}
        </ol>
      </div>
      <div className="story__text">
        {block(
          -1,
          <>
            <span className="eyebrow">{story.intro.kicker}</span>
            <h2>{story.intro.title}</h2>
            <p className="lead">{story.intro.text}</p>
            <span className="story__hint">Role para abrir ↓</span>
          </>,
          'story__step--intro'
        )}
        {story.steps.map((p, i) =>
          block(
            i,
            <>
              <span className="story__num">{p.n}</span>
              <span className="story__tag">{p.tag}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
              <p className="story__fix">
                <b>Com Triple R:</b> {p.fix}
              </p>
            </>
          )
        )}
        {block(
          n,
          <>
            <span className="eyebrow">{story.outro.kicker}</span>
            <h2>{story.outro.title}</h2>
            <p className="lead">{story.outro.text}</p>
          </>,
          'story__step--outro'
        )}
      </div>
    </section>
  );
}
