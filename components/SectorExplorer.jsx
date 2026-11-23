'use client';

import { useCallback, useState } from 'react';
import SectorCarousel from './SectorCarousel';
import SectorDetail from './SectorDetail';

// Carousel picks a sector; the panel below shows that sector in the short format.
export default function SectorExplorer({ items, sectors }) {
  const [active, setActive] = useState(0);
  const onActiveChange = useCallback(i => setActive(i), []);
  const d = sectors[active];
  return (
    <>
      <section className="section section--dark" style={{ paddingBottom: 56 }}>
        <SectorCarousel items={items} onActiveChange={onActiveChange} selectOnly autoplay={0} />
      </section>
      <section className="section section--soft sector-detail" aria-live="polite">
        <div className="container" key={d.sector.slug}>
          <div className="section-head">
            <span className="eyebrow">
              {String(active + 1).padStart(2, '0')} · {d.sector.nome}
            </span>
            <h2>{d.sector.chamada}</h2>
          </div>
          <SectorDetail sector={d.sector} products={d.products} showPageLink />
        </div>
      </section>
    </>
  );
}
