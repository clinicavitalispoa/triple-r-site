import Link from 'next/link';
import AnimatedWords from '@/components/AnimatedWords';
import { CatalogButton } from '@/components/Catalog';
import CountUp from '@/components/CountUp';
import Faq from '@/components/Faq';
import Machine3D from '@/components/Machine3D';
import MachineHolo from '@/components/MachineHolo';
import ProductCard from '@/components/ProductCard';
import Reveal from '@/components/Reveal';
import SectorCarousel from '@/components/SectorCarousel';
import { SERIES_META } from '@/lib/catalog';
import { HOME_SECTORS } from '@/lib/sectors';
import { getModel, img, productHref, quoteHref, sectorItems, series, seriesCover } from '@/lib/site';

const CLIENTS = ['General-Motors', 'KLM-Royal-Dutch-Airlines', 'Hyundai', 'Mercedes-Benz', 'Coca-cola', 'AGFA', 'Ford', 'Rolls-Royce-1', 'Nissan', 'Esso', 'General-Electric', 'Usiminas', 'Biosev', 'Raizen', 'CSN'];

const FEATURED = [
  { slug: 'se100-st', image: '2023/08/SE100-ST.png' },
  { slug: 'trvs-30e', image: '2023/08/TRVS-30E.png' },
  { slug: 'al100', image: '2023/09/AL100_2.png' }
];

const HOME_SERIES = ['serie-bu', 'serie-se', 'serie-osca', 'desidratador-a-vacuo-termovacuo', 'serie-tr', 'elementos-filtrantes'];

// Texts as published on the current site; confirm company/role with the client before launch.
const TESTIMONIALS = [
  { name: 'Marco Carlota', photo: '2023/07/Marco-Carlota-1.webp', text: 'Empresa com 12 anos de mercado. Qualidade no atendimento e nos produtos. Comprometimento com a satisfação dos clientes.' },
  { name: 'Bruno Rodrigo', photo: '2023/07/Bruno-Rodrigo.webp', text: 'Super indico, pois entregou tudo que foi solicitado. Além disso, rendeu-me muita produtividade, custo-benefício e valorização para com o meio ambiente.' }
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <span className="hero-orb hero-orb--a" aria-hidden="true" />
        <span className="hero-orb hero-orb--b" aria-hidden="true" />
        <div className="hero-r" aria-hidden="true" />
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Patente desde 1967 · fabricação japonesa</span>
            <h1 className="hero-title">
              <AnimatedWords text="Óleo limpo é" delay={110} />{' '}
              <AnimatedWords text="máquina produzindo." className="accent" delay={110} start={330} />
            </h1>
            <p className="lead">Os purificadores Triple R removem partículas de até 1 mícron, água, borra e verniz em um único elemento. Menos paradas e óleo que dura até 5 vezes mais.</p>
            <ul className="hero-badges">
              <li>Patente original RRR</li>
              <li>+50 países</li>
              <li>+100.000 instalações</li>
            </ul>
            <div className="row-gap">
              <Link className="btn btn-clear" href={quoteHref()}>Pedir orçamento</Link>
              <CatalogButton className="btn btn-ghost-light" />
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

      <section className="section section--dark">
        <div className="hero-r" aria-hidden="true" />
        <div className="container" style={{ position: 'relative' }}>
          <div className="split split--top">
            <Reveal variant="left">
              <span className="eyebrow">Quem somos · purificação 3 em 1</span>
              <h2>
                <AnimatedWords text="Muito mais que filtragem: purificação." onView />
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: '1.08rem' }}>
                Há mais de 50 anos a tecnologia Triple R estende a vida do óleo e reduz paradas por contaminação. O óleo atravessa 114 mm de celulose especial, que retém partículas, água, borra e verniz no mesmo elemento.
              </p>
              <Link className="btn btn-ghost-light" href="/quem-somos" style={{ marginTop: 10 }}>Conheça a Triple R</Link>
            </Reveal>
            <Reveal variant="right" delay={120}>
              <div className="rrr rrr--stack">
                <div><b>&gt; 25 µm</b>Partículas grandes ficam no topo do elemento, que vira também ferramenta de diagnóstico.</div>
                <div><b>&gt; 15 µm</b>Partículas menores são capturadas na parte superior do meio filtrante.</div>
                <div><b>&gt; 1 µm</b>Micropartículas, água, borra e verniz ficam na parte inferior comprimida.</div>
              </div>
            </Reveal>
          </div>
          <div className="stats" style={{ marginTop: 48 }}>
            <div><strong><CountUp to={50} prefix="+" /></strong><span>anos de tecnologia</span></div>
            <div><strong><CountUp to={50} prefix="+" /></strong><span>países atendidos</span></div>
            <div><strong><CountUp to={80} prefix="até " suffix="%" /></strong><span>menos custo de manutenção*</span></div>
            <div><strong><CountUp to={5} prefix="até " suffix="x" /></strong><span>mais vida útil do óleo*</span></div>
          </div>
          <p className="facts__src">* Segundo dados do fabricante (Triple R).</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Soluções</span>
            <h2>Uma solução para cada aplicação</h2>
          </div>
          <div className="grid-cards">
            {HOME_SERIES.map(slug => {
              const s = series.find(x => x.slug === slug);
              const meta = SERIES_META[slug];
              return <ProductCard key={slug} href={`/solucoes/${slug}`} image={seriesCover(s)} title={s.title} text={meta.line} badge={meta.volume !== 'Consulte' ? meta.volume : null} />;
            })}
          </div>
          <div className="row-gap" style={{ marginTop: 32, justifyContent: 'center' }}>
            <Link className="btn btn-primary" href="/solucoes">Ver todas as 16 linhas</Link>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Destaques</span>
            <h2>Equipamentos em destaque</h2>
          </div>
          <div className="holo-row">
            {FEATURED.map((f, i) => {
              const m = getModel(f.slug);
              return (
                <Reveal as="figure" key={f.slug} delay={i * 100}>
                  <MachineHolo image={f.image} name={m.name} label={m.seriesTitle} width={280} preset={['rainbow', 'shards', 'glitter'][i]} />
                  <figcaption>
                    <Link href={productHref(f.slug)} style={{ color: 'var(--clear)' }}>Ver {m.name} →</Link>
                  </figcaption>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container" style={{ position: 'relative' }}>
          <div className="section-head">
            <span className="eyebrow">Setores</span>
            <h2>
              <AnimatedWords text="Presente nas indústrias que não podem parar" onView />
            </h2>
          </div>
        </div>
        <Reveal variant="zoom">
          <SectorCarousel items={sectorItems(HOME_SECTORS)} />
        </Reveal>
        <div className="row-gap" style={{ justifyContent: 'center', marginTop: 28 }}>
          <Link className="btn btn-ghost-light" href="/setores">Ver todos os 11 setores</Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Depoimentos</span>
            <h2>Quem usa, recomenda</h2>
          </div>
          <div className="testimonials">
            {TESTIMONIALS.map((t, i) => (
              <Reveal as="figure" className="testimonial" key={t.name} delay={i * 100}>
                <blockquote>“{t.text}”</blockquote>
                <figcaption>
                  <img src={img(t.photo)} alt="" width="48" height="48" loading="lazy" />
                  <span><b>{t.name}</b><span className="stars" aria-label="Avaliação 5 de 5">★★★★★</span></span>
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
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
