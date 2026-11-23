'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import SectorCarousel from './SectorCarousel';
import SpotlightCard from './reactbits/SpotlightCard/SpotlightCard';
import { wa } from '@/lib/site';

// Carousel picks a sector; the panel below shows that sector's details (no duplicated card grid).
export default function SectorExplorer({ items, details }) {
  const [active, setActive] = useState(0);
  const onActiveChange = useCallback(i => setActive(i), []);
  const d = details[active];

  return (
    <>
      <section className="section section--dark" style={{ paddingBottom: 56 }}>
        <SectorCarousel items={items} onActiveChange={onActiveChange} selectOnly autoplay={0} />
      </section>
      <section className="section section--soft sector-detail" aria-live="polite">
        <div className="container" key={d.slug}>
          <div className="split split--top sector-detail__top">
            <div className="sector-detail__copy">
              <span className="eyebrow">
                {String(active + 1).padStart(2, '0')} · {d.short}
              </span>
              <h2>{d.headline}</h2>
              <p className="lead">{d.intro}</p>
              <div className="row-gap" style={{ marginTop: 24 }}>
                <a className="btn btn-wa" href={wa(`Olá! Trabalho no setor de ${d.short} e gostaria de uma indicação de solução Triple R.`)} target="_blank" rel="noopener">
                  Falar com especialista
                </a>
                <Link className="btn btn-ghost" href={`/setores/${d.slug}`}>
                  Página completa do setor
                </Link>
              </div>
            </div>
            <div className="sector-detail__body">
              <h3>{d.sub}</h3>
              <p>{d.body}</p>
            </div>
          </div>
          {d.recs.length ? (
            <>
              <h3 className="group-title">Soluções indicadas para {d.short}</h3>
              <div className="grid-cards">
                {d.recs.map(r => (
                  <Link key={r.href} href={r.href} className="pcard-link">
                    <SpotlightCard theme="light" spotlightColor="#0086D1" intensity={0.5} spotlightSize={260} className="pcard">
                      <div className="pcard__media">{r.image ? <Image src={r.image} alt={r.title} fill sizes="(max-width: 700px) 90vw, 300px" /> : null}</div>
                      <div className="pcard__body">
                        {r.kicker ? <span className="kicker">{r.kicker}</span> : null}
                        <h3>{r.title}</h3>
                        {r.text ? <p>{r.text}</p> : null}
                        <span className="pcard__cta">
                          Conheça <span aria-hidden="true">→</span>
                        </span>
                      </div>
                    </SpotlightCard>
                  </Link>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </section>
    </>
  );
}
