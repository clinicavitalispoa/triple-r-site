// Generates public/models/bu100e.glb: a stylized 3D model of the Triple R BU100E by-pass purifier
// (cast aluminium housing, ribbed lid, T-handle, RRR emblem, pressure gauge and black U-bracket).
// Run once with: node scripts/build-bu100e-model.mjs
import { writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// Node polyfill used by GLTFExporter in binary mode
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

const S = 0.01; // centimetres -> metres
const mat = {
  alu: new THREE.MeshStandardMaterial({ name: 'cast-aluminium', color: '#cdd1d6', metalness: 0.92, roughness: 0.34 }),
  aluDark: new THREE.MeshStandardMaterial({ name: 'aluminium-shadow', color: '#a9aeb5', metalness: 0.9, roughness: 0.45 }),
  chrome: new THREE.MeshStandardMaterial({ name: 'chrome', color: '#eef0f2', metalness: 1, roughness: 0.12 }),
  black: new THREE.MeshStandardMaterial({ name: 'black-powder-coat', color: '#17181c', metalness: 0.35, roughness: 0.55 }),
  white: new THREE.MeshStandardMaterial({ name: 'gauge-face', color: '#f5f6f7', metalness: 0, roughness: 0.5 }),
  label: new THREE.MeshStandardMaterial({ name: 'label', color: '#f2f2ee', metalness: 0, roughness: 0.6 }),
  red: new THREE.MeshStandardMaterial({ name: 'needle', color: '#d0262f', metalness: 0.1, roughness: 0.4 }),
  green: new THREE.MeshStandardMaterial({ name: 'gauge-green', color: '#2fa84f', metalness: 0, roughness: 0.5 }),
  glass: new THREE.MeshStandardMaterial({ name: 'glass', color: '#ffffff', metalness: 0, roughness: 0.05, transparent: true, opacity: 0.18 })
};

const root = new THREE.Group();
root.name = 'BU100E';
const add = (geo, material, pos = [0, 0, 0], rot = [0, 0, 0], name) => {
  const m = new THREE.Mesh(geo, material);
  m.position.set(...pos.map(v => v * S));
  m.rotation.set(...rot);
  m.scale.setScalar(S);
  if (name) m.name = name;
  root.add(m);
  return m;
};

// Wrap a flat geometry (built in the XY plane, facing +Z) around a vertical cylinder of radius R.
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

// --- housing (lathe) ---
const housingProfile = [
  [0, 0], [8.6, 0], [9.8, 0.4], [10.3, 1.2], [10.5, 2.5], [10.8, 8], [11.0, 14.6], [11.4, 15.0]
].map(([x, y]) => new THREE.Vector2(x, y));
add(new THREE.LatheGeometry(housingProfile, 96), mat.alu, [0, 0, 0], [0, 0, 0], 'housing');
// subtle casting rings
add(new THREE.TorusGeometry(10.62, 0.12, 8, 96), mat.aluDark, [0, 3.2, 0], [Math.PI / 2, 0, 0]);
add(new THREE.TorusGeometry(10.98, 0.12, 8, 96), mat.aluDark, [0, 13.8, 0], [Math.PI / 2, 0, 0]);

// --- lid ---
const lidProfile = [
  [0, 15.0], [11.9, 15.0], [12.1, 15.4], [12.1, 16.6], [11.8, 17.0], [10.6, 17.3], [8.5, 17.9], [5.5, 18.8], [3.2, 19.4], [2.6, 19.6], [0, 19.6]
].map(([x, y]) => new THREE.Vector2(x, y));
add(new THREE.LatheGeometry(lidProfile, 96), mat.alu, [0, 0, 0], [0, 0, 0], 'lid');
for (let i = 0; i < 18; i++) {
  const a = (i / 18) * Math.PI * 2;
  // ribs follow the lid slope (from r=3.2,y=19.4 down to r=10.6,y=17.3)
  const rib = new THREE.BoxGeometry(0.45, 0.5, 7.0);
  const m = add(rib, mat.alu, [Math.sin(a) * 6.9, 18.55, Math.cos(a) * 6.9], [0, a, 0]);
  m.rotateX(0.276);
}
// --- centre boss + T-handle ---
add(new THREE.CylinderGeometry(2.4, 2.9, 1.4, 48), mat.alu, [0, 20.2, 0]);
add(new THREE.CylinderGeometry(1.0, 1.0, 3.2, 32), mat.chrome, [0, 22.4, 0]);
add(new THREE.CylinderGeometry(1.5, 1.5, 1.6, 32), mat.chrome, [0, 24.2, 0]);
add(new THREE.CylinderGeometry(0.62, 0.62, 19, 32), mat.chrome, [0, 24.3, 0], [0, 0, Math.PI / 2], 't-handle');
for (const sx of [-1, 1]) add(new THREE.SphereGeometry(0.66, 24, 16), mat.chrome, [sx * 9.5, 24.3, 0]);

// --- RRR emblem (oval ring + letters wrapped on the housing front) ---
const R = 10.75;
const oval = new THREE.Shape();
oval.absellipse(0, 0, 8.6, 4.3, 0, Math.PI * 2, false, 0);
const hole = new THREE.Path();
hole.absellipse(0, 0, 7.9, 3.65, 0, Math.PI * 2, true, 0);
oval.holes.push(hole);
const ring = new THREE.ExtrudeGeometry(oval, { depth: 0.35, bevelEnabled: false, curveSegments: 64 });
const ringMesh = new THREE.Mesh(wrap(mergeVertices(ring.toNonIndexed()), R, 8.2), mat.alu);
ringMesh.scale.setScalar(S);
root.add(ringMesh);
const text = new TextGeometry('RRR', { font, size: 4.2, depth: 0.4, curveSegments: 6, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: 2 });
text.computeBoundingBox();
const tb = text.boundingBox;
text.translate(-(tb.max.x + tb.min.x) / 2, -(tb.max.y + tb.min.y) / 2, 0);
// slight italic shear like the brand mark
text.applyMatrix4(new THREE.Matrix4().set(1, 0.18, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1));
const textMesh = new THREE.Mesh(wrap(text, R, 8.2), mat.alu);
textMesh.scale.setScalar(S);
root.add(textMesh);

// caution label (upper right)
const lbl = new THREE.PlaneGeometry(6.2, 2.6, 24, 1);
lbl.translate(4.2, 0, 0.06);
const lblMesh = new THREE.Mesh(wrap(lbl, R + 0.12, 12.4), mat.label);
lblMesh.scale.setScalar(S);
root.add(lblMesh);

// --- valve block + gauge (under the housing, front) ---
add(new THREE.BoxGeometry(11, 5.2, 7.5), mat.alu, [0, -2.6, 2.2], [0, 0, 0], 'valve-block');
add(new THREE.BoxGeometry(5.6, 1.8, 0.1), mat.label, [-2.4, -1.6, 5.98]);
const gx = 2.6, gy = -2.7, gz = 6.0;
add(new THREE.CylinderGeometry(2.55, 2.55, 1.6, 48), mat.chrome, [gx, gy, gz + 0.8], [Math.PI / 2, 0, 0], 'gauge');
add(new THREE.CylinderGeometry(2.2, 2.2, 0.1, 48), mat.white, [gx, gy, gz + 1.62], [Math.PI / 2, 0, 0]);
add(new THREE.TorusGeometry(2.25, 0.22, 12, 48), mat.chrome, [gx, gy, gz + 1.68]);
add(new THREE.RingGeometry(1.55, 1.95, 32, 1, Math.PI * 0.15, Math.PI * 0.45), mat.green, [gx, gy, gz + 1.69]);
add(new THREE.RingGeometry(1.55, 1.95, 32, 1, Math.PI * 0.6, Math.PI * 0.25), mat.red, [gx, gy, gz + 1.69]);
const needle = add(new THREE.BoxGeometry(0.16, 1.8, 0.08), mat.red, [gx, gy, gz + 1.74]);
needle.geometry.translate(0, 0.8, 0);
needle.rotation.z = -0.5;
add(new THREE.CylinderGeometry(2.2, 2.2, 0.05, 48), mat.glass, [gx, gy, gz + 1.82], [Math.PI / 2, 0, 0]);
// fittings
for (const sx of [-1, 1]) add(new THREE.CylinderGeometry(0.9, 0.9, 1.6, 6), mat.chrome, [sx * 6.2, -3.2, 1.5], [0, 0, Math.PI / 2]);

// --- black U-bracket ---
const sideShape = new THREE.Shape();
sideShape.moveTo(-5.5, -13);
sideShape.lineTo(5.5, -13);
sideShape.lineTo(5.5, 4);
sideShape.quadraticCurveTo(5.5, 10.5, 0, 10.5);
sideShape.quadraticCurveTo(-5.5, 10.5, -5.5, 4);
sideShape.lineTo(-5.5, -13);
for (const [hx, hy, hr] of [[0, 7.2, 1.0], [0, -3.5, 1.3], [-2.8, -9.5, 0.8], [2.8, -9.5, 0.8]]) {
  const h = new THREE.Path();
  h.absarc(hx, hy, hr, 0, Math.PI * 2, true);
  sideShape.holes.push(h);
}
for (const sx of [-1, 1]) {
  const g = new THREE.ExtrudeGeometry(sideShape, { depth: 0.7, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 2, curveSegments: 24 });
  g.translate(0, 0, -0.35);
  add(g, mat.black, [sx * 12.6, 0, 0], [0, Math.PI / 2, 0], 'bracket-side');
  // bolt through the arm into the housing boss
  add(new THREE.CylinderGeometry(1.25, 1.25, 1.0, 6), mat.chrome, [sx * 13.5, 7.2, 0], [0, 0, Math.PI / 2]);
  add(new THREE.CylinderGeometry(1.8, 1.8, 2.0, 32), mat.alu, [sx * 11.4, 7.2, 0], [0, 0, Math.PI / 2]);
}
// base plate with mounting holes
const baseShape = new THREE.Shape();
baseShape.moveTo(-12.95, -6.5);
baseShape.lineTo(12.95, -6.5);
baseShape.lineTo(12.95, 6.5);
baseShape.lineTo(-12.95, 6.5);
baseShape.lineTo(-12.95, -6.5);
for (const [hx, hy] of [[-8, -3.6], [8, -3.6], [-8, 3.6], [8, 3.6], [0, 0]]) {
  const h = new THREE.Path();
  h.absarc(hx, hy, 0.75, 0, Math.PI * 2, true);
  baseShape.holes.push(h);
}
const base = new THREE.ExtrudeGeometry(baseShape, { depth: 0.7, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 2, curveSegments: 16 });
add(base, mat.black, [0, -13, 0], [Math.PI / 2, 0, 0], 'bracket-base');
// rounded bends where base meets arms
for (const sx of [-1, 1]) add(new THREE.CylinderGeometry(0.7, 0.7, 11, 16, 1, false, 0, Math.PI / 2), mat.black, [sx * 12.25, -13.05, 0], [Math.PI / 2, 0, sx > 0 ? 0 : Math.PI / 2]);

const exporter = new GLTFExporter();
const glb = await exporter.parseAsync(root, { binary: true });
await writeFile(new URL('../public/models/bu100e.glb', import.meta.url), Buffer.from(glb));
console.log('wrote public/models/bu100e.glb', Buffer.byteLength(Buffer.from(glb)), 'bytes');
