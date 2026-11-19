// Downloads the React Bits components (GooeyNav, HoloCard, SpotlightCard) from the official registry at build time.
import { mkdir, writeFile, access } from 'node:fs/promises';
import { basename, join } from 'node:path';

const COMPONENTS = ['GooeyNav', 'HoloCard', 'SpotlightCard'];
const ROOT = join(process.cwd(), 'components', 'reactbits');

const patchGooey = src => {
  const prop = "  hoverEffect = true,\n  className = '',";
  const click = "          if (!item.href || item.href === '#') event.preventDefault();\n          select(index);";
  if (!src.includes(prop) || !src.includes(click)) {
    console.warn('[reactbits] GooeyNav patch skipped (upstream changed); links will use full page loads.');
    return src;
  }
  return src.replace(prop, "  hoverEffect = true,\n  onNavigate,\n  className = '',").replace(
    click,
    "          if (!item.href || item.href === '#') event.preventDefault();\n          if (onNavigate && !event.metaKey && !event.ctrlKey && !event.shiftKey) {\n            event.preventDefault();\n            select(index);\n            onNavigate(item, index);\n            return;\n          }\n          select(index);"
  );
};

for (const name of COMPONENTS) {
  const dir = join(ROOT, name);
  try {
    const res = await fetch(`https://reactbits.dev/r/${name}-JS-CSS.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const item = await res.json();
    await mkdir(dir, { recursive: true });
    for (const file of item.files) {
      const out = basename(file.path);
      const content = name === 'GooeyNav' && out.endsWith('.jsx') ? patchGooey(file.content) : file.content;
      await writeFile(join(dir, out), content);
    }
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
