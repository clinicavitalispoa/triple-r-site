'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

// "How it works" slider: each machine sits in a factory scene, contaminated oil flows in through
// a glass pipe (bubbles, particles or water droplets) and clean oil flows out. Pipes are drawn
// behind the product photo, so they look like they connect to it.
const VB_W = 1440;
const VB_H = 640;
const FLOOR = 556;
const IN_START = 600; // inlet pipe fades in to the right of the text column

const SLIDES = [
  {
    key: 'bu',
    eyebrow: 'Série BU · by-pass',
    title: 'Remove partículas, água e verniz do óleo',
    text: 'O óleo contaminado passa pelo elemento de 114 mm e volta limpo para o sistema, direto da linha de alta pressão, sem motor nem bomba.',
    cta: { label: 'Conheça a BU100E', href: '/produto/bu100e' },
    image: '/flow/bu100e.webp',
    size: [700, 1100],
    place: { x: 1010, h: 470 },
    inlet: [0.22, 0.705],
    outlet: [0.8, 0.705],
    route: 'right',
    dirty: 'particles'
  },
  {
    key: 'trvs',
    eyebrow: 'Desidratador a vácuo TRVS',
    title: 'Tira a água do óleo, até a dissolvida',
    text: 'O óleo é pulverizado numa câmara a vácuo: a umidade evapora e sai pela bomba de vácuo. Remove 100% da água livre e 80% da dissolvida.',
    cta: { label: 'Conheça o TRVS-30E', href: '/produto/trvs-30e' },
    image: '/flow/trvs-30e.webp',
    size: [410, 565],
    place: { x: 1040, h: 470 },
    inlet: [0.075, 0.635],
    outlet: [0.275, 0.645],
    route: 'down-right',
    dirty: 'water'
  },
  {
    key: 'quick',
    eyebrow: 'Desareador Quicktron',
    title: 'Elimina as bolhas de ar do óleo',
    text: 'O fluxo em espiral separa o ar do óleo em injetoras e sistemas hidráulicos: menos cavitação, menos ruído e menos oxidação.',
    cta: { label: 'Conheça o Quicktron', href: '/solucoes/desareador-quicktron' },
    image: '/flow/quicktron.webp',
    size: [369, 772],
    place: { x: 1060, h: 480 },
    inlet: [0.08, 0.3],
    outlet: [0.5, 0.96],
    route: 'down-right',
    dirty: 'bubbles'
  }
];

const layout = s => {
  const h = s.place.h;
  const w = (s.size[0] / s.size[1]) * h;
  const x = s.place.x - w / 2;
  const y = FLOOR - h;
  const pt = ([fx, fy]) => [x + fx * w, y + fy * h];
  const [ix, iy] = pt(s.inlet);
  const [ox, oy] = pt(s.outlet);
  const inPath = `M ${IN_START} ${iy} H ${ix}`;
  const floorY = FLOOR + 22;
  const outPath =
    s.route === 'right'
      ? `M ${ox} ${oy} H ${VB_W + 40}`
      : `M ${ox} ${oy} V ${floorY - 26} Q ${ox} ${floorY} ${ox + 26} ${floorY} H ${VB_W + 40}`;
  return { x, y, w, h, inPath, outPath, inLen: ix - IN_START, inStart: IN_START, inEnd: ix, outLen: VB_W + 40 - ox + (s.route === 'right' ? 0 : floorY - oy) };
};

function Pipe({ id, d, oil, glow, len }) {
  return (
    <g className="flow-pipe" style={{ '--len': len }}>
      <path d={d} className="flow-pipe__glass" />
      <path d={d} className="flow-pipe__oil" stroke={`url(#${id}-oil)`} />
      <path d={d} className="flow-pipe__streak" stroke={glow}>
        <animate attributeName="stroke-dashoffset" from="0" to="-220" dur="1.4s" repeatCount="indefinite" />
      </path>
      <path d={d} className="flow-pipe__shine" />
    </g>
  );
}

function Contaminants({ kind, d, len }) {
  const n = Math.max(8, Math.round(len / 30));
  const dur = Math.max(2.2, len / 200);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const r = kind === 'bubbles' ? 2.6 + ((i * 7) % 5) * 0.9 : kind === 'water' ? 3 + ((i * 5) % 4) : 1.8 + ((i * 3) % 3) * 0.9;
        const dy = (((i * 37) % 11) - 5) * 1.1;
        const fill = kind === 'bubbles' ? 'rgba(255,255,255,0.85)' : kind === 'water' ? 'rgba(160,215,255,0.95)' : 'rgba(40,24,6,0.9)';
        const stroke = kind === 'bubbles' ? 'rgba(160,110,0,0.6)' : kind === 'water' ? 'rgba(255,255,255,0.9)' : 'none';
        return (
          <g key={i} transform={`translate(0 ${dy})`}>
            {kind === 'particles' && i % 3 === 0 ? (
              <rect x={-r} y={-r} width={r * 2} height={r * 1.4} fill={fill} transform={`rotate(${i * 40})`}>
                <animateMotion dur={`${dur}s`} begin={`${-(i / n) * dur}s`} repeatCount="indefinite" path={d} />
              </rect>
            ) : (
              <circle r={r} fill={fill} stroke={stroke} strokeWidth="1">
                <animateMotion dur={`${dur}s`} begin={`${-(i / n) * dur}s`} repeatCount="indefinite" path={d} />
              </circle>
            )}
          </g>
        );
      })}
    </g>
  );
}

function Scene({ s, active }) {
  const L = layout(s);
  const dirtyOil = s.dirty === 'particles' ? ['#5a3b0b', '#8a5a12'] : s.dirty === 'water' ? ['#b9922c', '#d8b860'] : ['#c79410', '#e6b422'];
  return (
    <g className={`flow-scene${active ? ' is-active' : ''}`} aria-hidden={!active}>
      <defs>
        <linearGradient id={`${s.key}-in-oil`} gradientUnits="userSpaceOnUse" x1={L.inStart} x2={L.inEnd} y1="0" y2="0">
          <stop offset="0" stopColor={dirtyOil[0]} stopOpacity="0" />
          <stop offset="0.25" stopColor={dirtyOil[0]} />
          <stop offset="1" stopColor={dirtyOil[1]} />
        </linearGradient>
        <linearGradient id={`${s.key}-out-oil`} gradientUnits="userSpaceOnUse" x1={L.x} x2={VB_W} y1="0" y2="0">
          <stop offset="0" stopColor="#f2b705" />
          <stop offset="0.9" stopColor="#ffcc1a" />
          <stop offset="1" stopColor="#ffcc1a" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <ellipse cx={s.place.x} cy={FLOOR + 4} rx={L.w * 0.55} ry="16" fill="rgba(4,0,47,0.18)" filter="url(#flow-blur)" />
      <mask id={`${s.key}-infade`} maskUnits="userSpaceOnUse" x="0" y="0" width={VB_W} height={VB_H}>
        <rect x="0" y="0" width={VB_W} height={VB_H} fill={`url(#${s.key}-fadegrad)`} />
      </mask>
      <linearGradient id={`${s.key}-fadegrad`} gradientUnits="userSpaceOnUse" x1={L.inStart} x2={L.inStart + 140} y1="0" y2="0">
        <stop offset="0" stopColor="#000" />
        <stop offset="1" stopColor="#fff" />
      </linearGradient>
      <g mask={`url(#${s.key}-infade)`}>
        <Pipe id={`${s.key}-in`} d={L.inPath} glow="rgba(255,240,200,0.55)" len={L.inLen} />
        <g clipPath={`url(#${s.key}-inclip)`}>
          <Contaminants kind={s.dirty} d={L.inPath} len={L.inLen} />
        </g>
      </g>
      <Pipe id={`${s.key}-out`} d={L.outPath} glow="rgba(255,255,255,0.8)" len={L.outLen} />
      <clipPath id={`${s.key}-inclip`}>
        <rect x="0" y="0" width={L.x + L.w * s.inlet[0]} height={VB_H} />
      </clipPath>
      <image className="flow-product" href={s.image} x={L.x} y={L.y} width={L.w} height={L.h} preserveAspectRatio="xMidYMid meet" />
    </g>
  );
}

export default function FlowSlider({ interval = 7000 }) {
  const [index, setIndex] = useState(0);
  const [sliderPaused, setSliderPaused] = useState(false);
  const [animPaused, setAnimPaused] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const svgRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener('change', on);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setAnimPaused(true);
      setSliderPaused(true);
    }
    return () => mq.removeEventListener('change', on);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg?.pauseAnimations) return;
    if (animPaused) svg.pauseAnimations();
    else svg.unpauseAnimations();
  }, [animPaused, index]);

  useEffect(() => {
    if (sliderPaused) return;
    const id = setTimeout(() => setIndex(i => (i + 1) % SLIDES.length), interval);
    return () => clearTimeout(id);
  }, [index, sliderPaused, interval]);

  const s = SLIDES[index];
  const go = d => setIndex(i => (i + d + SLIDES.length) % SLIDES.length);
  const viewBox = narrow ? `${s.place.x - 430} 40 860 ${VB_H - 20}` : `0 0 ${VB_W} ${VB_H}`;

  return (
    <section className={`flow${animPaused ? ' is-anim-paused' : ''}`} aria-roledescription="carrossel" aria-label="Como funcionam os purificadores Triple R">
      <div className="flow__bg" aria-hidden="true" />
      <svg ref={svgRef} className="flow__svg" viewBox={viewBox} preserveAspectRatio={narrow ? 'xMidYMax meet' : 'xMidYMid slice'} role="img" aria-label={s.title}>
        <defs>
          <filter id="flow-blur" x="-20%" y="-200%" width="140%" height="500%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>
        {SLIDES.map((x, i) => (
          <Scene key={x.key} s={x} active={i === index} />
        ))}
      </svg>
      <div className="container flow__inner">
        <div className="flow__copy" key={s.key} aria-live={sliderPaused ? 'polite' : 'off'}>
          <span className="flow__eyebrow">{s.eyebrow}</span>
          <h2>{s.title}</h2>
          <p>{s.text}</p>
          <Link className="btn flow__cta" href={s.cta.href}>
            {s.cta.label} <span aria-hidden="true">→</span>
          </Link>
          <button type="button" className="flow__pill" onClick={() => setAnimPaused(p => !p)} aria-pressed={animPaused}>
            {animPaused ? 'Retomar animação' : 'Pausar animação'}
          </button>
        </div>
      </div>
      <div className="container flow__controls">
        <button type="button" className="flow__arrow" aria-label="Anterior" onClick={() => go(-1)}>←</button>
        <div className="flow__dots">
          {SLIDES.map((x, i) => (
            <button key={x.key} type="button" aria-label={`Slide ${i + 1}: ${x.eyebrow}`} aria-current={i === index} onClick={() => setIndex(i)} />
          ))}
        </div>
        <button type="button" className="flow__arrow" aria-label="Próximo" onClick={() => go(1)}>→</button>
        <button type="button" className="flow__pill" onClick={() => setSliderPaused(p => !p)} aria-pressed={sliderPaused}>
          {sliderPaused ? 'Retomar slider' : 'Pausar slider'}
        </button>
      </div>
    </section>
  );
}
