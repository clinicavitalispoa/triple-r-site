import Link from 'next/link';
import { CatalogButton } from './Catalog';
import { ADDRESS, EMAIL, HOURS, LOGO, WHATSAPP_LABEL, quoteHref, series, wa } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-cta">
        <div>
          <h2>Óleo limpo, resultado garantido.</h2>
          <p>Fale com um especialista e receba a indicação do sistema ideal para a sua operação.</p>
        </div>
        <div className="row-gap">
          <Link className="btn btn-light" href={quoteHref()}>
            Pedir orçamento
          </Link>
          <CatalogButton className="btn btn-ghost-light" />
        </div>
      </div>
      <div className="container footer-grid">
        <div className="footer-brand">
          <span className="logo-plate">
            <img src={LOGO} alt="Triple R" width="176" height="44" loading="lazy" />
          </span>
          <p>Purificação de óleo com tecnologia patenteada em 1967 e fabricada no Japão. Mais de 50 anos de mercado e presença em mais de 50 países.</p>
        </div>
        <div>
          <h3>Soluções</h3>
          <ul className="cols2">
            {series.map(s => (
              <li key={s.slug}>
                <Link href={`/solucoes/${s.slug}`}>{s.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Empresa</h3>
          <ul>
            <li><Link href="/quem-somos">Quem Somos</Link></li>
            <li><Link href="/setores">Setores</Link></li>
            <li><Link href="/beneficios">Benefícios</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/ferramentas">Calculadora</Link></li>
          </ul>
        </div>
        <div>
          <h3>Contato</h3>
          <ul>
            <li><a href={wa('Olá! Vim pelo site da Triple R.')} target="_blank" rel="noopener">WhatsApp {WHATSAPP_LABEL}</a></li>
            <li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
            <li>{ADDRESS}</li>
            {HOURS ? <li>{HOURS}</li> : null}
          </ul>
        </div>
      </div>
      <div className="container footer-legal">
        <span>© {new Date().getFullYear()} Triple R Mercosul. Todos os direitos reservados.</span>
        <span className="row-gap">
          <a href="https://triple-rrr.com.br/wp-content/uploads/2023/09/Guia-de-Conduta-Corporativa_R00-signe.pdf" target="_blank" rel="noopener">Guia de Conduta</a>
          <a href="https://triple-rrr.com.br/wp-content/uploads/2023/09/Politica-de-Sustentabilidade_ESG_R00-signed.pdf" target="_blank" rel="noopener">Política ESG</a>
          <a href="mailto:denuncia@triple-rrr.com.br">Canal de Denúncias</a>
        </span>
      </div>
    </footer>
  );
}
