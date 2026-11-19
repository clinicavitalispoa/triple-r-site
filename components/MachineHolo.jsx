'use client';

import { useEffect, useState } from 'react';
import HoloCard from './reactbits/HoloCard/HoloCard';
import { proxied } from '@/lib/site';

const W = 630;
const H = 880;
const cache = new Map();

const load = src =>
  new Promise((resolve, reject) => {
    const im = new Image();
    im.crossOrigin = 'anonymous';
    im.onload = () => resolve(im);
    im.onerror = reject;
    im.src = src;
  });

const roundRect = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

const fitText = (ctx, text, max, size, weight = 700) => {
  let s = size;
  do {
    ctx.font = `${weight} ${s}px "Trebuchet MS", Arial, sans-serif`;
    s -= 2;
  } while (ctx.measureText(text).width > max && s > 20);
};

async function compose(image, name, label) {
  const key = `${image}|${name}|${label}`;
  if (cache.has(key)) return cache.get(key);
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d');

  // brand background: Deep Blue with Clear Blue glow
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#0b0670');
  bg.addColorStop(0.55, '#080059');
  bg.addColorStop(1, '#04002f');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W * 0.5, H * 0.4, 20, W * 0.5, H * 0.4, W * 0.75);
  glow.addColorStop(0, 'rgba(0,134,209,0.55)');
  glow.addColorStop(1, 'rgba(0,134,209,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // technical grid
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  for (let x = 30; x < W; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 30; y < H; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  // header
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = '700 22px "Trebuchet MS", Arial, sans-serif';
  ctx.fillText('TRIPLE R', 44, 66);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#5cc3ff';
  ctx.font = '600 20px "Trebuchet MS", Arial, sans-serif';
  ctx.fillText('OIL CLEANER', W - 44, 66);
  ctx.textAlign = 'left';

  // product image
  try {
    const im = await load(proxied(image, 750));
    const probe = document.createElement('canvas');
    probe.width = 8;
    probe.height = 8;
    const p = probe.getContext('2d');
    p.drawImage(im, 0, 0, 8, 8);
    const opaque = p.getImageData(0, 0, 1, 1).data[3] > 250;
    // trim transparent padding so the machine fills the card
    let sx = 0, sy = 0, sw = im.width, sh = im.height;
    if (!opaque) {
      const k = Math.min(1, 240 / Math.max(im.width, im.height));
      const t = document.createElement('canvas');
      t.width = Math.max(1, Math.round(im.width * k));
      t.height = Math.max(1, Math.round(im.height * k));
      const tc = t.getContext('2d');
      tc.drawImage(im, 0, 0, t.width, t.height);
      const a = tc.getImageData(0, 0, t.width, t.height).data;
      let x0 = t.width, y0 = t.height, x1 = -1, y1 = -1;
      for (let y = 0; y < t.height; y++)
        for (let x = 0; x < t.width; x++)
          if (a[(y * t.width + x) * 4 + 3] > 16) {
            if (x < x0) x0 = x;
            if (x > x1) x1 = x;
            if (y < y0) y0 = y;
            if (y > y1) y1 = y;
          }
      if (x1 > x0 && y1 > y0) {
        sx = Math.max(0, (x0 - 1) / k);
        sy = Math.max(0, (y0 - 1) / k);
        sw = Math.min(im.width - sx, (x1 - x0 + 3) / k);
        sh = Math.min(im.height - sy, (y1 - y0 + 3) / k);
      }
    }
    const box = { x: 44, y: 100, w: W - 88, h: 560 };
    if (opaque) {
      ctx.save();
      roundRect(ctx, box.x, box.y, box.w, box.h, 26);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.clip();
      const s = Math.min((box.w - 40) / im.width, (box.h - 40) / im.height);
      ctx.drawImage(im, box.x + (box.w - im.width * s) / 2, box.y + (box.h - im.height * s) / 2, im.width * s, im.height * s);
      ctx.restore();
    } else {
      const s = Math.min((box.w - 20) / sw, (box.h - 20) / sh);
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.45)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 24;
      ctx.drawImage(im, sx, sy, sw, sh, box.x + (box.w - sw * s) / 2, box.y + (box.h - sh * s) / 2, sw * s, sh * s);
      ctx.restore();
    }
  } catch {
    /* keep card without photo */
  }

  // footer
  const fy = 700;
  ctx.fillStyle = 'rgba(255,255,255,0.14)';
  ctx.fillRect(44, fy, W - 88, 1);
  ctx.fillStyle = '#5cc3ff';
  ctx.font = '600 22px "Trebuchet MS", Arial, sans-serif';
  ctx.fillText((label || '').toUpperCase(), 44, fy + 46);
  ctx.fillStyle = '#ffffff';
  fitText(ctx, name, W - 88, 64);
  ctx.fillText(name, 44, fy + 118);

  const url = c.toDataURL('image/jpeg', 0.9);
  cache.set(key, url);
  return url;
}

export default function MachineHolo({ image, name, label, width = 320, preset = 'rainbow', intensity = 0.38, className }) {
  const [art, setArt] = useState(null);
  useEffect(() => {
    let alive = true;
    compose(image, name, label).then(url => alive && setArt(url));
    return () => {
      alive = false;
    };
  }, [image, name, label]);

  return (
    <div className={`machine-holo ${className || ''}`} style={{ '--mh-w': `${width}px` }}>
      {art ? (
        <HoloCard image={art} alt={`${name} - ${label}`} preset={preset} intensity={intensity} edgeSparkle={0.5} glare={0.6} foilColor="#9fd8ff" width={width} radius={18} tiltMax={12} />
      ) : (
        <div className="machine-holo__skeleton" aria-hidden="true" />
      )}
    </div>
  );
}
