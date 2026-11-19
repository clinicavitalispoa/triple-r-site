import Link from 'next/link';
import { notFound } from 'next/navigation';
import MachineHolo from '@/components/MachineHolo';
import ProductCard from '@/components/ProductCard';
import { getModel, getSeries, models, seriesModels, waCatalog, waQuote } from '@/lib/site';

export function generateStaticParams() {
  return Object.keys(models).map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const m = getModel((await params).slug);
  return m ? { title: m.name, description: m.desc } : {};
}

export default async function Produto({ params }) {
  const m = getModel((await params).slug);
  if (!m) notFound();
  const s = getSeries(m.series);
  const related = seriesModels(s).filter(x => x.slug !== m.slug).slice(0, 4);
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
              <MachineHolo image={m.limg || m.img} name={m.name} label={s.title} width={380} />
              <small>Passe o mouse ou arraste para girar</small>
            </div>
            <div>
              <span className="chip">{s.title}</span>
              <h1 className="product-title">{m.name}</h1>
              <p className="lead">{m.desc}</p>
              <div className="cta-box">
                <a className="btn btn-wa" href={waQuote(m.name)} target="_blank" rel="noopener">Pedir orçamento no WhatsApp</a>
                <a className="btn btn-ghost" href={waCatalog(m.name)} target="_blank" rel="noopener">Receber ficha técnica</a>
              </div>
              {m.sections.length ? (
                <div className="tabs-list">
                  {m.sections.map((sec, i) => (
                    <details key={i} open={i === 0}>
                      <summary>{sec.t}</summary>
                      <ul>
                        {sec.i.map((it, j) => (
                          <li key={j}>{it}</li>
                        ))}
                      </ul>
                    </details>
                  ))}
                </div>
              ) : null}
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
              {m.sel.length ? (
                <>
                  <h2 className="specs-title">Seleção por volume do sistema</h2>
                  <table className="specs">
                    <tbody>
                      {m.sel.map(([k, v], i) => (
                        <tr key={i}>
                          <th scope="row">{k}</th>
                          <td>{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="note" style={{ marginTop: 10 }}>* Os critérios de seleção podem variar conforme o ambiente da máquina, o tipo de óleo e as condições de operação.</p>
                </>
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
                <ProductCard key={r.slug} href={`/produto/${r.slug}`} image={r.limg || r.img} title={r.name} kicker={s.title} cta="Ver especificações" />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
