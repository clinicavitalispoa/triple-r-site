// Normalizes the product photos used on cards: removes the flat (white/grey) background,
// trims the empty margin and centres every product at the same size on a transparent canvas.
//   node scripts/build-card-images.mjs
// Output: public/cards/<name>.webp + lib/data/cards.json (source path → local file).
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const OUT = join(ROOT, 'public', 'cards');
const UPLOADS = process.env.UPLOADS_BASE || 'https://triple-rrr.com.br/wp-content/uploads/';
const W = 640;
const H = 480;
const PAD = 0.08;

const load = async f => JSON.parse(await readFile(join(ROOT, 'lib', 'data', f), 'utf8'));
const { series } = await load('series.json');
const models = { ...(await load('models-a.json')), ...(await load('models-b.json')) };

const paths = new Set();
for (const s of series) paths.add(s.img || models[s.groups[0]?.m[0]]?.limg);
for (const m of Object.values(models)) paths.add(m.limg || m.img);
paths.delete(undefined);
paths.delete(null);

const name = p => p.replace(/\.[a-z0-9]+$/i, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase().slice(-80);

async function cutout(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const px = i => [data[i * 4], data[i * 4 + 1], data[i * 4 + 2], data[i * 4 + 3]];
  // already transparent around the product?
  const corners = [0, w - 1, (h - 1) * w, h * w - 1].map(px);
  const transparent = corners.filter(c => c[3] < 20).length >= 3;
  if (!transparent) {
    // flood fill the background from the edges, using the average corner colour as reference
    const ref = corners.reduce((a, c) => [a[0] + c[0] / 4, a[1] + c[1] / 4, a[2] + c[2] / 4], [0, 0, 0]);
    const tol = 26;
    const seen = new Uint8Array(w * h);
    const stack = [];
    for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
    for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
    while (stack.length) {
      const i = stack.pop();
      if (seen[i]) continue;
      seen[i] = 1;
      const o = i * 4;
      if (Math.abs(data[o] - ref[0]) > tol || Math.abs(data[o + 1] - ref[1]) > tol || Math.abs(data[o + 2] - ref[2]) > tol) continue;
      data[o + 3] = 0;
      const x = i % w;
      if (x > 0) stack.push(i - 1);
      if (x < w - 1) stack.push(i + 1);
      if (i >= w) stack.push(i - w);
      if (i < w * (h - 1)) stack.push(i + w);
    }
  }
  // bounding box of visible pixels
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (data[(y * w + x) * 4 + 3] > 24) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
  if (x1 < x0) return null;
  const cropped = await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 })
    .png()
    .toBuffer();
  const boxW = Math.round(W * (1 - PAD * 2));
  const boxH = Math.round(H * (1 - PAD * 2));
  const fitted = await sharp(cropped).resize(boxW, boxH, { fit: 'inside' }).png().toBuffer();
  const meta = await sharp(fitted).metadata();
  return sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: fitted, left: Math.round((W - meta.width) / 2), top: Math.round((H - meta.height) / 2) }])
    .webp({ quality: 82, alphaQuality: 90 })
    .toBuffer();
}

await mkdir(OUT, { recursive: true });
const manifest = {};
for (const p of paths) {
  try {
    const res = await fetch(UPLOADS + p, { signal: AbortSignal.timeout(30000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const out = await cutout(Buffer.from(await res.arrayBuffer()));
    if (!out) throw new Error('empty image');
    const file = `${name(p)}.webp`;
    await writeFile(join(OUT, file), out);
    manifest[p] = `/cards/${file}`;
    console.log('ok', p);
  } catch (err) {
    console.warn('skip', p, err.message);
  }
}
await writeFile(join(ROOT, 'lib', 'data', 'cards.json'), JSON.stringify(manifest, null, 1));
console.log(Object.keys(manifest).length, 'card images');
