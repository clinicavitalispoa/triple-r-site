// Downloads the React Bits components (GooeyNav, HoloCard, SpotlightCard) from the official registry at build time.
import { mkdir, writeFile, access } from 'node:fs/promises';
import { basename, join } from 'node:path';

const COMPONENTS = ['GooeyNav', 'HoloCard', 'SpotlightCard', 'ModelViewer', 'BlurText'];

// A patch that cannot be applied keeps the committed local copy instead of the upstream file.
class PatchError extends Error {}
const ROOT = join(process.cwd(), 'components', 'reactbits');

const patchGooey = src => {
  const prop = "  hoverEffect = true,\n  className = '',";
  const click = "          if (!item.href || item.href === '#') event.preventDefault();\n          select(index);";
  if (!src.includes(prop) || !src.includes(click)) {
    throw new PatchError('GooeyNav patch does not apply to the upstream version');
  }
  return src.replace(prop, "  hoverEffect = true,\n  onNavigate,\n  className = '',").replace(
    click,
    "          if (!item.href || item.href === '#') event.preventDefault();\n          if (onNavigate && !event.metaKey && !event.ctrlKey && !event.shiftKey) {\n            event.preventDefault();\n            select(index);\n            onNavigate(item, index);\n            return;\n          }\n          select(index);"
  );
};

// ModelViewer: add a self-contained 'studio-local' environment (Lightformers, no HDR download from a CDN)
const patchModelViewer = src => {
  const imp = "import { ContactShadows, Environment, useFBX, useGLTF } from '@react-three/drei';";
  const env = "      {environment !== 'none' && <Environment preset={environment} environmentIntensity={intensity} />}";
  if (!src.includes(imp) || !src.includes(env)) throw new PatchError('ModelViewer patch does not apply to the upstream version');
  return src
    .replace(imp, "import { ContactShadows, Environment, Lightformer, useFBX, useGLTF } from '@react-three/drei';")
    .replace(
      env,
      `      {environment === 'studio-local' ? (
        <Environment resolution={256} environmentIntensity={intensity}>
          <color attach="background" args={['#1b1f2a']} />
          <Lightformer form="rect" intensity={4} position={[0, 5, -2]} scale={[10, 3, 1]} rotation-x={Math.PI / 2} />
          <Lightformer form="rect" intensity={2.5} position={[-5, 1, 2]} scale={[3, 6, 1]} rotation-y={Math.PI / 2} />
          <Lightformer form="rect" intensity={2.5} position={[5, 1, 2]} scale={[3, 6, 1]} rotation-y={-Math.PI / 2} />
          <Lightformer form="rect" intensity={1.2} color="#7fd3ff" position={[0, -1, 6]} scale={[8, 2, 1]} />
          <Lightformer form="ring" intensity={3} position={[2, 3, 4]} scale={2} />
        </Environment>
      ) : (
        environment !== 'none' && <Environment preset={environment} environmentIntensity={intensity} />
      )}`
    );
};

const PATCHES = { GooeyNav: patchGooey, ModelViewer: patchModelViewer };

for (const name of COMPONENTS) {
  const dir = join(ROOT, name);
  try {
    const res = await fetch(`https://reactbits.dev/r/${name}-JS-CSS.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const item = await res.json();
    // patch everything first, then write, so a failed patch never leaves a half-updated component
    const files = item.files.map(file => {
      const out = basename(file.path);
      return [out, PATCHES[name] && out.endsWith('.jsx') ? PATCHES[name](file.content) : file.content];
    });
    await mkdir(dir, { recursive: true });
    for (const [out, content] of files) await writeFile(join(dir, out), content);
    console.log(`[reactbits] ${name} ok`);
  } catch (err) {
    try {
      await access(join(dir, `${name}.jsx`));
      console.warn(`[reactbits] ${name}: using local copy (${err.message})`);
    } catch {
      throw new Error(`[reactbits] could not get ${name}: ${err.message}`);
    }
  }
}
