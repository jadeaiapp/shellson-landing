/**
 * Shellson landing — otomatik kontrol paketi.
 *
 * Üretim build'ini gerçek bir tarayıcıda (Chromium) açar ve şunları doğrular:
 * demo modu güvenliği, responsive davranış, akışlar, WhatsApp mesajları,
 * erişilebilirlik, kontrast ve konsol temizliği.
 *
 * Kullanım:  node tools/check.mjs [taban-url]
 * Taban URL verilmezse `dist/` üzerinden yerel bir statik sunucu başlatılır.
 */
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const BASE_PATH = '/shellson-landing/';
const SHOTS = path.join(ROOT, 'screenshots');

const WIDTHS = [360, 390, 430, 768, 1024, 1440, 1920];
const PHONE_DIGITS = '905550441082';
const DEAD_DOMAINS = ['otocamfilmcisi.com', 'shellsonwindowfilm.com'];

const results = [];
let failures = 0;

function check(name, passed, detail = '') {
  results.push({ name, passed, detail });
  if (!passed) failures++;
  const mark = passed ? 'PASS' : 'FAIL';
  console.log(`  [${mark}] ${name}${detail ? ` — ${detail}` : ''}`);
}

function section(title) {
  console.log(`\n── ${title} ${'─'.repeat(Math.max(0, 58 - title.length))}`);
}

// ---------------------------------------------------------------------------
// Basit statik sunucu (GitHub Pages alt dizinini taklit eder)
// ---------------------------------------------------------------------------
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
};

function startServer() {
  const server = http.createServer((req, res) => {
    let urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (!urlPath.startsWith(BASE_PATH)) {
      res.writeHead(404).end('not found');
      return;
    }
    let rel = urlPath.slice(BASE_PATH.length) || 'index.html';
    if (rel.endsWith('/')) rel += 'index.html';
    const file = path.join(DIST, rel);
    if (!file.startsWith(DIST) || !fsSync.existsSync(file) || fsSync.statSync(file).isDirectory()) {
      res.writeHead(404).end('not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream' });
    fsSync.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

// ---------------------------------------------------------------------------
// WCAG kontrast
// ---------------------------------------------------------------------------
function channel(value) {
  const c = value / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance([r, g, b]) {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a, b) {
  const l1 = luminance(a);
  const l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function parseRGB(value) {
  const m = value.match(/rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}

// ---------------------------------------------------------------------------

const { server, port } = await startServer();
const base = process.argv[2] ?? `http://127.0.0.1:${port}${BASE_PATH}`;
console.log(`\nTest edilen adres: ${base}\n${'='.repeat(66)}`);

await fs.mkdir(SHOTS, { recursive: true });

const browser = await chromium.launch();

// =========================================================================
section('1. Demo modu güvenliği');
// =========================================================================
{
  const html = await fs.readFile(path.join(DIST, 'index.html'), 'utf8');
  const robots = /<meta name="robots" content="([^"]+)"/.exec(html)?.[1] ?? '';
  for (const directive of ['noindex', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex']) {
    check(`robots meta: ${directive}`, robots.includes(directive), robots);
  }
  check('JSON-LD schema YOK', !/application\/ld\+json/i.test(html));
  check('Sayfa başlığı konsept olduğunu söylüyor', /<title>[^<]*[Kk]onsept/.test(html));
  check('og:title konsept olduğunu söylüyor', /og:title" content="[^"]*[Kk]onsept/.test(html));

  const robotsTxt = await fs.readFile(path.join(DIST, 'robots.txt'), 'utf8');
  check('robots.txt indekslemeyi kapatıyor', /User-agent:\s*\*/i.test(robotsTxt) && /Disallow:\s*\//.test(robotsTxt));
}

// =========================================================================
section('2. Responsive: yatay taşma ve konsol');
// =========================================================================
for (const width of WIDTHS) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
  page.on('pageerror', (err) => errors.push(String(err)));

  await page.goto(base, { waitUntil: 'networkidle' });

  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    const widest = [...document.querySelectorAll('body *')]
      .filter((el) => el.getBoundingClientRect().right > doc.clientWidth + 1)
      .map((el) => `${el.tagName}.${el.className || '-'}`);
    return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, widest: widest.slice(0, 4) };
  });

  check(
    `${width}px — yatay taşma yok`,
    overflow.scrollWidth <= overflow.clientWidth + 1,
    `scrollWidth=${overflow.scrollWidth} clientWidth=${overflow.clientWidth} ${overflow.widest.join(', ')}`
  );
  check(`${width}px — konsol hatası yok`, errors.length === 0, errors.slice(0, 2).join(' | '));

  await context.close();
}

// =========================================================================
section('3. Mobilde ana CTA kaydırmadan görünüyor mu?');
// =========================================================================
for (const width of [360, 390, 430]) {
  const context = await browser.newContext({ viewport: { width, height: 640 } });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });

  const visible = await page.evaluate(() => {
    const cta = document.querySelector('.hero__actions .btn--primary');
    if (!cta) return null;
    const r = cta.getBoundingClientRect();
    return { bottom: Math.round(r.bottom), vh: window.innerHeight, text: cta.textContent.trim() };
  });

  check(
    `${width}×640 — ana CTA fold üstünde`,
    visible !== null && visible.bottom <= visible.vh,
    visible ? `alt kenar ${visible.bottom}px / ${visible.vh}px — "${visible.text}"` : 'CTA bulunamadı'
  );
  await context.close();
}

// =========================================================================
section('4. Dokunma hedefleri (min 44px)');
// =========================================================================
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelectorAll('details').forEach((d) => (d.open = true)));

  const small = await page.evaluate(() => {
    const out = [];
    const nodes = document.querySelectorAll('a[href], button, select, input:not([type=range]), textarea, summary');
    for (const el of nodes) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue; // gizli
      if (el.closest('[hidden]')) continue;
      if (r.height < 44 || r.width < 24) {
        const label = (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 24);
        out.push(
          `<${el.tagName.toLowerCase()} class="${el.className || '-'}"> "${label}" ${Math.round(r.width)}×${Math.round(r.height)}`
        );
      }
    }
    return out;
  });

  check('Tüm dokunma hedefleri ≥44px yükseklik', small.length === 0, small.slice(0, 6).join(' | '));
  await context.close();
}

// =========================================================================
section('5. Yol seçimi ve hizmet → form aktarımı');
// =========================================================================
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });

  await page.click('.pathcard--arac');
  check('Araç yolu seçilince body[data-path]=arac', (await page.getAttribute('body', 'data-path')) === 'arac');
  check('Araç formu görünür', await page.isVisible('#panel-arac'));
  check('Bina formu gizli', !(await page.isVisible('#panel-bina')));
  check(
    'Hizmet başlığı araç tarafına döndü',
    (await page.textContent('[data-render="services-title"]')) === 'Otomotiv çözümleri'
  );

  await page.click('.pathcard--bina');
  check('Bina yolu seçilince body[data-path]=bina', (await page.getAttribute('body', 'data-path')) === 'bina');
  check('Bina formu görünür', await page.isVisible('#panel-bina'));
  check(
    'Bina yorumu uyarısı gösteriliyor',
    (await page.textContent('.reviews__note')).includes('bina yorumu gösterilmiyor')
  );

  // Hizmet kartı → form önayarı
  await page.click('.pathcard--arac');
  const firstCardTitle = await page.textContent('.autocard .autocard__title');
  await page.click('.autocard .autocard__action button');
  const selected = await page.inputValue('#arac-service');
  check('Hizmet kartı formu önayarlıyor', selected === firstCardTitle, `${selected} = ${firstCardTitle}`);

  await context.close();
}

// =========================================================================
section('6. WhatsApp mesajları ve numara');
// =========================================================================
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    window.__opened = [];
    window.open = (url) => {
      window.__opened.push(url);
      return null;
    };
  });

  // --- Araç formu ---
  await page.click('[data-choose-path="arac"].quote__tab');
  await page.fill('#arac-brand', 'BMW');
  await page.fill('#arac-model', '3 Serisi');
  await page.selectOption('#arac-year', '2022');
  await page.selectOption('#arac-service', 'Oto cam filmi');
  await page.fill('#arac-area', 'yan ve arka camlar');
  await page.fill('#arac-phone', '0532 111 22 33');
  await page.fill('#arac-note', 'Hafta sonu uygun olurum');

  const preview = await page.textContent('#panel-arac .qform__preview-text');
  check('Araç ön izlemesi araç bilgisini içeriyor', preview.includes('2022 model BMW 3 Serisi'), preview.slice(0, 80));

  await page.click('#panel-arac button[type="submit"]');
  const vehicleUrl = (await page.evaluate(() => window.__opened))[0] ?? '';
  const vehicleText = decodeURIComponent((vehicleUrl.split('text=')[1] ?? '').replace(/\+/g, ' '));

  check('Araç WhatsApp numarası doğru', vehicleUrl.startsWith(`https://wa.me/${PHONE_DIGITS}?`), vehicleUrl.slice(0, 46));
  check('Mesaj araç bilgisini taşıyor', vehicleText.includes('2022 model BMW 3 Serisi'));
  check('Mesaj hizmeti taşıyor', vehicleText.includes('oto cam filmi'));
  // Numara okunur biçimde yazılmalı: 0532 111 22 33
  check('Mesaj telefonu okunur biçimde taşıyor', vehicleText.includes('0532 111 22 33'));
  check('Mesaj notu taşıyor', vehicleText.includes('Hafta sonu uygun olurum'));
  console.log(`         → "${vehicleText}"`);

  // --- Bina formu ---
  await page.evaluate(() => (window.__opened = []));
  await page.click('[data-choose-path="bina"].quote__tab');
  await page.selectOption('#bina-space', 'Ofis');
  await page.fill('#bina-location', 'Kağıthane');
  await page.selectOption('#bina-need', 'Isı ve güneş kontrolü');
  await page.fill('#bina-size', '25 m²');
  await page.fill('#bina-phone', '05321112233');
  await page.click('#panel-bina button[type="submit"]');

  const buildingUrl = (await page.evaluate(() => window.__opened))[0] ?? '';
  const buildingText = decodeURIComponent((buildingUrl.split('text=')[1] ?? '').replace(/\+/g, ' '));
  check('Bina WhatsApp numarası doğru', buildingUrl.startsWith(`https://wa.me/${PHONE_DIGITS}?`));
  check('Bina mesajı konumu taşıyor', buildingText.includes('Kağıthane'));
  check('Bina mesajı mekânı taşıyor', buildingText.includes('ofis'));
  check('Bina mesajı ölçüyü taşıyor', buildingText.includes('25 m²'));
  console.log(`         → "${buildingText}"`);

  // --- Doğrulama ---
  await page.evaluate(() => (window.__opened = []));
  await page.click('[data-choose-path="arac"].quote__tab');
  await page.fill('#arac-brand', '');
  await page.fill('#arac-phone', '123');
  await page.click('#panel-arac button[type="submit"]');
  check('Eksik alanla gönderim engellendi', (await page.evaluate(() => window.__opened.length)) === 0);
  check('Hata mesajı görünüyor', await page.isVisible('#panel-arac .field.is-invalid .field__error'));

  await page.fill('#arac-brand', 'Renault');
  await page.click('#panel-arac button[type="submit"]');
  check(
    'Geçersiz telefon yakalandı',
    (await page.textContent('#panel-arac [data-field="phone"] .field__error')).includes('10 haneli')
  );

  await context.close();
}

// =========================================================================
section('7. Galeri, lightbox ve klavye');
// =========================================================================
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });

  const all = await page.locator('.gallery__grid .shot').count();
  await page.click('.gallery__filters [data-filter="bina"]');
  const buildingOnly = await page.locator('.gallery__grid .shot').count();
  check('Galeri filtresi çalışıyor', buildingOnly > 0 && buildingOnly < all, `tümü=${all}, bina=${buildingOnly}`);

  await page.click('.gallery__filters [data-filter="tumu"]');
  await page.click('.gallery__grid .shot__btn');
  check('Lightbox açıldı', await page.isVisible('#lightbox'));

  const firstSrc = await page.getAttribute('.lightbox__img', 'src');
  await page.keyboard.press('ArrowRight');
  const secondSrc = await page.getAttribute('.lightbox__img', 'src');
  check('Ok tuşuyla sonraki görsel', firstSrc !== secondSrc);

  check(
    'Lightbox konsept etiketi taşıyor',
    (await page.textContent('.lightbox__caption')).includes('Konsept görsel')
  );

  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  check('Escape lightbox’ı kapatıyor', !(await page.isVisible('#lightbox')));
  check(
    'Odak açan düğmeye döndü',
    await page.evaluate(() => document.activeElement?.classList.contains('shot__btn') === true)
  );

  // Sekmeyle galeriye ulaşılabiliyor mu
  const reachable = await page.evaluate(() => {
    const btn = document.querySelector('.shot__btn');
    btn.focus();
    return document.activeElement === btn;
  });
  check('Galeri düğmeleri klavyeyle odaklanabiliyor', reachable);

  await context.close();
}

// =========================================================================
section('8. Bağlantılar: ölü domain yok, doğru numaralar');
// =========================================================================
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });

  const links = await page.evaluate(() =>
    [...document.querySelectorAll('a[href], iframe[src]')].map((el) => el.getAttribute('href') ?? el.getAttribute('src'))
  );

  for (const domain of DEAD_DOMAINS) {
    check(`Ölü domaine bağlantı yok: ${domain}`, !links.some((href) => href?.includes(domain)));
  }

  const telLinks = links.filter((href) => href?.startsWith('tel:'));
  check('tel: bağlantıları doğru numarada', telLinks.length > 0 && telLinks.every((href) => href === 'tel:+905550441082'), telLinks.join(' '));

  const waLinks = links.filter((href) => href?.includes('wa.me'));
  check('wa.me bağlantıları doğru numarada', waLinks.length > 0 && waLinks.every((href) => href.includes(PHONE_DIGITS)));

  check('Eski telefon numarası sayfada geçmiyor', !(await page.content()).includes('0533 770 60 65'));
  check('Eski adres sayfada geçmiyor', !(await page.content()).includes('Taşocağı'));

  const instagram = links.find((href) => href?.includes('instagram.com'));
  check('Instagram bağlantısı var', Boolean(instagram), instagram ?? '');

  const maps = links.find((href) => href?.includes('maps.app.goo.gl'));
  check('Google Haritalar bağlantısı var', Boolean(maps), maps ?? '');

  // Boş / yer tutucu bağlantı olmasın
  const dead = links.filter((href) => !href || href === '#' || href === 'javascript:void(0)');
  check('Boş veya # bağlantı yok', dead.length === 0, `${dead.length} adet`);

  await context.close();
}

// =========================================================================
section('9. Hareket azaltma (prefers-reduced-motion)');
// =========================================================================
{
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });

  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll('[data-reveal]')].filter(
      (el) => Number(getComputedStyle(el).opacity) < 0.9
    ).length
  );
  check('Reduced motion’da hiçbir içerik gizli kalmıyor', hidden === 0, `${hidden} gizli eleman`);

  const animated = await page.evaluate(() => {
    const el = document.querySelector('.section-head');
    return getComputedStyle(el).animationDuration;
  });
  check('Animasyon süresi sıfırlanmış', parseFloat(animated) < 0.01, animated);

  await context.close();
}

// =========================================================================
section('10. Kontrast (WCAG AA)');
// =========================================================================
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });

  const samples = await page.evaluate(() => {
    const targets = [
      ['Hero başlık', '.hero__title'],
      ['Hero açıklama', '.hero__lede'],
      ['Bölüm açıklaması', '.section-lede'],
      ['Birincil düğme', '.hero__actions .btn--primary'],
      ['Çerçeveli düğme', '.hero__actions .btn--outline'],
      ['Eyebrow', '.eyebrow'],
      ['Konsept şeridi', '.concept-strip__text'],
      ['Yorum metni', '.reviewcard__quote'],
      ['Yorum meta', '.reviewcard__meta'],
      ['Kart açıklaması', '.autocard__blurb'],
      ['Form etiketi', '.field__label'],
      ['Form ipucu', '.field__hint'],
      ['Footer metni', '.site-footer__meta p'],
      ['SSS cevabı', '.qa__body p'],
      ['Film paneli notu', '.filmpane__note'],
      ['Mekân ölçü etiketi', '.spacecard__measure'],
      ['Hizmet grubu sayacı', '.svcgroup__count'],
      ['İletişim etiketi', '.contact__label'],
      ['Uyarı kutusu', '.disclaimer'],
      ['Hero fact notu', '.hero__fact-note'],
    ];

    function bgOf(el) {
      let node = el;
      while (node && node !== document.documentElement) {
        const bg = getComputedStyle(node).backgroundColor;
        const m = bg.match(/rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s]+([\d.]+))?/);
        if (m && (m[4] === undefined || Number(m[4]) > 0.85)) return bg;
        node = node.parentElement;
      }
      return getComputedStyle(document.body).backgroundColor;
    }

    return targets
      .map(([label, selector]) => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const style = getComputedStyle(el);
        return {
          label,
          color: style.color,
          background: bgOf(el),
          size: parseFloat(style.fontSize),
          weight: Number(style.fontWeight),
        };
      })
      .filter(Boolean);
  });

  for (const sample of samples) {
    const fg = parseRGB(sample.color);
    const bg = parseRGB(sample.background);
    if (!fg || !bg) continue;
    const ratio = contrast(fg, bg);
    // Büyük metin eşiği: >=24px veya >=18.66px + bold
    const large = sample.size >= 24 || (sample.size >= 18.66 && sample.weight >= 700);
    const threshold = large ? 3 : 4.5;
    check(
      `Kontrast — ${sample.label}`,
      ratio >= threshold,
      `${ratio.toFixed(2)}:1 (gerekli ${threshold}:1, ${Math.round(sample.size)}px)`
    );
  }

  await context.close();
}

// =========================================================================
section('11. Ekran görüntüleri');
// =========================================================================
{
  const shots = [
    { name: 'masaustu-1440', width: 1440, height: 900 },
    { name: 'mobil-390', width: 390, height: 844 },
  ];

  const SECTIONS = ['#yol', '#hizmetler', '#ton', '#uygulamalar', '#neden', '#yorumlar', '#teklif', '#sss', '#iletisim'];

  for (const shot of shots) {
    const context = await browser.newContext({ viewport: { width: shot.width, height: shot.height } });
    const page = await context.newPage();
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1400); // hero ipucu animasyonu otursun

    await page.screenshot({ path: path.join(SHOTS, `${shot.name}-hero.png`) });

    // Tam sayfa görüntüsünden ÖNCE sayfayı baştan sona gezerek reveal
    // animasyonlarını tetikle; aksi hâlde ekran görüntüsünde bölümler boş çıkar.
    await page.evaluate(async () => {
      // `behavior: 'instant'` şart: sayfada scroll-behavior: smooth var ve
      // ardışık yumuşak kaydırmalar birbirini iptal ederek sayfanın aşağısına
      // hiç inilmemesine yol açıyor.
      const step = Math.round(window.innerHeight * 0.6);
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo({ top: y, behavior: 'instant' });
        await new Promise((r) => setTimeout(r, 110));
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 250));
    });
    await page.waitForTimeout(600);

    await page.screenshot({ path: path.join(SHOTS, `${shot.name}-tam.png`), fullPage: true });

    // Bölüm bölüm görüntüler — tasarımı okunur ölçekte incelemek için
    if (shot.width === 1440) {
      for (const selector of SECTIONS) {
        const element = await page.$(selector);
        if (!element) continue;
        await element.screenshot({ path: path.join(SHOTS, `bolum${selector.replace('#', '-')}.png`) });
      }
    }

    console.log(`  kaydedildi: screenshots/${shot.name}-*.png`);
    await context.close();
  }

  // PNG'ler ham ve çok büyük (tam sayfa ~15000px). Depoya girecek hafif
  // WebP kopyalar üret; PNG'ler .gitignore'da.
  const { default: sharp } = await import('sharp');
  let saved = 0;
  for (const file of await fs.readdir(SHOTS)) {
    if (!file.endsWith('.png')) continue;
    const source = path.join(SHOTS, file);
    const target = path.join(SHOTS, file.replace(/\.png$/, '.webp'));
    // WebP en fazla 16383px kenar destekler; tam sayfa görüntüleri bunu
    // aşabildiği için yükseklik de sınırlanır.
    await sharp(source, { limitInputPixels: false })
      .resize({ width: 1200, height: 12000, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 76 })
      .toFile(target);
    saved++;
  }
  console.log(`  ${saved} ekran görüntüsü WebP'ye çevrildi`);
}

// ---------------------------------------------------------------------------
await browser.close();
server.close();

console.log(`\n${'='.repeat(66)}`);
const passed = results.length - failures;
console.log(`SONUÇ: ${passed}/${results.length} kontrol geçti.`);
if (failures > 0) {
  console.log('\nBaşarısız kontroller:');
  for (const r of results.filter((x) => !x.passed)) console.log(`  · ${r.name} — ${r.detail}`);
}
process.exit(failures > 0 ? 1 : 0);
