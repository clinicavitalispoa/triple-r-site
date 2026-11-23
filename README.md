# Triple R — novo site (prévia)

Site institucional e catálogo da Triple R em Next.js 15, com componentes do [React Bits](https://reactbits.dev) (Gooey Nav, Holo Card, Spotlight Card).

## Rodar localmente

```bash
npm install
npm run dev
```

## Estrutura

- `app/` — páginas (home, soluções, séries, produtos, setores, quem somos, benefícios, blog, contato, ferramentas)
- `components/` — componentes do site; `components/reactbits/` é baixado do registro do React Bits no `prebuild` (`scripts/fetch-reactbits.mjs`), com uma cópia local de fallback
- `lib/data/` — conteúdo de séries, modelos, especificações e setores extraído do site atual
- `lib/site.js` — contatos (WhatsApp, e-mail, endereço), menu e helpers

As imagens são carregadas de `triple-rrr.com.br/wp-content/uploads` pelo otimizador de imagens do Next.js.

## Deploy

Na Vercel: importe o repositório (framework Next.js, sem configuração extra).

## Variáveis de ambiente (Vercel → Settings → Environment Variables)

| Variável | Para quê |
|---|---|
| `SITE_INDEXABLE=1` | Libera a indexação pelo Google (sem ela o site sai com `noindex` e o `robots.txt` bloqueia tudo). Use só no domínio definitivo. |
| `NEXT_PUBLIC_SITE_URL` | Domínio oficial usado no sitemap e nos links canônicos (padrão: `https://triple-rrr.com.br`). |
| `LEAD_WEBHOOK_URL` | Recebe cada lead (orçamento e download do catálogo) em JSON: Make, Zapier, n8n, Google Apps Script ou CRM. |
| `RESEND_API_KEY` + `LEAD_TO_EMAIL` | Envia cada lead por e-mail pelo resend.com. `LEAD_FROM_EMAIL` define o remetente (domínio verificado). |
| `NEXT_PUBLIC_HOURS` | Horário de atendimento exibido no Contato e no rodapé. |

Sem `LEAD_WEBHOOK_URL` nem `RESEND_API_KEY`, o formulário oferece enviar o pedido por e-mail ou WhatsApp.

## Scripts

- `scripts/fetch-reactbits.mjs` (prebuild): baixa os componentes do React Bits e aplica os ajustes do projeto.
- `scripts/build-pdfs.mjs` (prebuild): gera `public/pdf/catalogo-triple-r.pdf` e as fichas técnicas `public/pdf/fichas/<modelo>.pdf`.
- `scripts/build-bu100e-model.mjs`: gera o modelo 3D `public/models/bu100e.glb` (rodar só quando mudar o modelo).
- `scripts/fix-data-text.mjs`: correções de texto e unidades nos dados extraídos do site antigo.
