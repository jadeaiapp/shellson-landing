/**
 * Fontları Google Fonts'tan indirip depoya gömer.
 *
 * Amaç: canlı sayfada üçüncü taraf font isteği olmaması. Türkçe karakterler
 * `latin-ext` alt kümesinde olduğu için hem `latin` hem `latin-ext` alınır.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Fontlar bilinçli olarak public/ yerine src/ altında tutuluyor: Vite bunları
// hash'leyip base path'e göre yeniden yazar, böylece GitHub Pages alt dizininde
// (/shellson-landing/) de doğru çözülürler.
const FONT_DIR = path.join(ROOT, 'src', 'assets', 'fonts');
const CSS_OUT = path.join(ROOT, 'src', 'styles', 'fonts.css');

// woff2 almak için modern bir tarayıcı UA'sı şart
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
// Bilinçli olarak 4 ağırlıkla sınırlı: mobil yükü düşük tutmak için.
// Türkçe (ı, ğ, ş, İ) latin-ext alt kümesinde olduğundan iki subset de gerekli.
const API = 'https://fonts.googleapis.com/css2?family=Archivo:wght@700;800&family=Karla:wght@400;600&display=swap';
const KEEP = new Set(['latin', 'latin-ext']);

await fs.mkdir(FONT_DIR, { recursive: true });

const css = await (await fetch(API, { headers: { 'User-Agent': UA } })).text();

// @font-face bloklarını sırayla gez; her bloğun üstündeki /* subset */ yorumunu takip et
const blocks = [...css.matchAll(/\/\*\s*([a-z0-9-]+)\s*\*\/\s*@font-face\s*\{([^}]+)\}/g)];
const out = [
  '/* Otomatik üretildi: node tools/fetch-fonts.mjs — elle düzenlemeyin. */',
  '/* Archivo & Karla, SIL Open Font License 1.1. Dosyalar src/assets/fonts/ altında. */',
  '',
];
let count = 0;

for (const [, subset, body] of blocks) {
  if (!KEEP.has(subset)) continue;
  const family = /font-family:\s*'([^']+)'/.exec(body)?.[1];
  // Archivo ve Karla değişken fonttur: Google tek bir @font-face içinde
  // "font-weight: 700 800" gibi bir ARALIK döndürür. Aralığı olduğu gibi
  // korumak şart — tek sayıya indirilirse üst ağırlık render edilmez.
  const weight = /font-weight:\s*([\d\s]+);/.exec(body)?.[1].trim();
  const style = /font-style:\s*(\w+)/.exec(body)?.[1] ?? 'normal';
  const url = /src:\s*url\(([^)]+)\)/.exec(body)?.[1];
  const range = /unicode-range:\s*([^;]+);/.exec(body)?.[1];
  if (!family || !weight || !url) continue;

  const file = `${family.toLowerCase().replace(/\s+/g, '-')}-${weight.replace(/\s+/g, '-')}-${subset}.woff2`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  await fs.writeFile(path.join(FONT_DIR, file), Buffer.from(await res.arrayBuffer()));
  count++;

  out.push(
    '@font-face {',
    `  font-family: '${family}';`,
    `  font-style: ${style};`,
    `  font-weight: ${weight};`,
    '  font-display: swap;',
    `  src: url('../assets/fonts/${file}') format('woff2');`,
    range ? `  unicode-range: ${range};` : '',
    '}',
    ''
  );
  console.log(`✓ ${file}`);
}

await fs.mkdir(path.dirname(CSS_OUT), { recursive: true });
await fs.writeFile(CSS_OUT, out.filter((l) => l !== '').join('\n') + '\n', 'utf8');
console.log(`\n${count} font dosyası → src/assets/fonts/, css → src/styles/fonts.css`);
