import Link from 'next/link';
import { CatalogButton } from '@/components/Catalog';
import PageHero from '@/components/PageHero';
import SolutionsFilter from '@/components/SolutionsFilter';
import { APPS, SERIES_META, VOLUMES } from '@/lib/catalog';
import { quoteHref, series, seriesCover } from '@/lib/site';

export const metadata = { title: 'Soluções', description: 'Purificadores de óleo by-pass e off-line, elementos filtrantes, desidratadores a vácuo e mais. Filtre por aplicação e volume de óleo.' };

export default function Solucoes() {
  const items = series.map(s => ({
    slug: s.slug,
    title: s.title,
    image: seriesCover(s),
    count: s.groups.reduce((n, g) => n + g.m.length, 0),
    ...SERIES_META[s.slug]
  }));
  return (
    <>
      <PageHero eyebrow="Soluções" title="Encontre a solução para o seu óleo" text="Filtre pela aplicação e pelo volume de óleo do sistema. Na dúvida, nossa equipe técnica indica o modelo." crumbs={[{ label: 'Soluções' }]}>
        <div className="row-gap" style={{ marginTop: 28 }}>
          <Link className="btn btn-clear" href={quoteHref()}>Pedir orçamento</Link>
          <CatalogButton className="btn btn-ghost-light" />
        </div>
      </PageHero>
      <section className="section section--soft">
        <div className="container">
          <SolutionsFilter items={items} apps={APPS} volumes={VOLUMES} />
        </div>
      </section>
    </>
  );
}
