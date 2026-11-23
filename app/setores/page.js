import PageHero from '@/components/PageHero';
import SectorExplorer from '@/components/SectorExplorer';
import { SECTORS, sectorItems, sectorProducts } from '@/lib/site';

export const metadata = { title: 'Setores', description: 'Purificação de óleo para injetoras, automotivo, sucroenergético, papel e celulose, eólica, marítimo, petroquímica e mais.' };

export default function Setores() {
  const sectors = SECTORS.map(sector => ({ sector, products: sectorProducts(sector) }));
  return (
    <>
      <PageHero eyebrow="Setores" title="Soluções para cada indústria" text="Escolha o seu setor e veja o problema, onde aplicar e os produtos recomendados." crumbs={[{ label: 'Setores' }]} />
      <SectorExplorer items={sectorItems()} sectors={sectors} />
    </>
  );
}
