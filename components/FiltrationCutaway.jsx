'use client';

import { useEffect, useState } from 'react';

// Animated cut-away of a Triple R purifier: dirty oil rises through the centre tube, spreads over
// the element and seeps down through 114 mm of cellulose. Each contaminant is caught at its own
// depth; the selected item on the right highlights its layer.
const ITEMS = [
  {
    id: 'solid',
    title: 'Partículas sólidas',
    text: 'O fluxo axial cria um caminho longo pelo elemento: partículas grandes ficam no topo e as menores, de até 1 mícron, na parte inferior comprimida.'
  },
  {
    id: 'water',
    title: 'Água',
    text: 'A celulose especial absorve as gotas de água e deixa o óleo com menos de 100 ppm, protegendo os aditivos contra a oxidação.'
  },
  {
    id: 'oxid',
    title: 'Borra e verniz',
    text: 'Os resíduos de oxidação ficam presos na massa filtrante antes de virar verniz em válvulas, trocadores de calor e filtros.'
  }
];

// deterministic pseudo-random so server and client render the same SVG
const rnd = seed => {
  let s = seed;
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
};

function Contaminants({ kind, count, color, r, stopMin, stopMax, seed }) {
  const R = rnd(seed);
  return (
    <g className={`fc-${kind}`}>
      {Array.from({ length: count }, (_, i) => {
        const side = i % 2 ? 1 : -1;
        const x = 200 + side * (30 + R() * 90);
        const stop = stopMin + R() * (stopMax - stopMin);
        const dur = 3.2 + R() * 2.2;
        const begin = -(R() * dur);
        const size = r * (0.6 + R() * 0.8);
        return (
          <circle key={i} cx={x} cy="186" r={size} fill={color}>
            <animate attributeName="cy" values={`186;${stop};${stop};186`} keyTimes="0;0.55;0.92;1" dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.9;1" dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
          </circle>
        );
      })}
    </g>
  );
}

export default function FiltrationCutaway() {
  const [focus, setFocus] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setFocus(f => (f + 1) % ITEMS.length), 4200);
    return () => clearInterval(id);
  }, [auto]);

  const pick = i => {
    setAuto(false);
    setFocus(i);
  };

  return (
    <div className="fc" data-focus={ITEMS[focus].id}>
      <div className="fc__art">
        <svg viewBox="0 0 430 540" role="img" aria-label="Corte do purificador Triple R mostrando o óleo atravessando o elemento filtrante">
          <defs>
            <linearGradient id="fc-metal" x1="0" x2="1">
              <stop offset="0" stopColor="#7f8792" />
              <stop offset="0.35" stopColor="#e9edf2" />
              <stop offset="0.6" stopColor="#b8bec6" />
              <stop offset="1" stopColor="#6d747e" />
            </linearGradient>
            <linearGradient id="fc-metal-v" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f1f4f7" />
              <stop offset="1" stopColor="#9aa2ac" />
            </linearGradient>
            <linearGradient id="fc-oil-in" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#5a3a0c" />
              <stop offset="1" stopColor="#9c6a14" />
            </linearGradient>
            <linearGradient id="fc-depth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#8a5a12" stopOpacity="0.55" />
              <stop offset="0.6" stopColor="#d9a21c" stopOpacity="0.35" />
              <stop offset="1" stopColor="#ffd24a" stopOpacity="0.55" />
            </linearGradient>
            <pattern id="fc-rrr" width="64" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(-6)">
              <rect width="64" height="26" fill="#fbfbf8" />
              <text x="2" y="18" fontFamily="Arial, sans-serif" fontWeight="700" fontStyle="italic" fontSize="15" fill="#0086d1" opacity="0.28">RRR</text>
            </pattern>
            <clipPath id="fc-element">
              <rect x="70" y="180" width="110" height="220" rx="4" />
              <rect x="220" y="180" width="110" height="220" rx="4" />
            </clipPath>
            <filter id="fc-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* T-handle and lid */}
          <rect x="70" y="36" width="260" height="12" rx="6" fill="url(#fc-metal-v)" />
          <rect x="188" y="42" width="24" height="70" fill="url(#fc-metal)" />
          <rect x="178" y="64" width="44" height="18" rx="3" fill="url(#fc-metal)" />
          <path d="M40 150 L80 112 H320 L360 150 Z" fill="url(#fc-metal-v)" />
          <rect x="34" y="148" width="332" height="14" rx="4" fill="url(#fc-metal)" />

          {/* housing (cut open) */}
          <path d="M50 162 H66 V430 H50 Z M334 162 H350 V430 H334 Z" fill="url(#fc-metal)" />
          <rect x="50" y="424" width="300" height="22" rx="6" fill="url(#fc-metal)" />
          <rect x="66" y="162" width="268" height="262" fill="#10131d" opacity="0.9" />

          {/* filter element: two halves with the RRR print, depth tint shows the oil soaking in */}
          <g className="fc-element">
            <rect x="70" y="180" width="110" height="220" rx="4" fill="url(#fc-rrr)" />
            <rect x="220" y="180" width="110" height="220" rx="4" fill="url(#fc-rrr)" />
            <g clipPath="url(#fc-element)">
              <rect x="60" y="180" width="280" height="220" fill="url(#fc-depth)">
                <animate attributeName="y" values="-40;180" dur="1.6s" fill="freeze" />
              </rect>
              {[0, 1, 2, 3, 4, 5].map(i => (
                <path key={i} d={`M${82 + i * 18 + (i > 2 ? 132 : 0)} 184 q 6 40 -2 80 t 2 120`} stroke="#ffcf3a" strokeWidth="3" fill="none" opacity="0.55" strokeDasharray="14 26">
                  <animate attributeName="stroke-dashoffset" values="0;-80" dur={`${1.6 + (i % 3) * 0.3}s`} repeatCount="indefinite" />
                </path>
              ))}
            </g>
            {/* compressed bottom zone */}
            <rect x="70" y="370" width="110" height="30" fill="#0a0a6e" opacity="0.08" />
            <rect x="220" y="370" width="110" height="30" fill="#0a0a6e" opacity="0.08" />
          </g>

          {/* depth stages */}
          <g className="fc-stages" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="700">
            {[
              [200, '> 25 µm'],
              [290, '> 15 µm'],
              [388, '> 1 µm']
            ].map(([y, t]) => (
              <g key={t}>
                <line x1="334" x2="372" y1={y} y2={y} stroke="#5cc3ff" strokeDasharray="3 3" />
                <text x="374" y={y + 4} fill="#5cc3ff">{t}</text>
              </g>
            ))}
          </g>

          {/* contaminants caught at different depths */}
          <g clipPath="url(#fc-element)">
            <Contaminants kind="solid" count={26} color="#1d1d24" r={3.2} stopMin={192} stopMax={392} seed={7} />
            <Contaminants kind="water" count={14} color="#7fd3ff" r={4} stopMin={230} stopMax={330} seed={19} />
            <Contaminants kind="oxid" count={16} color="#a4581a" r={3.4} stopMin={360} stopMax={398} seed={31} />
          </g>

          {/* centre tube: dirty oil rising */}
          <rect x="186" y="150" width="28" height="276" rx="4" fill="#1b1e27" />
          <rect x="192" y="156" width="16" height="266" fill="url(#fc-oil-in)" />
          <path d="M200 420 V160" stroke="#f0b429" strokeWidth="4" strokeDasharray="10 18" filter="url(#fc-glow)">
            <animate attributeName="stroke-dashoffset" values="0;-56" dur="0.9s" repeatCount="indefinite" />
          </path>
          {/* spreading over the top of the element */}
          {[-1, 1].map(s => (
            <path key={s} d={`M200 164 C ${200 + s * 40} 160, ${200 + s * 90} 166, ${200 + s * 120} 180`} stroke="#d99a1e" strokeWidth="5" fill="none" strokeDasharray="12 14" opacity="0.9">
              <animate attributeName="stroke-dashoffset" values="0;-52" dur="1s" repeatCount="indefinite" />
            </path>
          ))}

          {/* clean oil leaving at the bottom */}
          <rect x="60" y="400" width="280" height="24" fill="#2a2010" />
          {[90, 130, 270, 310].map((x, i) => (
            <path key={x} d={`M${x} 402 V420`} stroke="#ffd84d" strokeWidth="5" strokeLinecap="round" filter="url(#fc-glow)" strokeDasharray="6 8">
              <animate attributeName="stroke-dashoffset" values="0;-28" dur={`${0.8 + i * 0.1}s`} repeatCount="indefinite" />
            </path>
          ))}

          {/* base block, gauge and ports */}
          <rect x="110" y="446" width="180" height="70" rx="6" fill="url(#fc-metal-v)" />
          <circle cx="250" cy="481" r="26" fill="#e9edf2" stroke="#8a929c" strokeWidth="5" />
          <path d="M232 488 A20 20 0 0 1 268 488" stroke="#d92d20" strokeWidth="5" fill="none" />
          <path d="M232 488 A20 20 0 0 1 244 465" stroke="#16a34a" strokeWidth="5" fill="none" />
          <line x1="250" y1="482" x2="262" y2="468" stroke="#1d1d24" strokeWidth="3" strokeLinecap="round" />
          <rect x="130" y="466" width="70" height="8" rx="3" fill="#b9c0c8" />
          <rect x="130" y="482" width="50" height="8" rx="3" fill="#b9c0c8" />
          <rect x="70" y="470" width="40" height="22" rx="4" fill="url(#fc-metal)" />
          <rect x="290" y="470" width="40" height="22" rx="4" fill="url(#fc-metal)" />
          <path d="M30 481 H70" stroke="#7a4f10" strokeWidth="10" strokeLinecap="round" />
          <path d="M330 481 H372" stroke="#f2b705" strokeWidth="10" strokeLinecap="round" />
          <text x="30" y="508" fill="#c9a36a" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="700">óleo sujo</text>
          <text x="318" y="508" fill="#ffd24a" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="700">óleo limpo</text>
        </svg>
      </div>
      <div className="fc__copy">
        <span className="eyebrow">Tecnologia Triple R</span>
        <h2>Purificação em profundidade: muito mais que filtrar partículas</h2>
        <p className="fc__lead">
          O óleo atravessa cerca de 114 mm de massa filtrante. A contaminação não fica só na superfície: ela é absorvida em profundidade, em três frentes ao mesmo tempo.
        </p>
        <ol className="fc__list">
          {ITEMS.map((it, i) => (
            <li key={it.id} className={i === focus ? 'is-on' : ''}>
              <button type="button" onClick={() => pick(i)} onMouseEnter={() => pick(i)} aria-pressed={i === focus}>
                <span className="fc__n">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <b>{it.title}</b>
                  <span className="fc__t">{it.text}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
