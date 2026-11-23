import { SITE_URL, models, sectors, series } from '@/lib/site';

export default function sitemap() {
  const pages = ['', '/quem-somos', '/solucoes', '/setores', '/beneficios', '/blog', '/contato', '/ferramentas'];
  return [
    ...pages.map(p => ({ url: `${SITE_URL}${p}` })),
    ...series.map(s => ({ url: `${SITE_URL}/solucoes/${s.slug}` })),
    ...Object.entries(models).map(([slug, m]) => ({ url: `${SITE_URL}/solucoes/${m.series}/${slug}` })),
    ...sectors.map(s => ({ url: `${SITE_URL}/setores/${s.slug}` }))
  ];
}
