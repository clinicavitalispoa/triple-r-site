// One-off text/unit cleanup of the content extracted from the old site.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const fixes = [
  [/\bO sistemas by-pass/g, 'Os sistemas by-pass'],
  [/caraterísticas/g, 'características'],
  [/\b1\s?micra\b/g, '1 mícron'],
  [/(\d+)\s?micras\b/g, '$1 mícrons'],
  [/(\d+)\s?micra\b/g, '$1 mícron'],
  [/(\d+(?:,\d+)?)\s?l\/m\b/g, '$1 L/min'],
  [/(\d+(?:,\d+)?)\s?LPM\b/g, '$1 L/min'],
  [/micro-partículas/g, 'micropartículas'],
  [/(\d+(?:,\d+)?)\s?l\s?\/\s?min\b/g, '$1 L/min'],
  [/(\d+(?:,\d+)?)\s?l\s?\/\s?m\b/g, '$1 L/min'],
  [/(\d+(?:\.\d+)?)\s?l\s?\/\s?hora\b/g, '$1 L/h'],
  [/(\d)\s?μ\b/g, '$1 µm']
];

const dir = new URL('../lib/data/', import.meta.url);
for (const f of readdirSync(dir)) {
  const p = new URL(f, dir);
  let s = readFileSync(p, 'utf8');
  const before = s;
  for (const [re, to] of fixes) s = s.replace(re, to);
  if (s !== before) {
    writeFileSync(p, s);
    console.log('fixed', f);
  }
}
