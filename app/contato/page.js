import ContactForm from '@/components/ContactForm';
import PageHero from '@/components/PageHero';
import { ADDRESS, EMAIL, WHATSAPP_LABEL, wa, waCatalog } from '@/lib/site';

export const metadata = { title: 'Contato', description: 'Fale com a Triple R: orçamento, catálogo e suporte técnico.' };

export default function Contato() {
  return (
    <>
      <PageHero eyebrow="Contato" title="Fale com quem entende de óleo limpo" text="Nossa equipe ajuda a sua empresa a melhorar a qualidade do óleo, aumentar a vida útil dos equipamentos e reduzir os custos de manutenção." crumbs={[{ label: 'Contato' }]} />
      <section className="section">
        <div className="container split split--top">
          <div className="contact-cards">
            <a className="contact-card" href={wa('Olá! Vim pelo site da Triple R e gostaria de um orçamento.')} target="_blank" rel="noopener">
              <span className="ic" style={{ background: '#25d366' }}>✆</span>
              <div><b>WhatsApp · {WHATSAPP_LABEL}</b><span>Orçamentos e atendimento comercial</span></div>
            </a>
            <a className="contact-card" href={waCatalog()} target="_blank" rel="noopener">
              <span className="ic">▤</span>
              <div><b>Receber catálogo</b><span>Linha completa e fichas técnicas</span></div>
            </a>
            <a className="contact-card" href={`mailto:${EMAIL}`}>
              <span className="ic">@</span>
              <div><b>{EMAIL}</b><span>Resposta em horário comercial</span></div>
            </a>
            <a className="contact-card" href="https://maps.google.com/?q=R.+Manoel+Teixeira,+31+-+Suzano+-+SP" target="_blank" rel="noopener">
              <span className="ic">⌖</span>
              <div><b>Endereço</b><span>{ADDRESS}</span></div>
            </a>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
