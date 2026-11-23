import Image from 'next/image';
import { notFound } from 'next/navigation';
import PageHero from '@/components/PageHero';
import SectorDetail from '@/components/SectorDetail';
import SectorStory from '@/components/SectorStory';
import { STORIES } from '@/lib/stories';
import { SECTORS, SECTOR_IMG, getSectorShort, img, proxied, sectorProducts } from '@/lib/site';

export function generateStaticParams() {
  return SECTORS.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const s = getSectorShort((await params).slug);
  return s ? { title: s.nome, description: `${s.chamada} ${s.problema}` } : {};
}

export default async function Setor({ params }) {
  const s = getSectorShort((await params).slug);
  if (!s) notFound();
  return (
    <>
      <PageHero eyebrow={s.nome} title={s.chamada} crumbs={[{ label: 'Setores', href: '/setores' }, { label: s.nome }]} />
      {STORIES[s.slug] ? <SectorStory story={STORIES[s.slug]} images={STORIES[s.slug].scenes.map(sc => proxied(sc.image, 1920))} /> : null}
      <section className="section">
        <div className="container">
          {STORIES[s.slug] ? null : (
            <div className="sector-photo">
              <Image src={img(SECTOR_IMG[s.slug])} alt="" fill sizes="(max-width: 1200px) 100vw, 1200px" style={{ objectFit: 'cover' }} />
            </div>
          )}
          <SectorDetail sector={s} products={sectorProducts(s)} />
        </div>
      </section>
    </>
  );
}
