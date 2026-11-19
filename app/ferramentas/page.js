import PageHero from '@/components/PageHero';
import SpotlightCard from '@/components/reactbits/SpotlightCard/SpotlightCard';

export const metadata = { title: 'Ferramentas', description: 'Calculadora de economia e seletor de produtos Triple R.' };

const TOOLS = [
  { t: 'Calculadora de economia', d: 'Estime a economia anual com a purificação de óleo Triple R. Ajuste os números da sua planta e veja o resultado em menos de 1 minuto.', h: 'https://calculadora.triple-rrr.com.br/', c: 'Abrir calculadora' },
  { t: 'Seletor de produtos', d: 'Responda algumas perguntas sobre o seu óleo e a sua instalação e receba uma pré-seleção técnica entre as séries BU, TR, SE, TRVS e OSCA.', h: 'https://seletor.triple-rrr.com.br/', c: 'Abrir seletor' }
];

export default function Ferramentas() {
  return (
    <>
      <PageHero eyebrow="Ferramentas" title="Dimensione o ganho e escolha o sistema ideal" text="Ferramentas online da Triple R para apoiar a sua decisão." crumbs={[{ label: 'Ferramentas' }]} />
      <section className="section section--soft">
        <div className="container features" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {TOOLS.map((x, i) => (
            <SpotlightCard key={x.t} theme="light" spotlightColor="#0086D1" intensity={0.5}>
              <span className="num" style={{ width: 44, height: 44, borderRadius: 12, display: 'grid', placeItems: 'center', background: 'var(--deep)', color: '#fff', fontWeight: 700, marginBottom: 18 }}>{i + 1}</span>
              <h2 style={{ fontSize: '1.5rem' }}>{x.t}</h2>
              <p style={{ color: 'var(--muted)' }}>{x.d}</p>
              <a className="btn btn-primary" href={x.h} target="_blank" rel="noopener">{x.c}</a>
            </SpotlightCard>
          ))}
        </div>
      </section>
    </>
  );
}
