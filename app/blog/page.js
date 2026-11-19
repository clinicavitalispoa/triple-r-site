import Image from 'next/image';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import posts from '@/lib/posts.json';
import { img } from '@/lib/site';

export const metadata = { title: 'Blog', description: 'Conteúdos sobre purificação de óleo, normas de limpeza, verniz e manutenção.' };

const fmt = d => new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

export default function Blog() {
  return (
    <>
      <PageHero eyebrow="Blog" title="Conhecimento sobre óleo limpo" text="Normas, estudos de caso e boas práticas de manutenção para aumentar a vida útil dos seus equipamentos." crumbs={[{ label: 'Blog' }]} />
      <section className="section section--soft">
        <div className="container grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {posts.map((p, i) => (
            <Reveal key={p.u} delay={(i % 3) * 80}>
              <a className="post" href={p.u} target="_blank" rel="noopener">
                <div className="post__img">{p.i ? <Image src={img(p.i)} alt="" fill sizes="(max-width: 700px) 100vw, 380px" /> : null}</div>
                <div className="post__body">
                  <time dateTime={p.d}>{fmt(p.d)}</time>
                  <h3>{p.t}</h3>
                  {p.e ? <p className="note" style={{ margin: 0 }}>{p.e}</p> : null}
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
