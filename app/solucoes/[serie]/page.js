import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CatalogButton } from '@/components/Catalog';
import Icon from '@/components/Icon';
import PageHero from '@/components/PageHero';
import ProductCard from '@/components/ProductCard';
import { SERIES_META } from '@/lib/catalog';
import { getModel, getSeries, productHref, quoteHref, series } from '@/lib/site';

export function generateStaticParams() {
  return series.map(s => ({ serie: s.slug }));
}

export async function generateMetadata({ params }) {
  const s = getSeries((await params).serie);
  return s ? { title: s.title, description: SERIES_META[s.slug].line } : {};
}

const volumeOf = m => m.sel.find(([, v]) => /\d\s?L\b/.test(v))?.[1]?.replace(/\s*\|\s*/g, ' / ');

export default async function Serie({ params }) {
  const s = getSeries((await params).serie);
  if (!s) notFound();
  const meta = SERIES_META[s.slug];
  return (
    <>
      <PageHero eyebrow={s.title} title={meta.line} text={`${s.intro}${meta.volume && meta.volume !== 'Consulte' ? ` ${meta.volume}.` : ''}`} crumbs={[{ label: 'Soluções', href: '/solucoes' }, { label: s.title }]}>
        <div className="row-gap" style={{ marginTop: 28 }}>
          <Link className="btn btn-clear" href={quoteHref(s.title)}>Pedir orçamento</Link>
          <CatalogButton className="btn btn-ghost-light" />
        </div>
      </PageHero>
      <section className="section section--soft" style={{ paddingBottom: 0 }}>
        <div className="container">
          <ul className="highlights highlights--4">
            {meta.highlights.map(([icon, text]) => (
              <li key={text}>
                <span className="highlights__ic"><Icon name={icon} /></span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          {s.groups.map((g, gi) => (
            <div key={gi}>
              <h2 className="group-title">{g.t || `Modelos ${s.title}`}</h2>
              <div className="grid-cards">
                {g.m.map(slug => {
                  const m = getModel(slug);
                  return <ProductCard key={slug} href={productHref(slug, s.slug)} image={m.limg || m.img} title={m.name} badge={volumeOf(m)} cta="Ver especificações" />;
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
