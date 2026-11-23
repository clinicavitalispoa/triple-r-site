import Image from 'next/image';
import Link from 'next/link';
import { CatalogButton } from '@/components/Catalog';
import Icon from '@/components/Icon';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { img, quoteHref } from '@/lib/site';

export const metadata = { title: 'Benefícios', description: 'Partículas, água, borra e verniz: o dano de cada contaminante e como o purificador Triple R remove os quatro em um único elemento.' };

const CONTAMINANTS = [
  {
    icon: 'particle',
    name: 'Partículas',
    damage: 'Riscam bombas, válvulas e servoválvulas, que trabalham com folgas de 1 a 10 µm.',
    fix: 'O elemento de 114 mm retém partículas de até 1 mícron em 3 estágios.'
  },
  {
    icon: 'drop',
    name: 'Água',
    damage: 'Oxida o óleo, consome os aditivos e corrói as superfícies metálicas.',
    fix: 'A celulose absorve a água e deixa o óleo com menos de 100 ppm. O TRVS remove até a dissolvida.'
  },
  {
    icon: 'sludge',
    name: 'Borra',
    damage: 'Resíduo pegajoso que satura os filtros antes da hora e isola os trocadores de calor.',
    fix: 'A mídia em profundidade absorve a borra junto com as partículas.'
  },
  {
    icon: 'varnish',
    name: 'Verniz',
    damage: 'Gruda nas válvulas, aumenta o atrito e chega a travar o carretel.',
    fix: 'Os resíduos de oxidação ficam presos na celulose antes de virar verniz.'
  }
];

const FACTS = [
  ['até 50%', 'menos vida útil das máquinas quando há água no óleo'],
  ['3.000 kg', 'de partículas por ano passam por uma bomba de 200 L/min com óleo NAS 12. Com óleo NAS 4, cerca de 6 kg'],
  ['5 a 6 vezes', 'mais atrito nas válvulas quando há resinas (verniz) no óleo']
];

export default function Beneficios() {
  return (
    <>
      <PageHero eyebrow="Benefícios" title="Quatro contaminantes, um único elemento" text="Partículas, água, borra e verniz encurtam a vida do óleo e das máquinas. O purificador Triple R remove os quatro." crumbs={[{ label: 'Benefícios' }]}>
        <div className="row-gap" style={{ marginTop: 28 }}>
          <Link className="btn btn-clear" href={quoteHref()}>Pedir orçamento</Link>
          <CatalogButton className="btn btn-ghost-light" />
        </div>
      </PageHero>
      <section className="section section--soft">
        <div className="container contaminants">
          {CONTAMINANTS.map((c, i) => (
            <Reveal key={c.name} delay={i * 90} className="cont">
              <span className="cont__ic"><Icon name={c.icon} size={30} /></span>
              <h2>{c.name}</h2>
              <p className="cont__damage"><b>Dano:</b> {c.damage}</p>
              <p className="cont__fix"><b>Como o Triple R remove:</b> {c.fix}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <Reveal variant="left">
            <span className="eyebrow">By-pass x filtro de linha</span>
            <h2>Por que o by-pass limpa mais</h2>
            <p className="lead">O purificador Triple R fica fora do fluxo principal: trabalha com vazão reduzida, baixa pressão e sem pulsação. Por isso o óleo atravessa 114 mm de meio filtrante, contra 1 a 2 mm de um filtro de linha comum.</p>
          </Reveal>
          <Reveal variant="right" delay={120}>
            <div className="media-frame" style={{ background: '#fff' }}>
              <Image src={img('2023/07/ByPass-Versus-Line.webp')} alt="Comparação entre purificador by-pass Triple R e filtro de linha" fill sizes="(max-width: 900px) 100vw, 560px" />
            </div>
          </Reveal>
        </div>
      </section>
      <section className="section section--dark">
        <div className="hero-r" aria-hidden="true" />
        <div className="container" style={{ position: 'relative' }}>
          <div className="section-head">
            <span className="eyebrow">Em números</span>
            <h2>O custo de um óleo contaminado</h2>
          </div>
          <div className="facts">
            {FACTS.map(([n, t]) => (
              <div key={n}>
                <strong>{n}</strong>
                <span>{t}</span>
              </div>
            ))}
          </div>
          <p className="facts__src">Segundo dados do fabricante (Triple R).</p>
        </div>
      </section>
    </>
  );
}
