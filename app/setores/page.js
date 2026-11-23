import PageHero from '@/components/PageHero';
import SectorExplorer from '@/components/SectorExplorer';
import { SECTOR_SHORT, getModel, getSeries, img, sectorItems, sectors, seriesCover } from '@/lib/site';

export const metadata = { title: 'Setores', description: 'Purificação de óleo para injetoras, setor sucroenergético, papel e celulose, energia eólica, marítimo e mais.' };

const details = sectors.map(s => ({
  slug: s.slug,
  short: SECTOR_SHORT[s.slug],
  headline: s.headline,
  intro: s.intro,
  sub: s.sub,
  body: s.body,
  recs: s.recs.map(([kind, slug]) => {
    if (kind === 's') {
      const x = getSeries(slug);
      return { href: `/solucoes/${slug}`, title: x.title, text: x.sub, image: img(seriesCover(x)) };
    }
    const m = getModel(slug);
    return { href: `/produto/${slug}`, title: m.name, kicker: m.seriesTitle, image: img(m.limg || m.img) };
  })
}));

export default function Setores() {
  return (
    <>
      <PageHero eyebrow="Setores" title="Soluções para cada indústria" text="Escolha o seu setor no carrossel e veja como a Triple R ajuda a aumentar a confiabilidade das máquinas e reduzir o down-time." crumbs={[{ label: 'Setores' }]} />
      <SectorExplorer items={sectorItems()} details={details} />
    </>
  );
}
