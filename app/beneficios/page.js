import Image from 'next/image';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { img, wa } from '@/lib/site';

export const metadata = { title: 'Benefícios', description: 'Como a purificação de óleo elimina verniz, borra, água e partículas sólidas e reduz custos.' };

const LIST = ['Maior vida útil dos componentes', 'Menor custo de manutenção', 'Mais confiabilidade operacional', 'Melhor eficiência energética', 'Preservação do meio ambiente'];

const TOPICS = [
  {
    eyebrow: 'Água',
    title: 'A água pode reduzir a vida útil das máquinas em até 50%',
    image: '2023/07/Oxidacao-do-oleo.webp',
    text: [
      'A água oxida o óleo, principalmente na presença de catalisadores como cobre e ferro. Quanto maior a oxidação, maior o TAN (Total Acid Number). Quando a acidez chega a 2 mg KOH/g, o óleo precisa ser trocado para evitar danos graves.',
      'Nas folgas mínimas das máquinas modernas, a umidade se expande no vácuo e causa microexplosões nas superfícies de contato. Isso gera desgaste, corrosão e fadiga, além de criar o ambiente ideal para bactérias que quebram os aditivos.'
    ]
  },
  {
    eyebrow: 'By-pass',
    title: 'Por que o by-pass Triple R é mais eficaz que o filtro de fluxo total?',
    image: '2023/07/ByPass-Versus-Line.webp',
    text: [
      'Os purificadores Triple R são instalados em by-pass: não sofrem altas vazões, altas pressões nem pulsações do sistema. O elemento opera sempre em condições ideais, com fluxo reduzido, baixa pressão e sem estresse.',
      'São 114 mm de meio filtrante, uma microfiltração em profundidade de verdade, contra 1 ou 2 mm de um filtro de linha convencional.'
    ]
  },
  {
    eyebrow: 'Partículas sólidas',
    title: 'O sistema hidráulico gera partículas continuamente',
    image: '2023/07/Particulas-Solidas.webp',
    text: [
      'Bombas e servo-válvulas têm folgas críticas de 1 a 10 µm. A maioria dos fabricantes exige limpeza NAS 6 ou ISO 17/15/12 para evitar falhas prematuras.',
      'Uma bomba de 200 L/min com óleo contaminado (NAS 12) processa mais de 3.000 kg de partículas por ano. Com óleo limpo (NAS 4), são apenas 6 kg.'
    ]
  },
  {
    eyebrow: 'Verniz e borra',
    title: 'A borra causa consequências graves',
    image: '2023/07/Verniz-e-Borra.webp',
    text: [
      'Os resíduos de oxidação se formam continuamente e aceleram com calor, oxigênio e partículas metálicas. O verniz retém contaminantes, cria uma superfície abrasiva, isola trocadores de calor e satura filtros.',
      'A presença de resinas pode aumentar o atrito em 5 a 6 vezes, o que causa maior consumo de energia e válvulas lentas ou travadas.'
    ]
  }
];

export default function Beneficios() {
  return (
    <>
      <PageHero eyebrow="Benefícios" title="Os benefícios da purificação de óleo para o seu negócio" text="Elimine verniz, borra, água e partículas sólidas e mantenha o óleo limpo, com resultado garantido." crumbs={[{ label: 'Benefícios' }]} />
      <section className="section">
        <div className="container split">
          <Reveal>
            <span className="eyebrow">Eficiência</span>
            <h2>Tenha um desempenho melhor</h2>
            <p className="lead">A purificação de óleo otimiza o desempenho dos equipamentos e garante uma operação mais eficiente e confiável.</p>
          </Reveal>
          <Reveal delay={120}>
            <div className="features" style={{ gridTemplateColumns: '1fr' }}>
              {LIST.map((l, i) => (
                <div className="feature" key={l} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 18 }}>
                  <span className="num" style={{ margin: 0 }}>{i + 1}</span>
                  <b style={{ fontFamily: 'var(--head)', color: 'var(--deep)' }}>{l}</b>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
      {TOPICS.map((t, i) => (
        <section className={`section${i % 2 === 0 ? ' section--soft' : ''}`} key={t.title}>
          <div className="container split">
            <Reveal style={{ order: i % 2 ? 2 : 0 }}>
              <div className="media-frame" style={{ background: '#fff' }}>
                <Image src={img(t.image)} alt={t.title} fill sizes="(max-width: 900px) 100vw, 560px" />
              </div>
            </Reveal>
            <Reveal delay={100}>
              <span className="eyebrow">{t.eyebrow}</span>
              <h2>{t.title}</h2>
              <div className="prose">
                {t.text.map(p => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      ))}
      <section className="section section--dark">
        <div className="hero-r" aria-hidden="true" />
        <div className="container split" style={{ position: 'relative' }}>
          <div>
            <span className="eyebrow">Óleo perfeitamente limpo</span>
            <h2>A Triple R não vende filtros. Vende óleo limpo.</h2>
            <p style={{ color: 'rgba(255,255,255,0.75)' }}>Elementos absolutos testados Multipass (ISO 4572), com alta eficiência de retenção (β &gt; 75). Em qualquer aplicação, você compra uma solução para o problema de contaminação.</p>
          </div>
          <div className="row-gap">
            <a className="btn btn-light" href={wa('Olá! Gostaria de saber qual purificador Triple R é ideal para minha máquina.')} target="_blank" rel="noopener">Quero óleo limpo</a>
          </div>
        </div>
      </section>
    </>
  );
}
