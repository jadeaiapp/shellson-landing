/**
 * Shellson landing — görsel hattı.
 *
 * Pexels'ten seçilen konsept görselleri indirir, responsive boyutlara
 * düşürür, WebP + JPEG üretir ve her görsel için LQIP (bulanık ön izleme)
 * çıkarır. Sonuç `src/data/media.json` dosyasına yazılır.
 *
 * Kaynak fotoğraflar depoya `public/media/` altında iner; hiçbir görsel
 * dış siteden hotlink edilmez. Lisans: Pexels License (bkz. RESEARCH.md).
 */
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'public', 'media');
const CACHE_DIR = path.join(ROOT, '.cache', 'originals');
const DATA_FILE = path.join(ROOT, 'src', 'data', 'media.json');

const WIDTHS = [480, 960, 1600];
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36';

/** Seçilen görseller. `alt` metinleri sahneyi tarif eder; hiçbiri Shellson işi olarak sunulmaz. */
const SOURCES = [
  // --- Etkileşimli sahneler ---
  { id: 9257577,  slug: 'sahne-arac-ic',   group: 'scene', alt: 'Bir aracın içinden ön camdan dışarı bakış' },
  { id: 29012619, slug: 'sahne-salon',     group: 'scene', alt: 'Geniş pencereden bol gün ışığı alan aydınlık bir oturma odası' },

  // --- Otomotiv ---
  { id: 10126661, slug: 'oto-film-serme',  group: 'oto', alt: 'Bir araç kaputunun üzerine geniş şeffaf koruma filmi seriliyor' },
  { id: 10126663, slug: 'oto-rakle',       group: 'oto', alt: 'Eldivenli eller, araç panel kenarında filmi rakleyle yüzeye yediriyor' },
  { id: 6025950,  slug: 'oto-film-yayma',  group: 'oto', alt: 'Bir araç yüzeyine yayılan filmin elle düzeltilmesi' },
  { id: 21912674, slug: 'oto-kapi-cami',   group: 'oto', alt: 'Bir aracın yan kapı camı ve dikiz aynası yakın plan' },
  { id: 6873098,  slug: 'oto-atolye',      group: 'oto', alt: 'Atölye ortamında hazırlık aşamasındaki bir otomobil' },
  { id: 16052482, slug: 'oto-cam-manzara', group: 'oto', alt: 'Açık araç kapısının camından dışarıdaki manzaraya bakış' },

  // --- Mimari ---
  { id: 13005096, slug: 'bina-jaluzi',     group: 'bina', alt: 'Sade bir odada jaluzili pencere ve pencere önü' },
  { id: 16566147, slug: 'bina-cephe-cizgi',group: 'bina', alt: 'İnce çizgili cam giydirme cephenin yakın planı' },
  { id: 34362345, slug: 'bina-kavisli',    group: 'bina', alt: 'Kavisli cam cepheye sahip modern bir bina' },
  { id: 26707879, slug: 'bina-grid',       group: 'bina', alt: 'Modern bir binanın ızgara desenli cam cephesi' },
  { id: 35188667, slug: 'bina-ofis-aksam', group: 'bina', alt: 'Akşam saatinde camlarından ışık sızan ofis binası' },
];

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function download(id, dest) {
  if (await exists(dest)) return;
  const url = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1800`;
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length > 20000) { await fs.writeFile(dest, buf); return; }
    }
    await new Promise((r) => setTimeout(r, attempt * 4000));
  }
  throw new Error(`indirilemedi: ${id}`);
}

/** Pexels fotoğraf sayfasından fotoğrafçı adını çeker; başarısız olursa null döner. */
async function credit(id) {
  try {
    const res = await fetch(`https://www.pexels.com/photo/${id}/`, { headers: { 'User-Agent': UA } });
    if (!res.ok) return null;
    const html = await res.text();
    const m = html.match(/"photographer"\s*:\s*"([^"]{2,60})"/) ||
              html.match(/content="Photo by ([^"]{2,60}) (?:on|from) Pexels/i) ||
              html.match(/<meta name="description" content="[^"]*?by ([A-Za-zÀ-ÿ' .-]{2,40})[^"]*?"/);
    return m ? m[1].trim() : null;
  } catch { return null; }
}

await fs.mkdir(OUT_DIR, { recursive: true });
await fs.mkdir(CACHE_DIR, { recursive: true });
await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });

const manifest = {};

for (const src of SOURCES) {
  const original = path.join(CACHE_DIR, `${src.id}.jpg`);
  await download(src.id, original);

  const image = sharp(original);
  const meta = await image.metadata();
  const ratio = meta.height / meta.width;

  const sizes = [];
  for (const w of WIDTHS) {
    if (w > meta.width) continue;
    const h = Math.round(w * ratio);
    await sharp(original).resize(w).webp({ quality: 74, effort: 5 })
      .toFile(path.join(OUT_DIR, `${src.slug}-${w}.webp`));
    sizes.push({ w, h });
  }
  // Tarayıcı desteği için tek bir JPEG yedeği
  await sharp(original).resize(1200).jpeg({ quality: 76, mozjpeg: true })
    .toFile(path.join(OUT_DIR, `${src.slug}-1200.jpg`));

  const lqipBuf = await sharp(original).resize(20).blur(1.4).webp({ quality: 32 }).toBuffer();

  const photographer = await credit(src.id);

  manifest[src.slug] = {
    slug: src.slug,
    group: src.group,
    alt: src.alt,
    width: meta.width,
    height: meta.height,
    ratio: Number(ratio.toFixed(4)),
    sizes,
    lqip: `data:image/webp;base64,${lqipBuf.toString('base64')}`,
    source: 'Pexels',
    sourceUrl: `https://www.pexels.com/photo/${src.id}/`,
    photographer: photographer || null,
    license: 'Pexels License',
  };
  console.log(`✓ ${src.slug} (${meta.width}×${meta.height})${photographer ? ` — ${photographer}` : ''}`);
}

await fs.writeFile(DATA_FILE, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(`\n${Object.keys(manifest).length} görsel işlendi → ${path.relative(ROOT, DATA_FILE)}`);
