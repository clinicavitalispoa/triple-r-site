// Small line icons for highlights and contaminant cards.
const P = {
  particle: <><circle cx="7" cy="8" r="2" /><circle cx="15" cy="6" r="1.5" /><circle cx="17" cy="14" r="2.5" /><circle cx="9" cy="16" r="1.5" /><circle cx="12" cy="11" r="1" /></>,
  drop: <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />,
  varnish: <><path d="M4 18c3-1 5-4 8-4s5 3 8 4" /><path d="M4 13c3-1 5-4 8-4s5 3 8 4" /><path d="M8 5h8" /></>,
  sludge: <><path d="M3 17c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2 1 3 1" /><path d="M5 11c1-3 3-5 7-5s6 2 7 5" /></>,
  plug: <><path d="M9 3v5M15 3v5" /><path d="M6 8h12v3a6 6 0 0 1-12 0V8Z" /><path d="M12 17v4" /></>,
  gauge: <><path d="M4 16a8 8 0 1 1 16 0" /><path d="M12 16l4-5" /><circle cx="12" cy="16" r="1.2" /></>,
  shield: <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />,
  tank: <><ellipse cx="12" cy="6" rx="7" ry="2.5" /><path d="M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6" /><path d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" /></>,
  pump: <><circle cx="10" cy="12" r="5" /><path d="M15 12h6M10 7V3M4 21h12" /></>,
  flow: <><path d="M3 8h13l-3-3M21 16H8l3 3" /></>,
  filter: <><path d="M4 5h16l-6 7v6l-4 2v-8L4 5Z" /></>,
  check: <><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.5 2.5L16 9.5" /></>,
  ship: <><path d="M3 15l2 5h14l2-5H3Z" /><path d="M6 15V9h12v6M12 9V4" /></>,
  truck: <><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></>,
  engine: <><path d="M5 9h3V7h6v2h2l2 2h2v6h-2l-2 2H8l-3-3V9Z" /><path d="M2 12h3" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" /></>,
  magnet: <><path d="M6 3v9a6 6 0 0 0 12 0V3h-4v9a2 2 0 0 1-4 0V3H6Z" /><path d="M6 7h4M14 7h4" /></>,
  air: <><circle cx="8" cy="15" r="3" /><circle cx="15" cy="9" r="4" /><circle cx="17" cy="18" r="1.5" /><circle cx="6" cy="6" r="1.5" /></>,
  snow: <><path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9" /></>
};

export default function Icon({ name, size = 24 }) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {P[name] || P.check}
    </svg>
  );
}
