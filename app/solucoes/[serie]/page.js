import { notFound } from 'next/navigation';
import PageHero from '@/components/PageHero';
import ProductCard from '@/components/ProductCard';
import Faq from '@/components/Faq';
import { getModel, getSeries, series, wa, waCatalog } from '@/lib/site';

export function generateStaticParams() {
  return series.map(s => ({ serie: s.slug }));
}

export async function generateMetadata({ params }) {
  const s = getSeries((await params).serie);
  return s ? { title: s.title, description: s.intro } : {};
}

export default async function Serie({ params }) {
  const s = getSeries((await params).serie);
  if (!s) notFound();
  return (
    <>
      <PageHero eyebrow={s.sub} title={s.headline} text={s.intro} crumbs={[{ label: 'Soluções', href: '/solucoes' }, { label: s.title }]}>
        <div className="row-gap" style={{ marginTop: 28 }}>
          <a className="btn btn-clear" href={wa(`Olá! Gostaria de um orçamento da linha ${s.title}.`)} target="_blank" rel="noopener">Pedir orçamento</a>
          <a className="btn btn-ghost-light" href={waCatalog(s.title)} target="_blank" rel="noopener">Receber catálogo</a>
        </div>
      </PageHero>
      <section className="section">
        <div className="container">
          {s.groups.map((g, gi) => (
            <div key={gi}>
              {g.t ? <h2 className="group-title">{g.t}</h2> : null}
              <div className="grid-cards">
                {g.m.map(slug => {
                  const m = getModel(slug);
                  return <ProductCard key={slug} href={`/produto/${slug}`} image={m.limg || m.img} title={m.name} kicker={s.title} cta="Ver especificações" />;
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">FAQ</span>
            <h2>Perguntas frequentes</h2>
          </div>
          <Faq />
        </div>
      </section>
    </>
  );
}
