// Generates the downloadable PDFs from the site data:
//   public/pdf/catalogo-triple-r.pdf   - full catalogue (one page per product line)
//   public/pdf/fichas/<model>.pdf      - technical sheet for each model
// Runs before `next build` (see package.json "prebuild"). Images come from triple-rrr.com.br;
// if a download fails the PDF is still produced without that picture.
import { mkdir, readFile, readdir } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import PDFDocument from 'pdfkit';
import sharp from 'sharp';

const require = createRequire(import.meta.url);
const ROOT = process.cwd();
const OUT = join(ROOT, 'public', 'pdf');
const UPLOADS = 'https://triple-rrr.com.br/wp-content/uploads/';
const CONTACT = {
  site: 'triple-rrr.com.br',
  email: 'contato@triple-rrr.com.br',
  phone: '+55 (11) 94517-5543',
  address: 'R. Manoel Teixeira, 31 - Parque Maria Helena, Suzano - SP, 08683-340'
};
const C = { deep: '#080059', clear: '#0086D1', ink: '#1c1c33', muted: '#5b5b74', line: '#dfe3ee', soft: '#f4f6fb' };

const font = (pkg, file) => require.resolve(`@fontsource/${pkg}/files/${file}`);
const FONTS = {
  body: font('manrope', 'manrope-latin-400-normal.woff'),
  bodyBold: font('manrope', 'manrope-latin-700-normal.woff'),
  head: font('plus-jakarta-sans', 'plus-jakarta-sans-latin-800-normal.woff'),
  headSemi: font('plus-jakarta-sans', 'plus-jakarta-sans-latin-700-normal.woff')
};

// characters the latin font subset cannot draw
const clean = t =>
  String(t ?? '')
    .replace(/[βß](?=\s?\d)/g, 'beta ')
    .replace(/[ΔΔ]P/g, 'delta P')
    .replace(/[Δ∆]/g, 'delta ')
    .replace(/[µμ]/g, 'µ')
    .replace(/[“”]/g, '"')
    .replace(/[’‘]/g, "'")
    .replace(/–|—/g, '-')
    .replace(/≥/g, '>=')
    .replace(/≤/g, '<=');

const load = async name => JSON.parse(await readFile(join(ROOT, 'lib', 'data', name), 'utf8'));
const seriesData = await load('series.json');
const models = { ...(await load('models-a.json')), ...(await load('models-b.json')) };
const sections = await load('sections.json');
const { series, texts } = seriesData;

const cache = new Map();
async function image(path, width = 700, png = false) {
  if (!path) return null;
  const key = `${path}|${width}|${png}`;
  if (cache.has(key)) return cache.get(key);
  const job = (async () => {
    try {
      const res = await fetch(path.startsWith('http') ? path : UPLOADS + path, { signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      return await sharp(buf).resize({ width, withoutEnlargement: true }).flatten({ background: png ? '#ffffff' : '#f4f6fb' })[png ? 'png' : 'jpeg'](png ? {} : { quality: 80, mozjpeg: true }).toBuffer();
    } catch (err) {
      console.warn(`[pdf] image skipped (${path}): ${err.message}`);
      return null;
    }
  })();
  cache.set(key, job);
  return job;
}

function newDoc(file, title) {
  const doc = new PDFDocument({ size: 'A4', margin: 48, info: { Title: title, Author: 'Triple R', Subject: title }, autoFirstPage: false });
  doc.registerFont('body', FONTS.body);
  doc.registerFont('bodyBold', FONTS.bodyBold);
  doc.registerFont('head', FONTS.head);
  doc.registerFont('headSemi', FONTS.headSemi);
  const done = new Promise((resolve, reject) => {
    const ws = createWriteStream(file);
    ws.on('finish', resolve);
    ws.on('error', reject);
    doc.pipe(ws);
  });
  return { doc, done };
}

function header(doc, logo, label) {
  const W = doc.page.width;
  doc.rect(0, 0, W, 78).fill('#ffffff');
  if (logo) doc.image(logo, 48, 22, { height: 34 });
  else doc.font('head').fontSize(20).fillColor(C.deep).text('Triple R', 48, 26);
  doc.font('bodyBold').fontSize(9).fillColor(C.clear).text(label.toUpperCase(), 48, 34, { width: W - 96, align: 'right', characterSpacing: 1 });
  doc.rect(0, 78, W, 3).fill(C.deep);
}

function footer(doc) {
  const W = doc.page.width;
  const H = doc.page.height;
  doc.page.margins.bottom = 0; // writing inside the bottom margin must not trigger a new page
  doc.rect(0, H - 54, W, 54).fill(C.deep);
  doc
    .font('body')
    .fontSize(8.5)
    .fillColor('#ffffff')
    .text(`${CONTACT.site}   ·   ${CONTACT.email}   ·   ${CONTACT.phone}`, 48, H - 40, { width: W - 96, align: 'center', lineBreak: false })
    .fillColor('#b9c4ff')
    .text(CONTACT.address, 48, H - 26, { width: W - 96, align: 'center', lineBreak: false });
}

function table(doc, rows, x, y, w, opts = {}) {
  const kw = opts.keyWidth ?? w * 0.38;
  if (opts.head) {
    doc.rect(x, y, w, 22).fill(C.deep);
    doc.font('bodyBold').fontSize(9).fillColor('#ffffff');
    doc.text(clean(opts.head[0]), x + 10, y + 6.5, { width: kw - 16 });
    doc.text(clean(opts.head[1]), x + kw + 6, y + 6.5, { width: w - kw - 16 });
    y += 22;
  }
  rows.forEach(([k, v], i) => {
    doc.font('body').fontSize(9.5);
    const hv = doc.heightOfString(clean(v), { width: w - kw - 16 });
    doc.font('bodyBold');
    const hk = doc.heightOfString(clean(k), { width: kw - 16 });
    const h = Math.max(hv, hk) + 10;
    if (y + h > doc.page.height - 80) return;
    doc.rect(x, y, w, h).fill(i % 2 ? '#ffffff' : C.soft);
    doc.fillColor(C.deep).text(clean(k), x + 10, y + 5, { width: kw - 16 });
    doc.font('body').fillColor(C.ink).text(clean(v), x + kw + 6, y + 5, { width: w - kw - 16 });
    y += h;
  });
  return y;
}

const volumeRows = sel => sel.filter(([, v]) => /\d\s?L\b/.test(v));
const highlights = m => {
  const secs = (seriesById[m.series].sets[m.set] || []).map(i => sections[i]);
  const first = secs.find(s => /caracter/i.test(s.t)) || secs[0];
  return (first?.i || []).slice(0, 4);
};
const seriesById = Object.fromEntries(series.map(s => [s.slug, s]));

async function ficha(slug, m, logo) {
  const s = seriesById[m.series];
  const file = join(OUT, 'fichas', `${slug}.pdf`);
  const { doc, done } = newDoc(file, `Ficha técnica ${m.name} - Triple R`);
  doc.addPage();
  header(doc, logo, 'Ficha técnica');
  const W = doc.page.width;
  const pic = await image(m.limg || m.img, 640);
  const textW = pic ? 290 : W - 96;
  const tall = m.specs.length > 12;
  let y = 108;
  doc.font('bodyBold').fontSize(9).fillColor(C.clear).text(clean(s.title).toUpperCase(), 48, y, { characterSpacing: 1 });
  doc.font('head').fontSize(30).fillColor(C.deep).text(clean(m.name), 48, y + 14, { width: textW });
  y = doc.y + 8;
  doc.font('body').fontSize(10.5).fillColor(C.muted).text(clean(texts[m.desc]), 48, y, { width: textW, lineGap: 2 });
  y = doc.y + 14;
  const hl = highlights(m);
  if (hl.length) {
    doc.font('headSemi').fontSize(11).fillColor(C.deep).text('Destaques', 48, y);
    y = doc.y + 6;
    for (const h of hl) {
      doc.circle(53, y + 6, 2.6).fill(C.clear);
      doc.font('body').fontSize(9.5).fillColor(C.ink).text(clean(h).replace(/;$/, '.'), 62, y, { width: textW - 14, lineGap: 1 });
      y = doc.y + 5;
    }
  }
  if (pic) {
    const ph = tall ? 200 : 240;
    doc.roundedRect(360, 104, W - 408, ph, 14).fill(C.soft);
    doc.image(pic, 372, 114, { fit: [W - 432, ph - 20], align: 'center', valign: 'center' });
    y = Math.max(y, 104 + ph + 12);
  }
  y += 10;
  if (m.specs.length) {
    doc.font('headSemi').fontSize(13).fillColor(C.deep).text('Especificações técnicas', 48, y);
    y = table(doc, m.specs, 48, doc.y + 8, W - 96) + 12;
  }
  const vol = volumeRows(m.sel);
  if (vol.length && y < doc.page.height - 130) {
    doc.font('headSemi').fontSize(13).fillColor(C.deep).text('Seleção por volume do sistema', 48, y);
    y = table(doc, vol, 48, doc.y + 8, W - 96, { head: ['Modelo', 'Volume máximo do sistema'] }) + 6;
    doc.font('body').fontSize(8).fillColor(C.muted).text('* Os critérios de seleção podem variar conforme o ambiente da máquina, o tipo de óleo e as condições de operação.', 48, y, { width: W - 96 });
  }
  footer(doc);
  doc.font('body').fontSize(7.5).fillColor(C.muted).text('Dados do fabricante, sujeitos a alteração sem aviso prévio.', 48, doc.page.height - 70, { width: W - 96, lineBreak: false });
  doc.end();
  await done;
}

async function catalogo(logo) {
  const file = join(OUT, 'catalogo-triple-r.pdf');
  const { doc, done } = newDoc(file, 'Catálogo de soluções - Triple R');
  // cover
  doc.addPage({ margin: 0 });
  const W = doc.page.width;
  const H = doc.page.height;
  doc.rect(0, 0, W, H).fill(C.deep);
  doc.rect(0, 0, W, 150).fill('#ffffff');
  if (logo) doc.image(logo, 48, 52, { height: 48 });
  doc.font('bodyBold').fontSize(11).fillColor('#7fd3ff').text('CATÁLOGO DE SOLUÇÕES', 48, 300, { characterSpacing: 2 });
  doc.font('head').fontSize(40).fillColor('#ffffff').text('Purificação de óleo industrial', 48, 322, { width: W - 96, lineGap: -4 });
  doc
    .font('body')
    .fontSize(13)
    .fillColor('#c9d2ff')
    .text('Remove partículas sólidas de até 1 mícron, água, borra e verniz em um único elemento. Tecnologia Triple R, mais de 50 anos de mercado.', 48, doc.y + 18, { width: W - 140, lineGap: 3 });
  doc.page.margins.bottom = 0;
  doc.font('bodyBold').fontSize(11).fillColor('#ffffff').text(`${series.length} linhas de produto · ${Object.keys(models).length} modelos`, 48, H - 120);
  doc.font('body').fontSize(10).fillColor('#c9d2ff').text(`${CONTACT.site}  ·  ${CONTACT.email}  ·  ${CONTACT.phone}`, 48, H - 100);

  // index
  doc.addPage({ margin: 48 });
  header(doc, logo, 'Catálogo de soluções');
  doc.font('head').fontSize(22).fillColor(C.deep).text('Linhas de produto', 48, 110);
  let y = doc.y + 12;
  series.forEach((s, i) => {
    const n = s.groups.reduce((a, g) => a + g.m.length, 0);
    doc.font('headSemi').fontSize(11.5).fillColor(C.deep).text(`${String(i + 1).padStart(2, '0')}  ${clean(s.title)}`, 48, y);
    doc.font('body').fontSize(9.5).fillColor(C.muted).text(`${clean(s.sub)} · ${n} modelo(s)`, 78, doc.y + 1);
    y = doc.y + 9;
  });
  footer(doc);

  for (const s of series) {
    doc.addPage({ margin: 48 });
    header(doc, logo, 'Catálogo de soluções');
    const cover = s.img || models[s.groups[0]?.m[0]]?.limg;
    const pic = await image(cover, 640);
    doc.font('bodyBold').fontSize(9).fillColor(C.clear).text(clean(s.sub).toUpperCase(), 48, 108, { width: 300, characterSpacing: 1 });
    doc.font('head').fontSize(26).fillColor(C.deep).text(clean(s.title), 48, doc.y + 4, { width: 300 });
    doc.font('body').fontSize(10.5).fillColor(C.muted).text(clean(s.intro), 48, doc.y + 8, { width: 300, lineGap: 2 });
    let yy = doc.y + 14;
    if (pic) {
      doc.roundedRect(370, 104, W - 418, 200, 14).fill(C.soft);
      doc.image(pic, 380, 112, { fit: [W - 438, 184], align: 'center', valign: 'center' });
      yy = Math.max(yy, 320);
    }
    const list = s.groups.flatMap(g => g.m);
    doc.font('headSemi').fontSize(12).fillColor(C.deep).text('Modelos', 48, yy);
    yy = doc.y + 8;
    const rows = list.map(slug => {
      const m = models[slug];
      const vol = volumeRows(m.sel)[0]?.[1];
      const key = m.specs.find(([k]) => /vaz|fluxo/i.test(k));
      const info = [key ? `${key[0]}: ${key[1]}` : null, vol ? `Volume do sistema: ${vol}` : null].filter(Boolean).join(' · ');
      return [m.name, info || 'Consulte a ficha técnica'];
    });
    table(doc, rows, 48, yy, W - 96, { head: ['Modelo', 'Dados principais'], keyWidth: 150 });
    footer(doc);
  }
  doc.end();
  await done;
}

await mkdir(join(OUT, 'fichas'), { recursive: true });
const logo = await image('2023/06/mark_horizon_color.png', 600, true);
await catalogo(logo);
const entries = Object.entries(models);
for (let i = 0; i < entries.length; i += 6) await Promise.all(entries.slice(i, i + 6).map(([slug, m]) => ficha(slug, m, logo)));
console.log(`[pdf] catalogue + ${(await readdir(join(OUT, 'fichas'))).length} technical sheets written to public/pdf`);
