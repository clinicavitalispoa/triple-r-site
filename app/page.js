import Image from 'next/image';
import Link from 'next/link';
import MachineHolo from '@/components/MachineHolo';
import Machine3D from '@/components/Machine3D';
import SectorCarousel from '@/components/SectorCarousel';
import BlurText from '@/components/reactbits/BlurText/BlurText';
import ProductCard from '@/components/ProductCard';
import Reveal from '@/components/Reveal';
import CountUp from '@/components/CountUp';
import Faq from '@/components/Faq';
import { getModel, img, sectorItems, series, seriesCover, wa, waCatalog } from '@/lib/site';

const CLIENTS = ['General-Motors', 'KLM-Royal-Dutch-Airlines', 'Hyundai', 'Mercedes-Benz', 'Coca-cola', 'AGFA', 'Ford', 'Rolls-Royce-1', 'Nissan', 'Esso', 'General-Electric', 'Usiminas', 'Biosev', 'Raizen', 'CSN'];

const FEATURED = [
  { slug: 'se100-st', image: '2023/08/SE100-ST.png' },
  { slug: 'trvs-30e', image: '2023/08/TRVS-30E.png' },
  { slug: 'al100', image: '2023/09/AL100_2.png' }
];

const HOME_SERIES = ['serie-bu', 'serie-se', 'serie-osca', 'desidratador-a-vacuo-termovacuo', 'serie-tr', 'elementos-filtrantes'];

export default function Home() {
  return (
    <>
      <section className="hero">
        <span className="hero-orb hero-orb--a" aria-hidden="true" />
        <span className="hero-orb hero-orb--b" aria-hidden="true" />
        <div className="hero-r" aria-hidden="true" />
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Tecnologia japonesa · desde 1967</span>
            <div className="hero-title" role="heading" aria-level={1}>
              <BlurText text="Óleo limpo é" delay={110} stepDuration={0.4} direction="bottom" trigger="load" />
              <BlurText text="máquina produzindo." className="accent" delay={110} stepDuration={0.4} direction="bottom" trigger="load" />
            </div>
            <p className="lead">
              Os purificadores Triple R removem partículas sólidas de até 1 mícron, água, borra e verniz em um único elemento. Menos paradas, óleo que dura até 5 vezes mais e até 80% menos custo de manutenção.
            </p>
            <ul className="hero-badges">
              <li>Patente original RRR</li>
              <li>+50 países</li>
              <li>+100.000 instalações</li>
            </ul>
            <div className="row-gap">
              <a className="btn btn-clear" href={wa('Olá! Vim pelo site da Triple R e gostaria de um orçamento.')} target="_blank" rel="noopener">
                Pedir orçamento
              </a>
              <Link className="btn btn-ghost-light" href="/produto/bu100e">
                Conhecer a BU100E
              </Link>
            </div>
          </div>
          <div className="hero-card">
            <Machine3D height={560} />
          </div>
        </div>
      </section>

      <section className="logos" aria-label="Empresas que utilizam a Triple R">
        <p>Empresas que confiam na Triple R</p>
        <div className="marquee">
          <div className="marquee__track">
            {[...CLIENTS, ...CLIENTS].map((c, i) => (
              <img key={i} src={img(`2023/07/${c}.png`)} alt={i < CLIENTS.length ? c.replace(/-1$/, '').replace(/-/g, ' ') : ''} aria-hidden={i >= CLIENTS.length} loading="lazy" />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <Reveal variant="left">
            <span className="eyebrow">Quem somos</span>
            <div className="split-heading h2" role="heading" aria-level={2}>
              <BlurText text="Muito mais que filtragem: purificação." delay={90} direction="top" />
            </div>
            <p className="lead">
              Com mais de 50 anos de mercado, a tecnologia Triple R estende a vida útil do óleo e reduz paradas de produção causadas por contaminação. É o parceiro ideal para metas de Manutenção Produtiva Total (TPM) e de sustentabilidade.
            </p>
            <div className="row-gap" style={{ marginTop: 24 }}>
              <Link className="btn btn-primary" href="/quem-somos">Conheça a Triple R</Link>
              <Link className="btn btn-ghost" href="/beneficios">Ver benefícios</Link>
            </div>
          </Reveal>
          <Reveal variant="right" delay={150}>
            <div className="media-frame media-frame--glow float-y">
              <Image src={img('2023/09/Infografico.png')} alt="Infográfico do funcionamento do purificador Triple R" fill sizes="(max-width: 900px) 100vw, 560px" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--dark">
        <div className="hero-r" aria-hidden="true" />
        <div className="container" style={{ position: 'relative' }}>
          <div className="section-head">
            <span className="eyebrow">Purificação 3 em 1</span>
            <h2>Um elemento de 114 mm que captura o que os filtros comuns deixam passar.</h2>
          </div>
          <div className="rrr">
            <div><b>&gt; 25 µm</b>Partículas grandes ficam retidas no topo do elemento, o que o torna também uma ferramenta de diagnóstico.</div>
            <div><b>&gt; 15 µm</b>Partículas menores são capturadas na parte superior não comprimida do meio filtrante.</div>
            <div><b>&gt; 1 µm</b>Micropartículas, água, borra e verniz ficam na parte inferior comprimida. O óleo sai com menos de 100 ppm de água.</div>
          </div>
          <div className="stats" style={{ marginTop: 48 }}>
            <div><strong><CountUp to={50} prefix="+" /></strong><span>anos de tecnologia</span></div>
            <div><strong><CountUp to={50} prefix="+" /></strong><span>países atendidos</span></div>
            <div><strong><CountUp to={80} suffix="%" /></strong><span>menos custo de manutenção</span></div>
            <div><strong><CountUp to={5} suffix="x" /></strong><span>mais vida útil do óleo</span></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Destaques</span>
            <h2>Equipamentos em destaque</h2>
            <p className="lead" style={{ marginInline: 'auto' }}>Passe o mouse ou toque nos cards para ver o efeito holográfico.</p>
          </div>
          <div className="holo-row">
            {FEATURED.map((f, i) => {
              const m = getModel(f.slug);
              return (
                <Reveal as="figure" key={f.slug} delay={i * 100}>
                  <MachineHolo image={f.image} name={m.name} label={m.seriesTitle} width={280} preset={['rainbow', 'shards', 'glitter'][i]} />
                  <figcaption>
                    <Link href={`/produto/${f.slug}`} style={{ color: 'var(--clear)' }}>Ver {m.name} →</Link>
                  </figcaption>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Soluções</span>
            <h2>Uma solução para cada aplicação</h2>
            <p className="lead">Purificadores by-pass e off-line que se adaptam a máquinas existentes ou são integrados por fabricantes OEM.</p>
          </div>
          <div className="grid-cards">
            {HOME_SERIES.map(slug => {
              const s = series.find(x => x.slug === slug);
              return <ProductCard key={slug} href={`/solucoes/${slug}`} image={seriesCover(s)} title={s.title} text={s.sub} />;
            })}
          </div>
          <div className="row-gap" style={{ marginTop: 32, justifyContent: 'center' }}>
            <Link className="btn btn-primary" href="/solucoes">Ver todas as soluções</Link>
            <a className="btn btn-ghost" href={waCatalog()} target="_blank" rel="noopener">Receber catálogo</a>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container" style={{ position: 'relative' }}>
          <div className="section-head">
            <span className="eyebrow">Setores</span>
            <div className="split-heading h2" role="heading" aria-level={2}>
              <BlurText text="Presente nas indústrias que não podem parar" delay={70} direction="top" />
            </div>
          </div>
        </div>
        <Reveal variant="zoom">
          <SectorCarousel items={sectorItems()} />
        </Reveal>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">FAQ</span>
            <h2>Perguntas frequentes</h2>
          </div>
          <Faq />
        </div>
      </section>
    </>
  );
}
