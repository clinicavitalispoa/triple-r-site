import Image from 'next/image';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { img, wa } from '@/lib/site';

export const metadata = { title: 'Quem Somos', description: 'Conheça a história da Triple R, da patente de 1967 à Triple R Mercosul.' };

const HISTORY = [
  ['1967', 'O Sr. Russo, engenheiro da Ford Motor Co., inventa o primeiro purificador by-pass e registra a patente nos EUA. O objetivo era prolongar a vida útil do óleo do motor em até 100.000 km.'],
  ['1974', 'O Sr. M. Morinaga assume a patente e os direitos de produção e vendas e funda a Triple R Industry Co. em Tochigi, no Japão.'],
  ['2004', 'A Triple R Industry Co. do Japão obtém a certificação ISO 14001.'],
  ['2008', 'Nasce a Triple R Mercosul, em São Paulo, para atender os países da América do Sul.'],
  ['2009', 'A Triple R Industry Co. do Japão obtém a certificação ISO 9001.'],
  ['2013', 'A Triple R amplia sua capacidade com uma nova fábrica de elementos totalmente automatizada.'],
  ['2023', 'A Triple R Mercosul inicia a implementação da ISO 9001 nos processos de comercialização.']
];

export default function QuemSomos() {
  return (
    <>
      <PageHero eyebrow="Quem somos" title="Conheça a Triple R" text="Produzimos sistemas de purificação de alta performance que resolvem problemas de contaminação de óleo. Tecnologia japonesa para otimizar a sua produção." crumbs={[{ label: 'Quem Somos' }]} />
      <section className="section">
        <div className="container split">
          <Reveal>
            <span className="eyebrow">Mais de 50 anos de tradição</span>
            <h2>Muito mais que filtragem: purificação</h2>
            <div className="prose">
              <p>A Triple R nasceu nos EUA, nos anos 1960, com a tecnologia patenteada “RRR – Oil Cleaner”. O objetivo inicial era aumentar a vida útil do óleo do motor em caminhões. Na época, a troca era feita a cada 3.000 km. O primeiro purificador Triple R estendeu esse intervalo para 100.000 km.</p>
              <p>Desde então, o desenvolvimento de soluções é a nossa maior prioridade. Atualizamos continuamente os produtos para entregar óleo com a mais alta qualidade e atender às indústrias em constante mudança. Hoje, os sistemas Triple R são parte fundamental da proteção das máquinas.</p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="media-frame">
              <Image src={img('2023/07/Packshot-Serie-Al100-e-Ws-1024x1024.png')} alt="Purificadores Triple R AL100 e WS" fill sizes="(max-width: 900px) 100vw, 560px" />
            </div>
          </Reveal>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container" style={{ maxWidth: 900 }}>
          <div className="section-head">
            <span className="eyebrow">Jornada de sucesso</span>
            <h2>Nossa história</h2>
          </div>
          <div className="timeline">
            {HISTORY.map(([y, t], i) => (
              <Reveal className="tl-item" key={y} delay={i * 40}>
                <span className="tl-year">{y}</span>
                <p>{t}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--dark">
        <div className="hero-r" aria-hidden="true" />
        <div className="container split" style={{ position: 'relative' }}>
          <div>
            <span className="eyebrow">Dê o próximo passo</span>
            <h2>Mude da filtragem para a limpeza total do óleo.</h2>
            <p style={{ color: 'rgba(255,255,255,0.75)' }}>Nossa engenharia é especialista em resolver problemas de contaminação de óleo, sempre de forma simples e com baixo custo.</p>
          </div>
          <div className="row-gap">
            <a className="btn btn-light" href={wa('Olá! Gostaria de encontrar a solução Triple R ideal para minha operação.')} target="_blank" rel="noopener">Encontre sua solução</a>
          </div>
        </div>
      </section>
    </>
  );
}
