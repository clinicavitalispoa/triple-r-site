import Link from 'next/link';
import { notFound } from 'next/navigation';
import Icon from '@/components/Icon';
import Machine3D from '@/components/Machine3D';
import MachineHolo from '@/components/MachineHolo';
import ProductCard from '@/components/ProductCard';
import { SERIES_META } from '@/lib/catalog';
import { MODELS_3D, fichaPdf, getModel, getSeries, models, productHref, quoteHref, seriesModels } from '@/lib/site';

export function generateStaticParams() {
  return Object.entries(models).map(([modelo, m]) => ({ serie: m.series, modelo }));
}

export async function generateMetadata({ params }) {
  const { modelo } = await params;
  const m = getModel(modelo);
  return m ? { title: `${m.name} | ${m.seriesTitle}`, description: m.desc, alternates: { canonical: productHref(modelo) } } : {};
}

const isVolume = v => /\d\s?L\b/.test(v);

export default async function Produto({ params }) {
  const { serie, modelo } = await params;
  const m = getModel(modelo);
  if (!m || m.series !== serie) notFound();
  const s = getSeries(m.series);
  const meta = SERIES_META[s.slug];
  const related = seriesModels(s).filter(x => x.slug !== m.slug).slice(0, 4);
  const volumes = m.sel.filter(([, v]) => isVolume(v));
  const notes = m.sel.filter(([, v]) => !isVolume(v));
  return (
    <>
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <nav className="crumbs" style={{ color: 'var(--muted)' }} aria-label="Você está em">
            <Link href="/">Home</Link> <span aria-hidden="true">/</span> <Link href="/solucoes">Soluções</Link> <span aria-hidden="true">/</span>
            <Link href={`/solucoes/${s.slug}`}>{s.title}</Link> <span aria-hidden="true">/</span> <span>{m.name}</span>
          </nav>
          <div className="product-top">
            <div className="product-top__card">
              {MODELS_3D[m.slug] ? (
                <div style={{ position: 'relative', width: '100%' }}>
                  <span className="badge-3d">3D</span>
                  <Machine3D url={MODELS_3D[m.slug]} height={480} label={`Modelo 3D do ${m.name}`} />
                </div>
              ) : (
                <>
                  <MachineHolo image={m.limg || m.img} name={m.name} label={s.title} width={380} />
                  <small>Passe o mouse ou arraste para girar</small>
                </>
              )}
            </div>
            <div>
              <Link className="chip" href={`/solucoes/${s.slug}`}>{s.title}</Link>
              <h1 className="product-title">{m.name}</h1>
              <p className="lead">{m.desc}</p>
              <ul className="highlights">
                {meta.highlights.map(([icon, text]) => (
                  <li key={text}>
                    <span className="highlights__ic"><Icon name={icon} /></span>
                    {text}
                  </li>
                ))}
              </ul>
              <div className="cta-box">
                <Link className="btn btn-primary" href={quoteHref(m.name)}>Pedir orçamento</Link>
                <a className="btn btn-ghost" href={fichaPdf(m.slug)} download>Baixar ficha técnica (PDF)</a>
              </div>
              {m.specs.length ? (
                <>
                  <h2 className="specs-title">Especificações técnicas</h2>
                  <table className="specs">
                    <tbody>
                      {m.specs.map(([k, v], i) => (
                        <tr key={i}>
                          <th scope="row">{k}</th>
                          <td>{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : null}
              {volumes.length ? (
                <>
                  <h2 className="specs-title">Seleção por volume do sistema</h2>
                  <table className="specs">
                    <thead>
                      <tr>
                        <th scope="col">Modelo</th>
                        <th scope="col">Volume máximo do sistema</th>
                      </tr>
                    </thead>
                    <tbody>
                      {volumes.map(([k, v], i) => (
                        <tr key={i}>
                          <th scope="row">{k}</th>
                          <td>{v.replace(/\s*\|\s*/g, ' / ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="note" style={{ marginTop: 10 }}>Os critérios de seleção podem variar conforme o ambiente da máquina, o tipo de óleo e as condições de operação.</p>
                </>
              ) : null}
              {notes.map(([k, v]) => (
                <div className="spec-note" key={k}>
                  <b>{k.charAt(0) + k.slice(1).toLowerCase()}</b>
                  <p>{v}</p>
                </div>
              ))}
              {m.sections.length ? (
                <details className="more">
                  <summary>Descrição técnica completa</summary>
                  {m.sections.map((sec, i) => (
                    <div key={i}>
                      <h3>{sec.t}</h3>
                      <ul>
                        {sec.i.map((it, j) => (
                          <li key={j}>{it}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </details>
              ) : null}
            </div>
          </div>
        </div>
      </section>
      {related.length ? (
        <section className="section section--soft">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Mesma linha</span>
              <h2>Outros modelos {s.title}</h2>
            </div>
            <div className="grid-cards">
              {related.map(r => (
                <ProductCard key={r.slug} href={productHref(r.slug, s.slug)} image={r.limg || r.img} title={r.name} kicker={s.title} cta="Ver especificações" />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
