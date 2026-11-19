import { notFound } from 'next/navigation';
import PageHero from '@/components/PageHero';
import ProductCard from '@/components/ProductCard';
import Image from 'next/image';
import Reveal from '@/components/Reveal';
import { SECTOR_IMG, SECTOR_SHORT, getModel, getSector, getSeries, img, sectors, seriesCover, wa } from '@/lib/site';

export function generateStaticParams() {
  return sectors.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const s = getSector((await params).slug);
  return s ? { title: s.title, description: s.intro } : {};
}

export default async function Setor({ params }) {
  const s = getSector((await params).slug);
  if (!s) notFound();
  return (
    <>
      <PageHero eyebrow={SECTOR_SHORT[s.slug]} title={s.headline} text={s.intro} crumbs={[{ label: 'Setores', href: '/setores' }, { label: SECTOR_SHORT[s.slug] }]}>
        <div className="row-gap" style={{ marginTop: 28 }}>
          <a className="btn btn-clear" href={wa(`Olá! Trabalho no setor de ${SECTOR_SHORT[s.slug]} e gostaria de uma indicação de solução Triple R.`)} target="_blank" rel="noopener">Falar com especialista</a>
        </div>
      </PageHero>
      <section className="section">
        <div className="container split">
          <Reveal variant="left">
            <span className="eyebrow">{SECTOR_SHORT[s.slug]}</span>
            <h2>{s.sub}</h2>
            <div className="prose">
              <p>{s.body}</p>
            </div>
          </Reveal>
          <Reveal variant="right" delay={120}>
            <div className="media-frame media-frame--glow" style={{ aspectRatio: '4 / 5' }}>
              <Image src={img(SECTOR_IMG[s.slug])} alt={SECTOR_SHORT[s.slug]} fill sizes="(max-width: 900px) 100vw, 560px" style={{ objectFit: 'cover' }} />
            </div>
          </Reveal>
        </div>
      </section>
      {s.recs.length ? (
        <section className="section section--soft">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Recomendados</span>
              <h2>Soluções indicadas para este setor</h2>
            </div>
            <div className="grid-cards">
              {s.recs.map(([kind, slug]) => {
                if (kind === 's') {
                  const x = getSeries(slug);
                  return <ProductCard key={slug} href={`/solucoes/${slug}`} image={seriesCover(x)} title={x.title} text={x.sub} />;
                }
                const m = getModel(slug);
                return <ProductCard key={slug} href={`/produto/${slug}`} image={m.limg || m.img} title={m.name} kicker={m.seriesTitle} cta="Ver especificações" />;
              })}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
