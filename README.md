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
