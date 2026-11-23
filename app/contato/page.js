import { CatalogButton } from '@/components/Catalog';
import ContactForm from '@/components/ContactForm';
import PageHero from '@/components/PageHero';
import { ADDRESS, EMAIL, HOURS, WHATSAPP_LABEL, wa } from '@/lib/site';

export const metadata = { title: 'Contato', description: 'Peça um orçamento à Triple R: formulário, e-mail, WhatsApp e endereço em Suzano - SP.' };

const MAP = `https://www.google.com/maps?q=${encodeURIComponent('R. Manoel Teixeira, 31 - Parque Maria Helena, Suzano - SP, 08683-340')}&output=embed`;

export default function Contato() {
  return (
    <>
      <PageHero eyebrow="Contato" title="Fale com a equipe técnica da Triple R" text="Conte qual é a máquina, o tipo e o volume de óleo. Indicamos o sistema certo e enviamos o orçamento." crumbs={[{ label: 'Contato' }]} />
      <section className="section">
        <div className="container split split--top">
          <ContactForm />
          <div className="contact-cards">
            <a className="contact-card" href={`mailto:${EMAIL}`}>
              <span className="ic">@</span>
              <div><b>{EMAIL}</b><span>Orçamentos, compras e suporte</span></div>
            </a>
            <a className="contact-card" href={wa('Olá! Vim pelo site da Triple R.')} target="_blank" rel="noopener">
              <span className="ic" style={{ background: '#25d366' }}>✆</span>
              <div><b>WhatsApp {WHATSAPP_LABEL}</b><span>Atendimento comercial</span></div>
            </a>
            <div className="contact-card">
              <span className="ic">⌖</span>
              <div><b>Endereço</b><span>{ADDRESS}</span>{HOURS ? <span style={{ display: 'block' }}>{HOURS}</span> : null}</div>
            </div>
            <iframe className="map" src={MAP} title="Mapa: Triple R Mercosul em Suzano - SP" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            <div className="contact-card contact-card--catalog">
              <span className="ic">▤</span>
              <div>
                <b>Catálogo completo em PDF</b>
                <span>16 linhas de produto e 79 modelos</span>
              </div>
              <CatalogButton className="btn btn-ghost" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
