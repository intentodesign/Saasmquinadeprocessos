/**
 * Gera favicons em múltiplos formatos usando sharp
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, 'public');
const SVG_FILE = join(PUBLIC_DIR, 'logo.svg');

const SIZES = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
];

async function generateFavicons() {
  console.log('🎨 Gerando favicons a partir do logo.svg...');

  const svgBuffer = readFileSync(SVG_FILE);

  for (const { name, size } of SIZES) {
    console.log(`  → Gerando ${name}...`);

    await sharp(svgBuffer)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(join(PUBLIC_DIR, name));
  }

  console.log('\n✅ Favicons gerados com sucesso!');
  console.log('   - favicon-16x16.png');
  console.log('   - favicon-32x32.png');
  console.log('   - apple-touch-icon.png');
  console.log('   - android-chrome-192x192.png');
  console.log('   - android-chrome-512x512.png');
  console.log('   - favicon.svg (mantido)');
}

generateFavicons().catch(console.error);
