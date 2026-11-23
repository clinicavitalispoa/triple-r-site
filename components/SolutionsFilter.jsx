'use client';

import { useMemo, useState } from 'react';
import ProductCard from './ProductCard';

export default function SolutionsFilter({ items, apps, volumes }) {
  const [app, setApp] = useState('');
  const [vol, setVol] = useState('');
  const list = useMemo(() => items.filter(it => (!app || it.apps.includes(app)) && (!vol || it.vols.includes(vol))), [items, app, vol]);
  return (
    <>
      <div className="filters" role="group" aria-label="Filtrar soluções">
        <div className="filters__group">
          <span className="filters__label">Aplicação</span>
          <div className="filters__chips">
            <button type="button" aria-pressed={!app} onClick={() => setApp('')}>Todas</button>
            {apps.map(a => (
              <button key={a.id} type="button" aria-pressed={app === a.id} onClick={() => setApp(app === a.id ? '' : a.id)}>
                {a.label}
              </button>
            ))}
          </div>
        </div>
        <div className="filters__group">
          <span className="filters__label">Volume de óleo</span>
          <div className="filters__chips">
            <button type="button" aria-pressed={!vol} onClick={() => setVol('')}>Qualquer</button>
            {volumes.map(v => (
              <button key={v.id} type="button" aria-pressed={vol === v.id} onClick={() => setVol(vol === v.id ? '' : v.id)}>
                {v.label}
              </button>
            ))}
          </div>
        </div>
        <p className="filters__count" aria-live="polite">
          {list.length} {list.length === 1 ? 'linha encontrada' : 'linhas encontradas'}
        </p>
      </div>
      {list.length ? (
        <div className="grid-cards">
          {list.map(it => (
            <ProductCard key={it.slug} href={`/solucoes/${it.slug}`} image={it.image} title={it.title} text={it.line} badge={it.volume} cta={`${it.count} modelo(s)`} />
          ))}
        </div>
      ) : (
        <p className="lead">Nenhuma linha com essa combinação. Fale com a nossa equipe técnica que indicamos a melhor solução.</p>
      )}
    </>
  );
}
