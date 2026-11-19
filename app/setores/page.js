import Link from 'next/link';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import SectorCarousel from '@/components/SectorCarousel';
import { SECTOR_SHORT, sectorItems, sectors } from '@/lib/site';

export const metadata = { title: 'Setores', description: 'Purificação de óleo para injetoras, setor sucroenergético, papel e celulose, energia eólica, marítimo e mais.' };

export default function Setores() {
  return (
    <>
      <PageHero eyebrow="Setores" title="Soluções para cada indústria" text="Empresas em mais de 50 países usam os purificadores Triple R para aumentar a confiabilidade das máquinas e reduzir o down-time." crumbs={[{ label: 'Setores' }]} />
      <section className="section section--dark" style={{ paddingBottom: 56 }}>
        <SectorCarousel items={sectorItems()} />
      </section>
      <section className="section section--soft">
        <div className="container sector-grid">
          {sectors.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 80}>
              <Link href={`/setores/${s.slug}`} className="sector">
                <h3>{SECTOR_SHORT[s.slug]}</h3>
                <p>{s.intro}</p>
                <span>Conheça →</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
