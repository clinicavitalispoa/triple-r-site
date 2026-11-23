'use client';

import { useCallback, useState } from 'react';
import SectorCarousel from './SectorCarousel';
import SectorDetail from './SectorDetail';
import SectorStory from './SectorStory';

// One page for all sectors: the carousel picks a sector and, right below, its scroll-telling
// story (when there is an annotated picture) followed by the short summary and products.
export default function SectorExplorer({ items, sectors }) {
  const [active, setActive] = useState(0);
  const onActiveChange = useCallback(i => setActive(i), []);
  const d = sectors[active];
  return (
    <>
      <section className="section section--dark" style={{ paddingBottom: 56 }}>
        <SectorCarousel items={items} onActiveChange={onActiveChange} selectOnly autoplay={0} />
      </section>
      <div className="sector-detail" aria-live="polite" key={d.sector.slug}>
        {d.story ? <SectorStory story={d.story} images={d.images} /> : null}
        <section className="section section--soft">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">
                {String(active + 1).padStart(2, '0')} · {d.sector.nome}
              </span>
              <h2>{d.sector.chamada}</h2>
            </div>
            <SectorDetail sector={d.sector} products={d.products} />
          </div>
        </section>
      </div>
    </>
  );
}
