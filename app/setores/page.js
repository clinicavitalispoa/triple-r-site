import PageHero from '@/components/PageHero';
import SectorExplorer from '@/components/SectorExplorer';
import { STORIES } from '@/lib/stories';
import { SECTORS, proxied, sectorItems, sectorProducts } from '@/lib/site';

export const metadata = { title: 'Setores', description: 'Purificação de óleo para injetoras, automotivo, sucroenergético, papel e celulose, eólica, marítimo, petroquímica e mais.' };

export default function Setores() {
  const sectors = SECTORS.map(sector => {
    const story = STORIES[sector.slug] || null;
    return { sector, products: sectorProducts(sector), story, images: story ? story.scenes.map(sc => proxied(sc.image, 1920)) : [] };
  });
  return (
    <>
      <PageHero eyebrow="Setores" title="Soluções para cada indústria" text="Escolha o seu setor no carrossel e role a página para ver onde o óleo trabalha em cada máquina." crumbs={[{ label: 'Setores' }]} />
      <SectorExplorer items={sectorItems()} sectors={sectors} />
    </>
  );
}
