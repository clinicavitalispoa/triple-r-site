// Generates stylized 3D models (GLB) for the Triple R product lines with simple shapes.
//   node scripts/build-3d-models.mjs
// Output: public/models/<key>.glb. Mapping model → file lives in lib/models3d.js.
// Built from the product photos; proportions follow the catalogue dimensions where available.
import { writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { NodeIO } from '@gltf-transform/core';
import sharp from 'sharp';

globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(buf => {
      this.result = buf;
      this.onloadend?.();
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then(buf => {
      this.result = `data:${blob.type};base64,${Buffer.from(buf).toString('base64')}`;
      this.onloadend?.();
    });
  }
};

const require = createRequire(import.meta.url);
const font = new FontLoader().parse(JSON.parse(readFileSync(require.resolve('three/examples/fonts/helvetiker_bold.typeface.json'), 'utf8')));
const OUT = new URL('../public/models/', import.meta.url);
const S = 0.01;

// ---------- materials ----------
const M = (name, color, metalness, roughness, extra = {}) => new THREE.MeshStandardMaterial({ name, color, metalness, roughness, ...extra });
const mat = {
  alu: () => M('cast-aluminium', '#cdd1d6', 0.92, 0.34),
  aluDark: () => M('aluminium-shadow', '#a9aeb5', 0.9, 0.45),
  steel: () => M('stainless', '#e4e7eb', 0.8, 0.3),
  brushed: () => M('brushed-steel', '#dfe2e6', 0.7, 0.42),
  chrome: () => M('chrome', '#eef0f2', 1, 0.12),
  black: () => M('black-powder-coat', '#17181c', 0.35, 0.55),
  white: () => M('white', '#f4f5f6', 0, 0.55),
  paper: () => M('filter-paper', '#f7f7f4', 0, 0.85),
  red: () => M('red', '#d0262f', 0.1, 0.4),
  green: () => M('green', '#2fa84f', 0, 0.5),
  glass: () => M('glass', '#ffffff', 0, 0.05, { transparent: true, opacity: 0.18 }),
  grey: () => M('grey-paint', '#9aa1a8', 0.4, 0.45),
  motor: () => M('motor-white', '#e9ebee', 0.1, 0.45),
  tray: () => M('green-tray', '#2f6b56', 0.3, 0.5),
  brass: () => M('brass', '#c9a24a', 1, 0.3),
  dark: () => M('dark', '#2a2d33', 0.3, 0.6),
  tex: (key, rough = 0.7) => M(`tex:${key}`, '#ffffff', 0, rough)
};

// ---------- textures (rendered from SVG, attached after export) ----------
const svgImg = (svg, w, h) => sharp(Buffer.from(svg)).resize(Math.round(w / 2), Math.round(h / 2)).flatten({ background: '#ffffff' }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
const TEX = {
  wrap: color => {
    // white paper band printed with diagonal "RRR" rows (filter elements)
    const rows = [];
    for (let r = 0; r < 9; r++) {
      const y = 60 + r * 58;
      const off = (r % 2) * 40;
      rows.push(`<text x="${-40 + off}" y="${y}" font-family="DejaVu Sans" font-weight="bold" font-style="italic" font-size="42" fill="${color}" transform="rotate(-4 0 ${y})">${'RRR '.repeat(22)}</text>`);
    }
    return svgImg(`<svg xmlns="http://www.w3.org/2000/svg" width="2048" height="560"><rect width="2048" height="560" fill="#fbfbf9"/>${rows.join('')}</svg>`, 2048, 560);
  },
  label: () =>
    svgImg(
      `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="400"><rect width="512" height="400" rx="18" fill="#ffffff"/><rect x="6" y="6" width="500" height="388" rx="14" fill="none" stroke="#cfd3d8" stroke-width="4"/><ellipse cx="256" cy="150" rx="150" ry="78" fill="#0a0a6e"/><ellipse cx="256" cy="150" rx="132" ry="62" fill="#1d4fd0"/><text x="256" y="172" text-anchor="middle" font-family="DejaVu Sans" font-weight="bold" font-style="italic" font-size="72" fill="#ffffff">RRR</text><text x="256" y="320" text-anchor="middle" font-family="DejaVu Sans" font-size="78" fill="#1a1a1a">Triple R</text></svg>`,
      512,
      400
    ),
  wound: () => {
    const lines = Array.from({ length: 64 }, (_, i) => `<line x1="0" y1="${i * 8 + 4}" x2="1024" y2="${i * 8 + 4 + (i % 2 ? 3 : -3)}" stroke="#e6e6e0" stroke-width="3"/>`).join('');
    return svgImg(`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="512"><rect width="1024" height="512" fill="#fbfbf8"/>${lines}</svg>`, 1024, 512);
  },
  fiber: () => {
    const lines = Array.from({ length: 220 }, (_, i) => {
      const x = (i * 97) % 1024;
      const y = (i * 53) % 512;
      return `<path d="M${x} ${y} q 30 ${(i % 7) - 3} 60 ${(i % 5) - 2}" stroke="#e2c867" stroke-width="2" fill="none" opacity="0.6"/>`;
    }).join('');
    return svgImg(`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="512"><rect width="1024" height="512" fill="#f3e08e"/>${lines}</svg>`, 1024, 512);
  },
  engrave: text =>
    svgImg(
      `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="256"><rect width="512" height="256" fill="#d7dbe0"/><text x="256" y="160" text-anchor="middle" font-family="DejaVu Sans" font-weight="bold" font-size="96" fill="#b9bec5" stroke="#eef0f2" stroke-width="2">${text}</text></svg>`,
      512,
      256
    )
};

// ---------- helpers ----------
function scene(name) {
  const root = new THREE.Group();
  root.name = name;
  const add = (geo, material, pos = [0, 0, 0], rot = [0, 0, 0], label) => {
    const m = new THREE.Mesh(geo, material);
    m.position.set(...pos.map(v => v * S));
    m.rotation.set(...rot);
    m.scale.setScalar(S);
    if (label) m.name = label;
    root.add(m);
    return m;
  };
  return { root, add };
}
const lathe = (pts, seg = 96) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg);
const wrap = (geo, R, yOffset = 0) => {
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const a = x / R, r = R + z;
    p.setXYZ(i, r * Math.sin(a), y + yOffset, r * Math.cos(a));
  }
  geo.computeVertexNormals();
  return geo;
};
function emblem(add, R, y, w = 8.6, h = 4.3, size = 4.2, material = mat.alu()) {
  const oval = new THREE.Shape();
  oval.absellipse(0, 0, w, h, 0, Math.PI * 2, false, 0);
  const hole = new THREE.Path();
  hole.absellipse(0, 0, w - 0.7, h - 0.65, 0, Math.PI * 2, true, 0);
  oval.holes.push(hole);
  const ring = new THREE.ExtrudeGeometry(oval, { depth: 0.35, bevelEnabled: false, curveSegments: 64 }).toNonIndexed();
  add(wrap(ring, R, y), material);
  const text = new TextGeometry('RRR', { font, size, depth: 0.4, curveSegments: 6, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: 2 });
  text.computeBoundingBox();
  const tb = text.boundingBox;
  text.translate(-(tb.max.x + tb.min.x) / 2, -(tb.max.y + tb.min.y) / 2, 0);
  text.applyMatrix4(new THREE.Matrix4().set(1, 0.18, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1));
  add(wrap(text, R, y), material);
}
function gauge(add, x, y, z, r = 2.4, rot = [Math.PI / 2, 0, 0], face = 'z') {
  const g = new THREE.Group();
  const parts = [
    [new THREE.CylinderGeometry(r, r, 1.4, 40), mat.chrome(), [0, 0, 0.7]],
    [new THREE.CylinderGeometry(r * 0.86, r * 0.86, 0.1, 40), mat.white(), [0, 0, 1.42]],
    [new THREE.TorusGeometry(r * 0.88, r * 0.09, 10, 40), mat.chrome(), [0, 0, 1.46]],
    [new THREE.RingGeometry(r * 0.6, r * 0.76, 24, 1, Math.PI * 0.15, Math.PI * 0.45), mat.green(), [0, 0, 1.48]],
    [new THREE.RingGeometry(r * 0.6, r * 0.76, 24, 1, Math.PI * 0.6, Math.PI * 0.25), mat.red(), [0, 0, 1.48]]
  ];
  parts.forEach(([geo, m, p], i) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(...p);
    if (i < 2) mesh.rotation.x = Math.PI / 2;
    g.add(mesh);
  });
  const needle = new THREE.Mesh(new THREE.BoxGeometry(0.14, r * 0.75, 0.06), mat.red());
  needle.geometry.translate(0, r * 0.33, 0);
  needle.position.set(0, 0, 1.52);
  needle.rotation.z = -0.5;
  g.add(needle);
  g.scale.setScalar(S);
  g.position.set(x * S, y * S, z * S);
  if (face === 'y') g.rotation.x = -Math.PI / 2;
  return g;
}
function tHandle(add, y, len = 16, r = 0.55) {
  add(new THREE.CylinderGeometry(0.9, 0.9, 2.8, 24), mat.chrome(), [0, y + 1.4, 0]);
  add(new THREE.CylinderGeometry(1.3, 1.3, 1.4, 24), mat.chrome(), [0, y + 3.1, 0]);
  add(new THREE.CylinderGeometry(r, r, len, 24), mat.chrome(), [0, y + 3.2, 0], [0, 0, Math.PI / 2]);
  for (const sx of [-1, 1]) add(new THREE.SphereGeometry(r * 1.1, 18, 12), mat.chrome(), [sx * len / 2, y + 3.2, 0]);
}
function ribbedLid(add, R, y0, rise = 4.4, ribs = 18) {
  add(lathe([[0, y0], [R + 0.9, y0], [R + 1.1, y0 + 0.4], [R + 1.1, y0 + 1.6], [R + 0.8, y0 + 2], [R * 0.86, y0 + 2.3], [R * 0.3, y0 + rise], [0, y0 + rise]]), mat.alu());
  for (let i = 0; i < ribs; i++) {
    const a = (i / ribs) * Math.PI * 2;
    const len = R * 0.62;
    const m = add(new THREE.BoxGeometry(0.4, 0.45, len), mat.alu(), [Math.sin(a) * R * 0.6, y0 + 2.2 + (rise - 2.2) * 0.45, Math.cos(a) * R * 0.6], [0, a, 0]);
    m.rotateX(Math.atan2(rise - 2.3, R * 0.56));
  }
  add(new THREE.CylinderGeometry(2.2, 2.6, 1.3, 40), mat.alu(), [0, y0 + rise + 0.5, 0]);
}

async function save(key, root, textures = {}) {
  const exporter = new GLTFExporter();
  const glb = await exporter.parseAsync(root, { binary: true });
  const io = new NodeIO();
  const doc = await io.readBinary(new Uint8Array(glb));
  for (const material of doc.getRoot().listMaterials()) {
    const name = material.getName();
    if (!name.startsWith('tex:')) continue;
    const t = name.slice(4);
    const png = await (textures[t] ? textures[t]() : null);
    if (!png) continue;
    const texture = doc.createTexture(t).setImage(new Uint8Array(png)).setMimeType('image/jpeg');
    material.setBaseColorTexture(texture);
  }
  const bin = await io.writeBinary(doc);
  await writeFile(new URL(`${key}.glb`, OUT), Buffer.from(bin));
  console.log(`${key}.glb`, (bin.byteLength / 1024).toFixed(0), 'KB');
}

// ---------- builders ----------
function bu30e() {
  const { root, add } = scene('BU30E');
  // black base block with gauge
  const base = new THREE.Shape();
  base.moveTo(-7, 0);
  base.lineTo(7, 0);
  base.lineTo(5.6, 9);
  base.lineTo(-5.6, 9);
  base.lineTo(-7, 0);
  const g = new THREE.ExtrudeGeometry(base, { depth: 11, bevelEnabled: true, bevelThickness: 0.3, bevelSize: 0.3, bevelSegments: 2 });
  g.translate(0, 0, -5.5);
  add(g, mat.black(), [0, 0, 0]);
  add(new THREE.BoxGeometry(7.5, 5.5, 0.2), mat.brushed(), [-1.5, 4.6, 5.85]);
  root.add(gauge(add, 2.6, 4.6, 5.7, 2.2));
  // tall housing
  add(lathe([[0, 9], [5.6, 9], [6.1, 9.6], [6.2, 26], [6.6, 26.3]]), mat.alu());
  emblem(add, 6.15, 19, 5, 2.6, 2.6);
  ribbedLid(add, 6.2, 26.3, 2.8, 14);
  tHandle(add, 30, 11, 0.45);
  return root;
}

function canisterOnBracket({ name, R = 12.2, H = 20, lidRise = 3.2 }) {
  // AL100: aluminium can on a black U-bracket, lid with an off-centre lever handle
  const { root, add } = scene(name);
  const y0 = 0;
  add(lathe([[0, y0], [R - 1.2, y0], [R - 0.2, y0 + 0.8], [R, y0 + 2], [R, y0 + H], [R + 0.4, y0 + H + 0.3]]), mat.alu());
  emblem(add, R, H * 0.55, 8.4, 4.2, 4);
  add(lathe([[0, H], [R + 0.9, H], [R + 1.1, H + 0.5], [R + 1.1, H + 1.6], [R + 0.5, H + 2], [R * 0.4, H + lidRise], [0, H + lidRise]]), mat.alu());
  add(new THREE.CylinderGeometry(1.8, 2.2, 1.6, 32), mat.chrome(), [0, H + lidRise + 0.6, 0]);
  const lever = add(new THREE.CylinderGeometry(0.6, 0.6, 7, 20), mat.chrome(), [1.8, H + lidRise + 2.2, 0], [0, 0, -1.0]);
  lever.name = 'lever';
  add(new THREE.BoxGeometry(3.2, 3.2, 0.1), mat.label === undefined ? mat.white() : mat.white(), [R * 0.62, H * 0.32, R * 0.79], [0, 0.66, 0]);
  // bracket
  const side = new THREE.Shape();
  side.moveTo(-5, -12);
  side.lineTo(5, -12);
  side.lineTo(5, H * 0.55);
  side.quadraticCurveTo(5, H * 0.55 + 4, 0, H * 0.55 + 4);
  side.quadraticCurveTo(-5, H * 0.55 + 4, -5, H * 0.55);
  side.lineTo(-5, -12);
  const h1 = new THREE.Path();
  h1.absarc(0, H * 0.55, 0.9, 0, Math.PI * 2, true);
  side.holes.push(h1);
  for (const sx of [-1, 1]) {
    const gg = new THREE.ExtrudeGeometry(side, { depth: 0.7, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 2 });
    gg.translate(0, 0, -0.35);
    add(gg, mat.black(), [sx * (R + 0.6), 0, 0], [0, Math.PI / 2, 0]);
    add(new THREE.CylinderGeometry(1.1, 1.1, 1, 6), mat.chrome(), [sx * (R + 1.5), H * 0.55, 0], [0, 0, Math.PI / 2]);
  }
  add(new THREE.BoxGeometry(2 * R + 2, 0.7, 10), mat.black(), [0, -12, 0]);
  return root;
}

function stainlessOnLegs({ name, R = 10, H = 34 }) {
  const { root, add } = scene(name);
  const y0 = 22; // legs height
  // body: cone bottom, cylinder, flange, dome
  add(lathe([[1.5, y0 - 3], [R * 0.45, y0 - 1.8], [R, y0 + 1.2], [R, y0 + H * 0.68], [R + 0.6, y0 + H * 0.68], [R + 0.6, y0 + H * 0.68 + 1.6], [R, y0 + H * 0.68 + 1.6], [R, y0 + H * 0.92], [R * 0.75, y0 + H * 0.99], [R * 0.3, y0 + H * 1.03], [0, y0 + H * 1.04]]), mat.steel());
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    add(new THREE.CylinderGeometry(0.45, 0.45, 2.4, 6), mat.chrome(), [Math.sin(a) * (R + 0.9), y0 + H * 0.68 + 0.8, Math.cos(a) * (R + 0.9)]);
  }
  // label plate
  const label = new THREE.PlaneGeometry(R * 0.85, R * 0.66, 16, 1);
  label.translate(0, 0, 0.08);
  add(wrap(label, R + 0.02, y0 + H * 0.5), mat.tex('label', 0.5));
  // top fitting + gauge
  add(new THREE.CylinderGeometry(0.9, 0.9, 3, 16), mat.chrome(), [0, y0 + H * 1.04 + 1.4, 0]);
  const gz = gauge(add, 0, y0 + H * 1.04 + 4.3, -0.7, 2.1);
  root.add(gz);
  add(new THREE.CylinderGeometry(0.6, 0.6, 2.5, 12), mat.brass(), [R * 0.5, y0 + H * 1.0, 0]);
  // legs
  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + (i / 4) * Math.PI * 2;
    const lx = Math.sin(a) * (R - 0.6);
    const lz = Math.cos(a) * (R - 0.6);
    add(new THREE.BoxGeometry(1.6, y0 + 4, 1.6), mat.brushed(), [lx, (y0 + 4) / 2, lz]);
    add(new THREE.BoxGeometry(4.2, 0.5, 4.2), mat.brushed(), [lx * 1.08, 0.25, lz * 1.08]);
  }
  // outlet pipe at the bottom
  add(new THREE.CylinderGeometry(0.9, 0.9, 5, 16), mat.chrome(), [0, y0 - 5, 0]);
  return root;
}

function seUnit({ name }) {
  // SE: BU-style canister over a valve block, motor-pump box on the side, black stand
  const { root, add } = scene(name);
  const R = 8.5;
  const yb = 16;
  // stand
  for (const sx of [-1, 1]) add(new THREE.BoxGeometry(1, 12, 14), mat.black(), [sx * 7, 6, 0]);
  add(new THREE.BoxGeometry(22, 1, 18), mat.black(), [2, 0.5, 0]);
  add(new THREE.BoxGeometry(15, 1, 14), mat.black(), [0, 12.5, 0]);
  // valve block + gauge + sight filter
  add(new THREE.BoxGeometry(8, 4.5, 7), mat.alu(), [0, yb - 1.5, 0]);
  root.add(gauge(add, 4.6, yb - 4.5, 3.4, 1.9));
  add(new THREE.CylinderGeometry(1.6, 1.6, 4, 24), mat.glass(), [-1.5, 8, 4.5]);
  add(new THREE.CylinderGeometry(1.7, 1.7, 0.8, 24), mat.chrome(), [-1.5, 10.2, 4.5]);
  add(new THREE.CylinderGeometry(1.2, 1.2, 4, 20), mat.brass(), [1.8, 9.2, 4.2]);
  // canister
  add(lathe([[0, yb], [R - 1, yb], [R, yb + 1], [R, yb + 13], [R + 0.4, yb + 13.3]]), mat.alu());
  emblem(add, R, yb + 7, 6, 3, 3);
  ribbedLid(add, R, yb + 13.3, 3.2, 16);
  tHandle(add, yb + 17.2, 13, 0.5);
  // motor box with rotary switch
  add(new THREE.BoxGeometry(6.5, 11, 8.5), mat.motor(), [-11.5, yb + 1, 0.5]);
  add(new THREE.CylinderGeometry(2.4, 2.4, 1.2, 32), mat.dark(), [-11.5, yb + 1.5, 5.3], [Math.PI / 2, 0, 0]);
  add(new THREE.BoxGeometry(0.7, 3.4, 0.6), mat.dark(), [-11.5, yb + 1.5, 6]);
  add(new THREE.BoxGeometry(2.2, 1.2, 0.4), mat.green(), [-11.5, yb - 3.2, 4.9]);
  add(new THREE.CylinderGeometry(3, 3, 5, 24), mat.grey(), [-8.5, 6.5, 0], [0, 0, Math.PI / 2]);
  return root;
}

function suStUnit({ name }) {
  // SU-ST: vertical grey tank with motor box on a green drip tray
  const { root, add } = scene(name);
  const R = 9;
  add(new THREE.BoxGeometry(34, 2.5, 26), mat.tray(), [2, 1.25, 0]);
  add(new THREE.BoxGeometry(32, 1, 24), mat.dark(), [2, 2.6, 0]);
  add(lathe([[0, 5], [R, 5], [R, 30], [R * 0.8, 33], [R * 0.3, 34.5], [0, 34.6]]), mat.grey());
  add(new THREE.CylinderGeometry(R + 0.4, R + 0.4, 1.4, 48), mat.grey(), [0, 26, 0]);
  add(new THREE.CylinderGeometry(R + 0.4, R + 0.4, 1.4, 48), mat.grey(), [0, 11, 0]);
  add(new THREE.CylinderGeometry(0.7, 0.7, 3, 12), mat.brass(), [0, 36, 0]);
  add(new THREE.BoxGeometry(2.4, 0.8, 0.8), mat.red(), [0.8, 37.3, 0]);
  // motor box
  add(new THREE.BoxGeometry(9, 13, 7), mat.grey(), [13, 17, 0]);
  add(new THREE.CylinderGeometry(2.6, 2.6, 1, 32), mat.dark(), [13, 19, 3.8], [Math.PI / 2, 0, 0]);
  add(new THREE.BoxGeometry(0.8, 3.6, 0.6), mat.dark(), [13, 19, 4.4]);
  add(new THREE.CylinderGeometry(3, 3, 7, 24), mat.grey(), [13, 7, 0], [0, 0, Math.PI / 2]);
  // pipes and valves
  add(new THREE.CylinderGeometry(0.7, 0.7, 10, 12), mat.chrome(), [6, 6.5, 6], [0, 0, Math.PI / 2]);
  add(new THREE.CylinderGeometry(0.9, 0.9, 2, 12), mat.brass(), [10.5, 6.5, 6], [0, 0, Math.PI / 2]);
  add(new THREE.BoxGeometry(2.6, 0.6, 0.6), mat.dark(), [10.5, 7.8, 6]);
  return root;
}

function element({ name, R, H, kind }) {
  // filter element: printed side band, cyan wrap over the top edge, white top with centre hole
  const { root, add } = scene(name);
  const hole = R * 0.11;
  const top = { M: '#2f9d3f', E: '#1f3fb3', X: '#cf2140', D: '#c2186a' }[kind];
  if (top) {
    add(new THREE.CylinderGeometry(R, R, H * 0.8, 96, 1, true), mat.tex(`wrap-${kind}`), [0, H * 0.4, 0]);
    add(new THREE.CylinderGeometry(R + 0.25, R + 0.25, H * 0.24, 96, 1, true), M('cyan-wrap', '#27c4d6', 0, 0.6, { side: THREE.DoubleSide }), [0, H * 0.86, 0]);
    add(new THREE.TorusGeometry(R - 0.3, 0.6, 12, 96), M('cyan-wrap', '#27c4d6', 0, 0.6), [0, H * 0.98, 0], [Math.PI / 2, 0, 0]);
    add(new THREE.RingGeometry(hole, R - 0.3, 96), mat.paper(), [0, H, 0], [-Math.PI / 2, 0, 0]);
  } else if (kind === 'WG') {
    add(new THREE.CylinderGeometry(R, R, H * 0.7, 96, 1, true), M('orange-band', '#eda61f', 0, 0.5), [0, H * 0.35, 0]);
    add(new THREE.CylinderGeometry(R, R, H * 0.3, 96, 1, true), mat.paper(), [0, H * 0.85, 0]);
    add(new THREE.RingGeometry(hole, R, 96), mat.paper(), [0, H, 0], [-Math.PI / 2, 0, 0]);
  } else {
    add(new THREE.CylinderGeometry(R, R, H, 96, 1, true), mat.tex('fiber', 0.9), [0, H / 2, 0]);
    add(new THREE.CylinderGeometry(R + 0.15, R + 0.15, H * 0.12, 96, 1, true), mat.white(), [0, H * 0.75, 0]);
    add(new THREE.RingGeometry(hole, R, 96), M('fiber-top', '#efd77c', 0, 0.9), [0, H, 0], [-Math.PI / 2, 0, 0]);
  }
  add(new THREE.CylinderGeometry(hole, hole, H, 32, 1, true), M('hole', '#d9d6cc', 0, 0.9, { side: THREE.BackSide }), [0, H / 2, 0]);
  add(new THREE.RingGeometry(hole, R, 96), mat.paper(), [0, 0, 0], [Math.PI / 2, 0, 0]);
  return root;
}

function cartridge({ name }) {
  // WS: string-wound cartridge with black end caps
  const { root, add } = scene(name);
  add(new THREE.CylinderGeometry(3.4, 3.4, 25, 64, 1, true), mat.tex('wound', 0.9), [0, 12.5, 0]);
  for (const y of [0, 25]) {
    add(new THREE.CylinderGeometry(3.5, 3.5, 0.6, 48), mat.dark(), [0, y, 0]);
    add(new THREE.TorusGeometry(1.3, 0.3, 10, 32), mat.dark(), [0, y + (y ? 0.4 : -0.4), 0], [Math.PI / 2, 0, 0]);
  }
  return root;
}

function pleated({ name, R, H }) {
  // L / LL / OF-75S: pleated stainless strainer with aluminium end rings
  const { root, add } = scene(name);
  const shape = new THREE.Shape();
  const n = 48;
  for (let i = 0; i <= n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2;
    const r = i % 2 ? R : R * 0.86;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  const hole = new THREE.Path();
  hole.absarc(0, 0, R * 0.72, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  const g = new THREE.ExtrudeGeometry(shape, { depth: H * 0.86, bevelEnabled: false, curveSegments: 4 });
  add(g, mat.brushed(), [0, H * 0.07, 0], [-Math.PI / 2, 0, 0]);
  for (const y of [0, H * 0.93]) {
    add(lathe([[R * 0.68, y], [R + 0.4, y], [R + 0.4, y + H * 0.07], [R * 0.68, y + H * 0.07]], 64), mat.alu());
  }
  return root;
}

function magPlate({ name, L = 30, W = 6, T = 0.8 }) {
  const { root, add } = scene(name);
  add(new THREE.BoxGeometry(W, L, T), mat.brushed());
  for (const [x, y] of [[-W * 0.32, L * 0.46], [W * 0.32, L * 0.46], [-W * 0.32, -L * 0.46], [W * 0.32, -L * 0.46]]) add(new THREE.CylinderGeometry(0.35, 0.35, T + 0.1, 16), mat.dark(), [x, y, 0], [Math.PI / 2, 0, 0]);
  const ring = new THREE.Shape();
  ring.absellipse(0, 0, 1.4, 4, 0, Math.PI * 2, false, 0);
  const inner = new THREE.Path();
  inner.absellipse(0, 0, 1.1, 3.6, 0, Math.PI * 2, true, 0);
  ring.holes.push(inner);
  add(new THREE.ExtrudeGeometry(ring, { depth: 0.12, bevelEnabled: false }), mat.chrome(), [0, L * 0.1, T / 2]);
  return root;
}

function magDisc({ name }) {
  const { root, add } = scene(name);
  add(lathe([[0, 0], [7.4, 0], [7.6, 0.6], [7.3, 1.6], [5.5, 2.4], [0, 2.7]], 96), mat.brushed());
  const label = new THREE.PlaneGeometry(9, 4.5);
  add(label, mat.tex('engrave-msc', 0.4), [0, 2.75, 0], [-Math.PI / 2, 0, 0]);
  return root;
}

function magBox({ name, w = 16, d = 16, h = 3.6, slots = false }) {
  const { root, add } = scene(name);
  const shape = new THREE.Shape();
  const r = 1.4;
  shape.moveTo(-w / 2 + r, -d / 2);
  shape.lineTo(w / 2 - r, -d / 2);
  shape.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + r);
  shape.lineTo(w / 2, d / 2 - r);
  shape.quadraticCurveTo(w / 2, d / 2, w / 2 - r, d / 2);
  shape.lineTo(-w / 2 + r, d / 2);
  shape.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - r);
  shape.lineTo(-w / 2, -d / 2 + r);
  shape.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + r, -d / 2);
  const g = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: true, bevelThickness: 0.4, bevelSize: 0.4, bevelSegments: 3 });
  add(g, mat.brushed(), [0, 0, 0], [-Math.PI / 2, 0, 0]);
  for (const [x, z] of [[-w / 2 + 1.4, -d / 2 + 1.4], [w / 2 - 1.4, -d / 2 + 1.4], [-w / 2 + 1.4, d / 2 - 1.4], [w / 2 - 1.4, d / 2 - 1.4]]) add(new THREE.CylinderGeometry(0.55, 0.55, 0.3, 16), mat.chrome(), [x, h + 0.45, z]);
  if (slots) {
    for (const x of [-w * 0.2, w * 0.2]) add(new THREE.BoxGeometry(0.9, 0.3, d * 0.7), mat.chrome(), [x, h + 0.45, 0]);
  } else {
    const label = new THREE.PlaneGeometry(7, 3.5);
    add(label, mat.tex('engrave-oil', 0.4), [0, h + 0.42, 0], [-Math.PI / 2, 0, 0.6]);
  }
  for (const x of slots ? [-w * 0.3, w * 0.3] : [w * 0.25]) {
    add(new THREE.CylinderGeometry(0.9, 0.9, 1.4, 6), mat.dark(), [x, h * 0.5, d / 2 + 0.7], [Math.PI / 2, 0, 0]);
  }
  return root;
}

// ---------- build all ----------
const textures = {
  'wrap-M': () => TEX.wrap('#2f9d3f'),
  'wrap-E': () => TEX.wrap('#1f3fb3'),
  'wrap-X': () => TEX.wrap('#cf2140'),
  'wrap-D': () => TEX.wrap('#c2186a'),
  label: TEX.label,
  wound: TEX.wound,
  fiber: TEX.fiber,
  'engrave-msc': () => TEX.engrave('MSC-42'),
  'engrave-oil': () => TEX.engrave('OIL SIDE')
};

const jobs = [
  ['bu30e', bu30e()],
  ['al100', canisterOnBracket({ name: 'AL100' })],
  ['su-short', stainlessOnLegs({ name: 'SU102 / BU200', R: 10.3, H: 30 })],
  ['su-tall', stainlessOnLegs({ name: 'SU103 / BU300', R: 11, H: 46 })],
  ['se', seUnit({ name: 'SE-ST' })],
  ['su-st', suStUnit({ name: 'SU-ST' })],
  ['ws-cartridge', cartridge({ name: 'WS' })],
  ['strainer-l', pleated({ name: 'Série L', R: 5.6, H: 15.1 })],
  ['strainer-ll', pleated({ name: 'Série LL', R: 7.5, H: 25 })],
  ['strainer-of', pleated({ name: 'OF-75S', R: 1.75, H: 5 })],
  ['mag-plate-short', magPlate({ name: 'Barra magnética', L: 21, W: 5.5 })],
  ['mag-plate-long', magPlate({ name: 'Barra magnética longa', L: 26, W: 4.6 })],
  ['mag-disc', magDisc({ name: 'MSC' })],
  ['mag-box', magBox({ name: 'MSD', w: 15, d: 15 })],
  ['mag-rect', magBox({ name: 'MSR', w: 20, d: 13, slots: true })]
];
// filter elements: one per series and proportion (Ø x H in mm)
const DIAM = { 30: 104, 50: 143, 100: 179, 300: 303 };
for (const kind of ['M', 'E', 'X', 'D']) {
  for (const size of [30, 50, 100, 300]) {
    for (const h of [114, 80]) {
      if (h === 80 && (size === 30 || size === 50)) continue;
      jobs.push([`el-${kind.toLowerCase()}-${size}-${h}`, element({ name: `${kind}${size}-H${h}`, R: DIAM[size] / 20, H: h / 10, kind })]);
    }
  }
}
jobs.push(['el-wg-100', element({ name: 'WG100', R: 179 / 20, H: 11.4, kind: 'WG' })]);
jobs.push(['el-we-100', element({ name: 'WE100', R: 179 / 20, H: 11.4, kind: 'WE' })]);

const only = process.argv.slice(2);
for (const [key, root] of jobs) {
  if (only.length && !only.includes(key)) continue;
  await save(key, root, textures);
}
