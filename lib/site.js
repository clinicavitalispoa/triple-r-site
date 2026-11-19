import seriesData from './data/series.json';
import modelsA from './data/models-a.json';
import modelsB from './data/models-b.json';
import sectorsData from './data/sectors.json';
import sectionsData from './data/sections.json';

const data = { series: seriesData.series, texts: seriesData.texts, models: { ...modelsA, ...modelsB }, sectors: sectorsData, sections: sectionsData };

export const WHATSAPP = '5511945175543';
export const WHATSAPP_LABEL = '(11) 94517-5543';
export const EMAIL = 'contato@triple-rrr.com.br';
export const ADDRESS = 'R. Manoel Teixeira, 31 - Parque Maria Helena, Suzano - SP, 08683-340';
export const UPLOADS = process.env.NEXT_PUBLIC_UPLOADS || 'https://triple-rrr.com.br/wp-content/uploads/';
export const LOGO = UPLOADS + '2023/06/mark_horizon_color.png';

export const wa = text => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
export const waQuote = name => wa(`Olá! Vim pelo site e gostaria de um orçamento para: ${name}.`);
export const waCatalog = (name = '') =>
  wa(name ? `Olá! Gostaria de receber o catálogo / ficha técnica do ${name}.` : 'Olá! Gostaria de receber o catálogo de produtos Triple R.');

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

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Quem Somos', href: '/quem-somos' },
  { label: 'Soluções', href: '/solucoes' },
  { label: 'Setores', href: '/setores' },
  { label: 'Benefícios', href: '/beneficios' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contato', href: '/contato' }
];
