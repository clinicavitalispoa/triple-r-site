'use client';

import { useEffect, useRef, useState } from 'react';

// Scroll-telling: a sticky picture that "opens" and zooms into each numbered point while the
// matching text scrolls by. Stories with several scenes cross-fade between pictures.
const clamp = (v, z) => Math.max(0.5 / z, Math.min(1 - 0.5 / z, v));

export default function SectorStory({ story, images }) {
  const [step, setStep] = useState(-1); // -1 = closed intro, 0..n-1 = steps, n = outro
  const refs = useRef([]);
  const n = story.steps.length;

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setStep(Number(e.target.dataset.step))),
      { rootMargin: '-45% 0px -45% 0px' }
    );
    refs.current.filter(Boolean).forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const cur = step >= 0 && step < n ? story.steps[step] : null;
  const scene = cur ? cur.scene : step >= n ? story.steps[n - 1].scene : 0;
  const zoomed = cur && !cur.overview;
  const zoom = zoomed ? cur.zoom : 1;
  const tx = zoomed ? (0.5 - clamp(cur.x, zoom)) * 100 * zoom : 0;
  const ty = zoomed ? (0.5 - clamp(cur.y, zoom)) * 100 * zoom : 0;
  const ratio = story.scenes[scene].ratio;
  const showAll = !cur || cur.overview || step >= n;

  const block = (i, content, extra = '') => (
    <div key={i} className={`story__step ${extra}${step === i ? ' is-active' : ''}`} data-step={i} ref={el => (refs.current[i + 1] = el)}>
      {content}
    </div>
  );

  return (
    <section className="story" aria-label={story.intro.title}>
      <div className="story__stage">
        <div className={`story__frame${step >= 0 ? ' is-open' : ''}`} style={{ aspectRatio: ratio }}>
          {story.scenes.map((sc, si) => (
            <div key={si} className={`story__scene${si === scene ? ' is-on' : ''}`} aria-hidden={si !== scene}>
              <div className="story__pan" style={si === scene ? { transform: `translate(${tx}%, ${ty}%) scale(${zoom})` } : undefined}>
                <img src={images[si]} alt={sc.label} loading={si === 0 ? 'eager' : 'lazy'} />
                {sc.points.map(([x, y], pi) => {
                  const on = si === scene && (showAll ? step >= 0 : cur && cur.x === x && cur.y === y);
                  return <span key={pi} className={`story__ping${on ? ' is-on' : ''}`} style={{ left: `${x * 100}%`, top: `${y * 100}%` }} aria-hidden="true" />;
                })}
              </div>
            </div>
          ))}
          <div className="story__shutter story__shutter--l" aria-hidden="true" />
          <div className="story__shutter story__shutter--r" aria-hidden="true" />
          {step >= 0 ? (
            <div className="story__badge" key={`${scene}-${step}`}>
              {zoomed ? <b>{cur.n}</b> : null}
              {zoomed ? cur.title : story.scenes[scene].label}
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
            p.overview ? (
              <>
                <span className="story__scene-label">{story.scenes[p.scene].label}</span>
                <h3>{p.title}</h3>
                <p style={{ margin: 0 }}>{p.text}</p>
              </>
            ) : (
              <>
                <span className="story__num">{p.n}</span>
                <span className="story__tag">{p.tag}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <p className="story__fix">
                  <b>Com Triple R:</b> {p.fix}
                </p>
              </>
            ),
            p.overview ? 'story__step--overview' : ''
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
