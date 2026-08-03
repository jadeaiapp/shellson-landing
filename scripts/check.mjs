/**
 * Shellson konsept sitesi — gerçek tarayıcı kontrol takımı
 *
 *   npm run check              → dist/ üzerinde önizleme sunucusu açıp test eder
 *   npm run check -- --url X   → canlı adresi test eder (GitHub Pages doğrulaması)
 *
 * Kapsam: demo modu güvenliği, duyarlılık (7 genişlik), yatay taşma, dokunma
 * hedefleri, iki yollu akış, form doğrulama, WhatsApp mesajı, galeri/lightbox,
 * klavye kullanımı, reduced-motion, ölü bağlantı ve console hataları.
 */

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

const WIDTHS = [360, 390, 430, 768, 1024, 1440, 1920];
const SHOT_WIDTHS = new Set([390, 768, 1440]);
const WA_NUMBER = '905550441082';
const SHOT_DIR = 'screenshots';

const argUrl = (() => {
  const i = process.argv.indexOf('--url');
  return i > -1 ? process.argv[i + 1] : null;
})();

/* ── Küçük test koşucusu ──────────────────────────────────────────────────── */

const results = [];
let failures = 0;

function check(name, pass, detail = '') {
  results.push({ name, pass, detail });
  if (!pass) failures++;
  const mark = pass ? '  OK  ' : ' FAIL ';
  console.log(`[${mark}] ${name}${detail ? ` — ${detail}` : ''}`);
}

function section(title) {
  console.log(`\n──── ${title} ${'─'.repeat(Math.max(0, 62 - title.length))}`);
}

/**
 * Sayfayı baştan sona kaydırıp başa döner. Reveal animasyonları
 * IntersectionObserver ile tetiklendiği için tam sayfa ekran görüntüsü
 * almadan önce bu gerekli — aksi halde henüz açılmamış bölümler boş çıkar.
 */
async function settle(p) {
  await p.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.7);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(900);
}

/* ── Önizleme sunucusu ────────────────────────────────────────────────────── */

async function startPreview() {
  const proc = spawn('npx', ['vite', 'preview', '--port', '4179', '--strictPort'], {
    stdio: 'pipe',
    shell: true,
  });
  proc.stdout.on('data', () => {});
  proc.stderr.on('data', () => {});

  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch('http://localhost:4179/shellson-landing/');
      if (r.ok) return { proc, url: 'http://localhost:4179/shellson-landing/' };
    } catch {
      /* henüz hazır değil */
    }
    await sleep(300);
  }
  throw new Error('Önizleme sunucusu açılmadı');
}

/* ── Ana akış ─────────────────────────────────────────────────────────────── */

const preview = argUrl ? null : await startPreview();
const BASE = argUrl ?? preview.url;
console.log(`\nHedef: ${BASE}\n`);

mkdirSync(SHOT_DIR, { recursive: true });

const browser = await chromium.launch();
const consoleErrors = [];
const pageErrors = [];
const failedRequests = [];

const ctx = await browser.newContext({ locale: 'tr-TR' });
const page = await ctx.newPage();

page.on('console', (m) => {
  if (m.type() === 'error') consoleErrors.push(m.text());
});
page.on('pageerror', (e) => pageErrors.push(String(e)));
const mapResponses = [];
page.on('response', (r) => {
  if (r.url().includes('maps.google.com') || r.url().includes('google.com/maps')) {
    mapResponses.push(r.status());
  }
});
page.on('requestfailed', (r) => {
  const u = r.url();
  // Harita gömme çerçevesi test ortamında engellenebilir; iç varlıklar önemli
  if (u.startsWith(BASE)) failedRequests.push(`${u} (${r.failure()?.errorText})`);
});

await page.goto(BASE, { waitUntil: 'networkidle' });

/* ═══ 1. DEMO MODU GÜVENLİĞİ ═══════════════════════════════════════════════ */

section('Demo modu güvenliği');

const robots = await page.getAttribute('meta[name="robots"]', 'content');
for (const token of ['noindex', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex']) {
  check(`robots meta: ${token}`, (robots ?? '').includes(token), robots ?? 'meta yok');
}

const ldCount = await page.locator('script[type="application/ld+json"]').count();
check('JSON-LD yayınlanmıyor (LocalBusiness yok)', ldCount === 0, `${ldCount} adet bulundu`);

const ribbon = page.locator('.ribbon__text');
check('Konsept şeridi görünür', await ribbon.isVisible());
check(
  'Konsept şeridi metni doğru',
  (await ribbon.textContent())?.includes('resmî web sitesi değildir') ?? false,
);

const footNote = await page.locator('.foot__disclaimer').textContent();
check('Footer konsept açıklaması var', (footNote ?? '').includes('resmî web sitesi değildir'));

const title = await page.title();
check('Başlıkta konsept ibaresi var', /konsept/i.test(title), title);

const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
check('Open Graph başlığında konsept ibaresi var', /konsept/i.test(ogTitle ?? ''), ogTitle ?? '');

const robotsTxt = await (await fetch(new URL('robots.txt', BASE))).text();
check('robots.txt indekslemeyi kapatıyor', /Disallow:\s*\/\s*$/m.test(robotsTxt));

/* ═══ 2. DUYARLILIK & TAŞMA ════════════════════════════════════════════════ */

section('Duyarlılık — yatay taşma ve ekran görüntüleri');

for (const w of WIDTHS) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.waitForTimeout(260);

  const overflow = await page.evaluate(() => {
    const de = document.documentElement;
    const over = [];
    if (de.scrollWidth > window.innerWidth + 1) {
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && (r.right > window.innerWidth + 1 || r.left < -1)) {
          over.push(`${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]}`);
        }
      }
    }
    return { scrollWidth: de.scrollWidth, inner: window.innerWidth, culprits: over.slice(0, 5) };
  });

  check(
    `${w}px — yatay taşma yok`,
    overflow.scrollWidth <= overflow.inner + 1,
    overflow.culprits.length ? `taşıran: ${overflow.culprits.join(', ')}` : '',
  );

  if (SHOT_WIDTHS.has(w)) {
    await settle(page);
    await page.screenshot({ path: `${SHOT_DIR}/masaustu-${w}.png`, fullPage: true });
  }
}

/* ═══ 3. MOBİLDE ANA CTA KATLAMA ÜSTÜNDE ═══════════════════════════════════ */

section('Mobil — ana CTA kaydırmadan görünüyor mu');

for (const w of [360, 390, 430]) {
  await page.setViewportSize({ width: w, height: 640 });
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);

  const box = await page.locator('.hero__cta .btn').first().boundingBox();
  check(
    `${w}×640 — birincil CTA katlama üstünde`,
    !!box && box.y + box.height <= 640,
    box ? `alt kenar ${Math.round(box.y + box.height)}px` : 'buton bulunamadı',
  );
}

/* ═══ 4. DOKUNMA HEDEFLERİ ═════════════════════════════════════════════════ */

section('Dokunma hedefleri (min 44×44)');

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(BASE, { waitUntil: 'networkidle' });

const small = await page.evaluate(() => {
  const sel = 'a[href], button, input, select, textarea, summary, [role="radio"]';
  const bad = [];
  for (const el of document.querySelectorAll(sel)) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue; // gizli
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    if (el.closest('.sr-only')) continue;
    if (r.height < 44 || r.width < 44) {
      bad.push(
        `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]} ${Math.round(r.width)}×${Math.round(r.height)}`,
      );
    }
  }
  return bad;
});
check('Tüm dokunulabilir hedefler ≥44px', small.length === 0, small.slice(0, 6).join(' | '));

/* ═══ 5. İKİ YOLLU AKIŞ ════════════════════════════════════════════════════ */

section('İki yollu akış (araç ↔ bina)');

await page.setViewportSize({ width: 1440, height: 960 });
await page.goto(BASE, { waitUntil: 'networkidle' });

check(
  'Açılışta araç yolu etkin',
  (await page.getAttribute('html', 'data-path')) === 'arac',
);

// Bina yoluna geç
await page.locator('.pcard[data-path="yapi"]').click();
await page.waitForTimeout(500);
check('Bina kartı yolu değiştirdi', (await page.getAttribute('html', 'data-path')) === 'yapi');
check('URL yolu taşıyor (?yol=yapi)', page.url().includes('yol=yapi'), page.url());
check('Bina hizmet bölümü göründü', await page.locator('.arch__lead').isVisible());
check('Otomotiv kartları gizlendi', (await page.locator('.svc-grid').count()) === 0);
check('SSS bina grubuna geçti', (await page.locator('.fq__q').first().textContent())?.includes('Bina cam filmi ne işe yarar') ?? false);

// Vurgu rengi değişti mi
const archAccent = await page.evaluate(() =>
  getComputedStyle(document.documentElement).getPropertyValue('--accent').trim(),
);
check('Bina yolunda vurgu rengi indigo', archAccent.includes('azure') || archAccent === '#3f51c4', archAccent);

// Derin bağlantı: yeniden yükle, seçim korunuyor mu
await page.reload({ waitUntil: 'networkidle' });
check('Yenilemede seçim korunuyor', (await page.getAttribute('html', 'data-path')) === 'yapi');

// Araç yoluna dön
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.locator('.pcard[data-path="arac"]').click();
await page.waitForTimeout(400);
check('Araç yoluna dönüldü', (await page.getAttribute('html', 'data-path')) === 'arac');
check('Otomotiv kartları göründü', (await page.locator('.svc').count()) === 4);

/* ═══ 6. HİZMET → FORM AKTARIMI ════════════════════════════════════════════ */

section('Hizmet seçimi → forma aktarım');

await page.locator('.svc').nth(1).locator('.svc__cta').click();
await page.waitForTimeout(900);
const svcVal = await page.locator('#f-service').inputValue();
check('PPF kartı formu ön seçti', svcVal === 'PPF boya koruma', svcVal);

const formInView = await page.locator('#teklif').evaluate((el) => {
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight && r.bottom > 0;
});
check('Form görünür alana kaydırıldı', formInView);

// Bina tarafında ihtiyaç aktarımı
await page.goto(`${BASE}?yol=yapi`, { waitUntil: 'networkidle' });
await page.locator('.need').nth(2).click();
await page.waitForTimeout(900);
const needVal = await page.locator('#f-need').inputValue();
check(
  'Mahremiyet kartı keşif formunu ön seçti',
  needVal === 'Dışarıdan görünmeme (mahremiyet)',
  needVal,
);

/* ═══ 7. FORM DOĞRULAMA ════════════════════════════════════════════════════ */

section('Form doğrulama');

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.locator('.form__submit').click();
await page.waitForTimeout(300);

const errCount = await page.locator('.field__error').count();
check('Boş gönderimde hatalar gösteriliyor', errCount >= 3, `${errCount} hata`);

const focused = await page.evaluate(() => document.activeElement?.getAttribute('name'));
check('Odak ilk hatalı alana taşındı', focused === 'brand', `odak: ${focused}`);

const roleAlert = await page.locator('.field__error[role="alert"]').count();
check('Hatalar role="alert" ile duyuruluyor', roleAlert >= 3);

// Geçersiz telefon
await page.fill('#f-brand', 'Renault');
await page.fill('#f-model', 'Clio');
await page.fill('#f-phone', '123');
await page.locator('#f-phone').blur();
await page.waitForTimeout(200);
const phoneErr = await page.locator('#f-phone-err').textContent();
check('Geçersiz telefon yakalanıyor', (phoneErr ?? '').includes('10 haneli'), phoneErr ?? '');

// Geçersiz yıl
await page.fill('#f-year', '1899');
await page.locator('#f-year').blur();
await page.waitForTimeout(200);
check('Geçersiz model yılı yakalanıyor', (await page.locator('#f-year-err').count()) === 1);

/* ═══ 8. WHATSAPP MESAJI ═══════════════════════════════════════════════════ */

section('WhatsApp mesajı');

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.evaluate(() => {
  window.__opened = null;
  window.open = (u) => {
    window.__opened = u;
    return null;
  };
});

await page.fill('#f-brand', 'BMW');
await page.fill('#f-model', '3 Serisi');
await page.fill('#f-year', '2022');
await page.selectOption('#f-service', 'Oto cam filmi');
await page.fill('#f-phone', '0555 044 10 82');
await page.fill('#f-note', 'Hafta içi müsaitim');
await page.waitForTimeout(200);

const preview1 = await page.locator('.preview__body').textContent();
check('Önizleme aracı doğru yazıyor', (preview1 ?? '').includes('2022 model BMW 3 Serisi'), preview1?.split('\n')[0]);
check('Önizleme telefonu normalize etti', (preview1 ?? '').includes('Telefon: 05550441082'));
check('Önizleme notu taşıyor', (preview1 ?? '').includes('Not: Hafta içi müsaitim'));

await page.locator('.form__submit').click();
await page.waitForTimeout(400);
const opened = await page.evaluate(() => window.__opened);
check('WhatsApp bağlantısı açıldı', !!opened);
check('Doğru WhatsApp numarası', (opened ?? '').includes(`wa.me/${WA_NUMBER}`), opened?.slice(0, 60) ?? '');
const decoded = decodeURIComponent((opened ?? '').split('text=')[1] ?? '');
check('Mesaj gövdesi doğru', decoded.includes('BMW 3 Serisi') && decoded.includes('oto cam filmi'));

const status = await page.locator('.form__status').textContent();
check('Gönderim sonrası durum bildirimi var', (status ?? '').includes('WhatsApp'));

// Bina formu mesajı
await page.goto(`${BASE}?yol=yapi`, { waitUntil: 'networkidle' });
await page.evaluate(() => {
  window.__opened = null;
  window.open = (u) => {
    window.__opened = u;
    return null;
  };
});
await page.selectOption('#f-place', 'Ofis');
await page.fill('#f-location', 'Kağıthane');
await page.selectOption('#f-need', 'Isı ve güneş kontrolü');
await page.fill('#f-phone', '05550441082');
await page.waitForTimeout(200);
const preview2 = await page.locator('.preview__body').textContent();
check('Bina mesajı konumu içeriyor', (preview2 ?? '').includes("Kağıthane'deki ofis"), preview2?.split('\n')[0]);
check('Bina mesajı ihtiyacı içeriyor', (preview2 ?? '').includes('İhtiyaç: Isı ve güneş kontrolü'));
check('Bina mesajı fotoğraf hatırlatması içeriyor', (preview2 ?? '').includes('fotoğrafını'));

/* ═══ 9. GALERİ & LIGHTBOX ═════════════════════════════════════════════════ */

section('Galeri ve lightbox');

await page.goto(BASE, { waitUntil: 'networkidle' });
const galCountAuto = await page.locator('.gal').count();
check('Araç yolunda galeri filtrelenmiş', galCountAuto === 4, `${galCountAuto} görsel`);

await page.locator('.gallery__filters .chip').first().click();
await page.waitForTimeout(300);
check('“Hepsi” filtresi 8 görsel gösteriyor', (await page.locator('.gal').count()) === 8);

await page.locator('.gal__btn').first().click();
await page.waitForTimeout(300);
check('Lightbox açıldı', await page.locator('.lb').isVisible());
check('Lightbox modal semantiği doğru', (await page.getAttribute('.lb', 'aria-modal')) === 'true');
check('Açılışta odak kapat düğmesinde', await page.locator('.lb__close').evaluate((el) => el === document.activeElement));
check('Konsept uyarısı lightbox içinde', (await page.locator('.lb__badge').textContent())?.includes('gerçek uygulama fotoğrafı değildir') ?? false);

const c1 = await page.locator('.lb__count').textContent();
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(220);
const c2 = await page.locator('.lb__count').textContent();
check('Klavye ile sonraki görsel', c1 !== c2, `${c1} → ${c2}`);

await page.keyboard.press('Escape');
await page.waitForTimeout(300);
check('Esc lightbox’ı kapatıyor', (await page.locator('.lb').count()) === 0);
check(
  'Kapanışta odak tetikleyiciye döndü',
  await page.evaluate(() => document.activeElement?.classList.contains('gal__btn') ?? false),
);

/* ═══ 10. MOBİL MENÜ & ALT ÇUBUK ═══════════════════════════════════════════ */

section('Mobil menü ve alt eylem çubuğu');

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(BASE, { waitUntil: 'networkidle' });

await page.locator('.hdr__burger').click();
await page.waitForTimeout(300);
check('Mobil menü açıldı', await page.locator('.mnav.is-open').isVisible());
check('aria-expanded doğru', (await page.getAttribute('.hdr__burger', 'aria-expanded')) === 'true');

await page.keyboard.press('Escape');
await page.waitForTimeout(300);
check('Esc mobil menüyü kapatıyor', (await page.locator('.mnav.is-open').count()) === 0);

await page.evaluate(() => window.scrollTo(0, 1200));
await page.waitForTimeout(400);
check('Alt eylem çubuğu belirdi', await page.locator('.mbar.is-show').isVisible());
const mbarBox = await page.locator('.mbar__main').boundingBox();
check('Alt çubuk CTA’sı ≥44px', !!mbarBox && mbarBox.height >= 44, `${Math.round(mbarBox?.height ?? 0)}px`);

/* ═══ 11. SİMÜLATÖR ════════════════════════════════════════════════════════ */

section('Film simülatörü');

await page.setViewportSize({ width: 1440, height: 960 });
await page.goto(BASE, { waitUntil: 'networkidle' });
const range = page.locator('.sim__range');
check('Simülatör sürgüsü var', await range.count() === 1);
check('Sürgünün erişilebilir adı var', !!(await range.getAttribute('aria-label')));

await range.focus();
const v1 = await range.inputValue();
await page.keyboard.press('ArrowRight');
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(150);
const v2 = await range.inputValue();
check('Klavye ok tuşları sürgüyü hareket ettiriyor', v1 !== v2, `${v1} → ${v2}`);

const disc = await page.locator('.sim__disclaimer').textContent();
check('Ölçüm uyarısı görünür', (disc ?? '').includes('Gerçek ölçüm'));

const pctText = await page.locator('.sim').textContent();
check(
  'Sahte teknik oran gösterilmiyor',
  !/%\s?\d{2}\s?(ısı|UV|IR)/i.test(pctText ?? ''),
);

/* ═══ 12. BAĞLANTILAR ══════════════════════════════════════════════════════ */

section('Bağlantılar');

const links = await page.evaluate(() =>
  [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
);

check('Ölü/boş bağlantı yok', !links.some((h) => !h || h === '#' || h === ''), '');

const tel = links.filter((h) => h?.startsWith('tel:'));
check('Telefon bağlantıları doğru numarada', tel.length > 0 && tel.every((h) => h === 'tel:+905550441082'), tel[0] ?? '');

const wa = links.filter((h) => h?.includes('wa.me'));
check('WhatsApp bağlantıları doğru numarada', wa.length > 0 && wa.every((h) => h.includes(WA_NUMBER)));

check('Instagram bağlantısı var', links.some((h) => h?.includes('instagram.com/shellsonwindowfilm')));
check('Google Maps bağlantısı var', links.some((h) => h?.includes('google.com/maps')));

// Bozuk domainler hiçbir yerde bağlantı olarak kullanılmamalı
const html = await page.content();
check('otocamfilmcisi.com bağlantı olarak kullanılmıyor', !/href="[^"]*otocamfilmcisi\.com/.test(html));
check('shellsonwindowfilm.com bağlantı olarak kullanılmıyor', !/href="[^"]*shellsonwindowfilm\.com/.test(html));

// Dış bağlantılarda güvenlik
const unsafe = await page.evaluate(
  () =>
    [...document.querySelectorAll('a[target="_blank"]')].filter(
      (a) => !(a.getAttribute('rel') ?? '').includes('noopener'),
    ).length,
);
check('Yeni sekmede açılan bağlantılarda rel="noopener"', unsafe === 0, `${unsafe} eksik`);

/* ═══ 13. YAPI & ERİŞİLEBİLİRLİK ═══════════════════════════════════════════ */

section('Yapı ve erişilebilirlik');

const h1 = await page.locator('h1').count();
check('Tek h1 var', h1 === 1, `${h1} adet`);

const skipped = await page.evaluate(() => {
  const levels = [...document.querySelectorAll('h1,h2,h3,h4')].map((h) => +h.tagName[1]);
  for (let i = 1; i < levels.length; i++) if (levels[i] - levels[i - 1] > 1) return `${levels[i - 1]}→${levels[i]}`;
  return null;
});
check('Başlık hiyerarşisi atlamıyor', skipped === null, skipped ?? '');

check('Sayfa dili Türkçe', (await page.getAttribute('html', 'lang')) === 'tr');
check('Atlama bağlantısı var', (await page.locator('.skip-link').count()) === 1);
check('main landmark var', (await page.locator('main#icerik').count()) === 1);

const noLabel = await page.evaluate(() => {
  const bad = [];
  for (const el of document.querySelectorAll('input:not([type="hidden"]), select, textarea')) {
    const id = el.id;
    const hasLabel = id && document.querySelector(`label[for="${id}"]`);
    if (!hasLabel && !el.getAttribute('aria-label')) bad.push(el.name || el.id || el.tagName);
  }
  return bad;
});
check('Tüm form alanlarının etiketi var', noLabel.length === 0, noLabel.join(', '));

const noAlt = await page.evaluate(
  () => [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length,
);
check('alt niteliği eksik görsel yok', noAlt === 0);

const iframeTitle = await page.getAttribute('iframe', 'title');
check('Harita iframe’inin başlığı var', !!iframeTitle, iframeTitle ?? '');

await page.locator('#iletisim').scrollIntoViewIfNeeded();
await page.waitForTimeout(2500);
check(
  'Harita gömme çerçevesi yükleniyor',
  mapResponses.length > 0 && mapResponses.every((s) => s < 400),
  mapResponses.length ? `durum: ${[...new Set(mapResponses)].join(', ')}` : 'istek görülmedi',
);

/* ═══ 14. REDUCED MOTION ═══════════════════════════════════════════════════ */

section('prefers-reduced-motion');

const rmCtx = await browser.newContext({ reducedMotion: 'reduce', locale: 'tr-TR' });
const rmPage = await rmCtx.newPage();
await rmPage.goto(BASE, { waitUntil: 'networkidle' });
await rmPage.waitForTimeout(500);

const hidden = await rmPage.evaluate(() => {
  const els = [...document.querySelectorAll('.reveal, .reveal-up, .stagger > *')];
  return els.filter((e) => getComputedStyle(e).opacity !== '1').length;
});
check('Reduced motion’da içerik gizli kalmıyor', hidden === 0, `${hidden} öğe saydam`);

const heroVisible = await rmPage.evaluate(
  () => getComputedStyle(document.querySelector('.hero__line')).clipPath,
);
check('Reduced motion’da hero animasyonu kapalı', heroVisible === 'none', heroVisible);
await rmCtx.close();

/* ═══ 15. KONSOL & AĞ ══════════════════════════════════════════════════════ */

section('Konsol ve ağ');

check('Konsol hatası yok', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '));
check('Yakalanmamış JS hatası yok', pageErrors.length === 0, pageErrors.slice(0, 2).join(' | '));
check('Başarısız iç istek yok', failedRequests.length === 0, failedRequests.slice(0, 3).join(' | '));

/* ── Mobil ekran görüntüleri ──────────────────────────────────────────────── */

const shot = await ctx.newPage();
await shot.setViewportSize({ width: 390, height: 844 });
await shot.goto(BASE, { waitUntil: 'networkidle' });
await settle(shot);
await shot.screenshot({ path: `${SHOT_DIR}/mobil-390-arac.png`, fullPage: true });
await shot.goto(`${BASE}?yol=yapi`, { waitUntil: 'networkidle' });
await settle(shot);
await shot.screenshot({ path: `${SHOT_DIR}/mobil-390-bina.png`, fullPage: true });

await shot.setViewportSize({ width: 1440, height: 960 });
await shot.goto(`${BASE}?yol=yapi`, { waitUntil: 'networkidle' });
await settle(shot);
await shot.screenshot({ path: `${SHOT_DIR}/masaustu-1440-bina.png`, fullPage: true });

// Hero ve simülatör yakın çekim (tasarım incelemesi için)
await shot.goto(BASE, { waitUntil: 'networkidle' });
await shot.waitForTimeout(1400);
await shot.screenshot({ path: `${SHOT_DIR}/hero-1440.png` });
await settle(shot);
await shot.locator('#fark').scrollIntoViewIfNeeded();
await shot.waitForTimeout(700);
await shot.screenshot({ path: `${SHOT_DIR}/simulator-1440.png` });

await browser.close();
if (preview) preview.proc.kill();

/* ── Özet ─────────────────────────────────────────────────────────────────── */

const total = results.length;
console.log(`\n${'═'.repeat(70)}`);
console.log(`ÖZET: ${total - failures}/${total} kontrol geçti`);
if (failures > 0) {
  console.log('\nBAŞARISIZ:');
  results.filter((r) => !r.pass).forEach((r) => console.log(`  • ${r.name}${r.detail ? ` — ${r.detail}` : ''}`));
}
console.log(`${'═'.repeat(70)}\n`);

process.exit(failures > 0 ? 1 : 0);
