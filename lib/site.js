import seriesData from './data/series.json';
import modelsA from './data/models-a.json';
import modelsB from './data/models-b.json';
import sectorsData from './data/sectors.json';
import sectionsData from './data/sections.json';
import { SECTORS } from './sectors';
import cards from './data/cards.json';

const data = { series: seriesData.series, texts: seriesData.texts, models: { ...modelsA, ...modelsB }, sectors: sectorsData, sections: sectionsData };

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://triple-rrr.com.br').replace(/\/$/, '');
// Search engines index the site only when SITE_INDEXABLE=1 is set (production domain).
export const INDEXABLE = process.env.SITE_INDEXABLE === '1';

export const WHATSAPP = '5511945175543';
export const WHATSAPP_LABEL = '(11) 94517-5543';
export const EMAIL = 'contato@triple-rrr.com.br';
export const ADDRESS = 'R. Manoel Teixeira, 31 - Parque Maria Helena, Suzano - SP, 08683-340';
export const UPLOADS = process.env.NEXT_PUBLIC_UPLOADS || 'https://triple-rrr.com.br/wp-content/uploads/';
export const LOGO = UPLOADS + '2023/06/mark_horizon_color.png';

export const CATALOG_PDF = '/pdf/catalogo-triple-r.pdf';
export const HOURS = process.env.NEXT_PUBLIC_HOURS || '';
export const fichaPdf = slug => `/pdf/fichas/${slug}.pdf`;
export const quoteHref = product => (product ? `/contato?produto=${encodeURIComponent(product)}#orcamento` : '/contato#orcamento');
export const productHref = (slug, seriesSlug) => `/solucoes/${seriesSlug || models[slug]?.series}/${slug}`;

export const wa = text => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

// normalized product photo (transparent, trimmed, same size) when available
export const cardImg = path => cards[path] || img(path);

export const img = path => (path ? (path.startsWith('http') ? path : UPLOADS + path) : null);
// same-origin optimized image (needed for WebGL textures in HoloCard)
export const proxied = (path, w = 640) => `/_next/image?url=${encodeURIComponent(img(path))}&w=${w}&q=80`;

export const { series, models, sectors } = data;
const sections = data.sections;
const texts = data.texts;

export const getSeries = slug => series.find(s => s.slug === slug);
export const getModel = slug => {
  const m = models[slug];
  if (!m) return null;
  const s = getSeries(m.series);
  return { ...m, slug, desc: texts[m.desc], sections: (s.sets[m.set] || []).map(i => sections[i]), seriesTitle: s.title };
};
export const seriesModels = s => s.groups.flatMap(g => g.m).map(getModel).filter(Boolean);
export const seriesCover = s => s.img || getModel(s.groups[0]?.m[0])?.img;
export const getSector = slug => sectors.find(s => s.slug === slug);

export const SECTOR_SHORT = {
  'injetoras-de-plastico': 'Injetoras de Plástico',
  'fabricantes-de-automoveis': 'Automotivo',
  'setor-sucroenergetico': 'Sucroenergético',
  'industria-de-papel-e-celulose': 'Papel e Celulose',
  'energia-eolica': 'Energia Eólica',
  maritimo: 'Marítimo',
  transporte: 'Transporte',
  petroquimica: 'Petroquímica',
  'extrusao-de-aluminio': 'Extrusão de Alumínio',
  'maquinas-de-construcao': 'Máquinas de Construção',
  'prestadores-de-servicos-de-filtragem-de-oleo': 'Prestadores de Serviço'
};

export const SECTOR_IMG = {
  'injetoras-de-plastico': '2023/07/Injetoras-de-Plastico.webp',
  'fabricantes-de-automoveis': '2023/07/Fabricantes-de-Automoveis.webp',
  'setor-sucroenergetico': '2023/07/Setor-Sucroenergetico.webp',
  'industria-de-papel-e-celulose': '2023/07/Industria-de-Papel-e-Celulose.webp',
  'energia-eolica': '2023/07/Energia-Eolica.webp',
  maritimo: '2023/07/Maritimo.webp',
  transporte: '2023/07/Transporte.webp',
  petroquimica: '2023/07/Petroquimica.webp',
  'extrusao-de-aluminio': '2023/07/Extrusao-de-Aluminio.webp',
  'maquinas-de-construcao': '2023/07/Maquinas-de-Construcao.webp',
  'prestadores-de-servicos-de-filtragem-de-oleo': '2023/07/Prestadores-de-Servicos-de-Filtragem-de-Oleo.webp'
};

export { model3d } from './models3d';

export const sectorItems = (only = null) =>
  SECTORS.filter(s => !only || only.includes(s.slug)).map(s => ({
    href: `/setores/${s.slug}`,
    title: s.nome,
    text: s.chamada,
    image: proxied(SECTOR_IMG[s.slug], 1080)
  }));

export const getSectorShort = slug => SECTORS.find(s => s.slug === slug);
export const sectorProducts = sector =>
  sector.produtos.map(slug => {
    const x = getSeries(slug);
    return { href: `/solucoes/${slug}`, title: x.title, text: x.sub, image: seriesCover(x) };
  });
export { SECTORS };

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Quem Somos', href: '/quem-somos' },
  { label: 'Soluções', href: '/solucoes' },
  { label: 'Setores', href: '/setores' },
  { label: 'Benefícios', href: '/beneficios' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contato', href: '/contato' }
];
