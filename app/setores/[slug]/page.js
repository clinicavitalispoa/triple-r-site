import Image from 'next/image';
import { notFound } from 'next/navigation';
import PageHero from '@/components/PageHero';
import SectorDetail from '@/components/SectorDetail';
import { SECTORS, SECTOR_IMG, getSectorShort, img, sectorProducts } from '@/lib/site';

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
      <section className="section">
        <div className="container">
          <div className="sector-photo">
            <Image src={img(SECTOR_IMG[s.slug])} alt="" fill sizes="(max-width: 1200px) 100vw, 1200px" style={{ objectFit: 'cover' }} />
          </div>
          <SectorDetail sector={s} products={sectorProducts(s)} />
        </div>
      </section>
    </>
  );
}
