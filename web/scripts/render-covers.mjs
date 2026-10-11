// Render scripts/covers.py output (SVG) to WebP covers in public/images/projects.
// Usage: python scripts/covers.py .covers && node scripts/render-covers.mjs .covers
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const src = process.argv[2] ?? '.covers';
const out = 'public/images/projects';
fs.mkdirSync(out, { recursive: true });
for (const f of fs.readdirSync(src).filter((f) => f.endsWith('.svg'))) {
  await sharp(path.join(src, f), { density: 96 }).webp({ quality: 86 }).toFile(path.join(out, f.replace('.svg', '.webp')));
  console.log('rendered', f);
}
