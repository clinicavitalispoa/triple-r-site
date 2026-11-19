import ProductCard from '@/components/ProductCard';
import PageHero from '@/components/PageHero';
import { series, seriesCover, waCatalog } from '@/lib/site';

export const metadata = { title: 'Soluções', description: 'Purificadores de óleo by-pass e off-line, elementos filtrantes, desidratadores a vácuo e mais.' };

export default function Solucoes() {
  return (
    <>
      <PageHero eyebrow="Soluções" title="Soluções personalizadas para o seu maquinário" text="Otimize a eficiência e a rentabilidade das suas máquinas. Escolha a linha ideal ou fale com um especialista para uma indicação técnica." crumbs={[{ label: 'Soluções' }]}>
        <div className="row-gap" style={{ marginTop: 28 }}>
          <a className="btn btn-clear" href={waCatalog()} target="_blank" rel="noopener">Receber catálogo completo</a>
          <a className="btn btn-ghost-light" href="/ferramentas">Calcular economia</a>
        </div>
      </PageHero>
      <section className="section section--soft">
        <div className="container grid-cards">
          {series.map(s => (
            <ProductCard key={s.slug} href={`/solucoes/${s.slug}`} image={seriesCover(s)} title={s.title} text={s.sub} cta={`${s.groups.reduce((n, g) => n + g.m.length, 0)} modelo(s)`} />
          ))}
        </div>
      </section>
    </>
  );
}
