import Link from 'next/link';
import Icon from './Icon';
import ProductCard from './ProductCard';
import { quoteHref } from '@/lib/site';

// Same short layout for every sector: problem → where to apply → result → proof → products.
export default function SectorDetail({ sector, products, showPageLink = false }) {
  return (
    <div className="sd">
      <div className="sd__grid">
        <article className="sd__card sd__card--problem">
          <span className="sd__ic"><Icon name="drop" /></span>
          <h3>O problema</h3>
          <p>{sector.problema}</p>
        </article>
        <article className="sd__card">
          <span className="sd__ic"><Icon name="gear" /></span>
          <h3>Onde aplicar</h3>
          <ul>
            {sector.ondeAplicar.map(o => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </article>
        <article className="sd__card sd__card--result">
          <span className="sd__ic"><Icon name="check" /></span>
          <h3>Resultado</h3>
          <p>{sector.resultado}</p>
          {sector.prova ? <p className="sd__proof">{sector.prova}</p> : null}
        </article>
      </div>
      <div className="sd__products">
        <h3 className="group-title">Produtos recomendados</h3>
        <div className="grid-cards">
          {products.map(p => (
            <ProductCard key={p.href} href={p.href} image={p.image} title={p.title} text={p.text} />
          ))}
        </div>
      </div>
      <div className="row-gap sd__cta">
        <Link className="btn btn-primary" href={quoteHref(`Setor: ${sector.nome}`)}>Pedir orçamento</Link>
        {showPageLink ? (
          <Link className="btn btn-ghost" href={`/setores/${sector.slug}`}>Página do setor</Link>
        ) : null}
      </div>
    </div>
  );
}
