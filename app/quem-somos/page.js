import Image from 'next/image';
import Link from 'next/link';
import { CatalogButton } from '@/components/Catalog';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import Timeline from '@/components/Timeline';
import { img, proxied, quoteHref } from '@/lib/site';

export const metadata = { title: 'Quem Somos', description: 'Inventada nos EUA em 1967 e desenvolvida no Japão desde 1974: a história da Triple R e da Triple R Mercosul.' };

const HISTORY = [
  { year: '1967', image: '2023/10/1967-1.png', text: 'Nos EUA, um engenheiro da Ford Motor Company inventa o primeiro purificador by-pass e patenteia a tecnologia “RRR – Oil Cleaner”. O objetivo: estender a troca de óleo de motor de 3.000 km para 100.000 km.' },
  { year: '1974', image: '2023/10/1974-scaled.jpg', text: 'A patente e os direitos de produção vão para o Japão, onde é fundada a Triple R Industry Co., em Tochigi. Desde então, a tecnologia é desenvolvida e fabricada lá, com certificações ISO 14001 (2004) e ISO 9001 (2009).' },
  { year: '2008', image: '2023/10/2008-scaled.jpg', text: 'Nasce a Triple R Mercosul, em São Paulo, para atender os países da América do Sul.' },
  { year: '2013', image: '2023/09/QuemSomos-2013.png', text: 'A fábrica japonesa ganha uma linha de elementos totalmente automatizada. Em 2023, a Triple R Mercosul inicia a implementação da ISO 9001 na comercialização.' }
];

export default function QuemSomos() {
  return (
    <>
      <PageHero eyebrow="Quem somos" title="Inventada nos EUA, aperfeiçoada no Japão" text="Há mais de 50 anos a Triple R fabrica purificadores de óleo de alta performance. No Brasil, a Triple R Mercosul atende toda a América do Sul." crumbs={[{ label: 'Quem Somos' }]}>
        <div className="row-gap" style={{ marginTop: 28 }}>
          <Link className="btn btn-clear" href={quoteHref()}>Pedir orçamento</Link>
          <CatalogButton className="btn btn-ghost-light" />
        </div>
      </PageHero>
      <section className="section">
        <div className="container split">
          <Reveal variant="left">
            <span className="eyebrow">Muito mais que filtragem</span>
            <h2>Purificação: partículas, água, borra e verniz num só elemento</h2>
            <p className="lead">Desde o início, a prioridade é desenvolver soluções. Os produtos são atualizados continuamente para atender indústrias em constante mudança, e hoje os sistemas Triple R protegem máquinas em mais de 50 países.</p>
          </Reveal>
          <Reveal delay={120} variant="right">
            <div className="media-frame media-frame--glow float-y">
              <Image src={img('2023/07/Packshot-Serie-Al100-e-Ws-1024x1024.png')} alt="Purificadores Triple R AL100 e WS" fill sizes="(max-width: 900px) 100vw, 560px" />
            </div>
          </Reveal>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container" style={{ maxWidth: 1040 }}>
          <div className="section-head center">
            <span className="eyebrow">Jornada de sucesso</span>
            <h2>Nossa história em 4 marcos</h2>
          </div>
          <Timeline items={HISTORY.map(h => ({ ...h, image: proxied(h.image, 750) }))} />
        </div>
      </section>
    </>
  );
}
