/**
 * Bölüm renderlayıcıları.
 *
 * Hepsi `src/data/business.ts` içindeki tek içerik kaynağından beslenir ve
 * seçili yola (araç / bina) göre yeniden kurulur.
 */
import {
  autoServices,
  buildingSpaces,
  business,
  concept,
  faqs,
  reasons,
  reviews,
  VERIFIED_ON,
} from '../data/business';
import { h, icon, ICONS, slot } from '../lib/dom';
import { picture } from '../lib/media';
import { getPath, onPathChange, setPath, type Path } from '../lib/state';
import { reveal } from '../lib/motion';
import { presetBuildingSpace, presetVehicleService } from './forms';

const nf = (value: number) => value.toLocaleString('tr-TR');
const ratingText = business.rating.value.toString().replace('.', ',');

/** Bir bölüme yumuşak kaydırma. */
function goTo(hash: string): void {
  const target = document.querySelector(hash);
  if (!target) return;
  target.scrollIntoView({ behavior: prefersSmooth() ? 'smooth' : 'auto', block: 'start' });
}

function prefersSmooth(): boolean {
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ---------------------------------------------------------------------------
// Konsept metinleri
// ---------------------------------------------------------------------------

export function renderConceptTexts(): void {
  const strip = document.querySelector<HTMLElement>('.concept-strip__text');
  if (strip) strip.textContent = concept.banner;

  const footerConcept = slot('footer-concept');
  if (footerConcept) footerConcept.textContent = concept.footer;
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

export function renderHeroFacts(): void {
  const target = slot('hero-facts');
  if (!target) return;

  const facts = [
    {
      label: 'Google puanı',
      value: `${ratingText} / 5`,
      note: `${nf(business.rating.count)} değerlendirme · ${VERIFIED_ON}`,
    },
    {
      label: 'Atölye',
      value: `${business.address.district}, ${business.address.city}`,
      note: business.address.street,
    },
    {
      label: 'Kapsam',
      value: 'Araç ve bina',
      note: 'Cam filmi · PPF · Kaplama',
    },
  ];

  target.replaceChildren(
    ...facts.map((fact) =>
      h(
        'div',
        { class: 'hero__fact' },
        h('dt', { text: fact.label }),
        h('dd', {}, fact.value, h('span', { class: 'hero__fact-note', text: fact.note }))
      )
    )
  );
}

// ---------------------------------------------------------------------------
// Hizmetler
// ---------------------------------------------------------------------------

const SERVICE_COPY: Record<Path, { eyebrow: string; title: string; lede: string }> = {
  none: {
    eyebrow: 'Hizmetler',
    title: 'İki farklı iş, aynı atölye',
    lede: 'Yukarıdan bir yol seçin; sayfa yalnızca sizi ilgilendiren bölümü göstersin. Seçmeden de aşağıdan hepsine bakabilirsiniz.',
  },
  arac: {
    eyebrow: 'Aracım için',
    title: 'Otomotiv çözümleri',
    lede: 'Camdan boyaya kadar aracın dış yüzeyi. Her hizmette ne işe yaradığını ve kimin için uygun olduğunu yazdık.',
  },
  bina: {
    eyebrow: 'Evim / iş yerim için',
    title: 'Mimari cam çözümleri',
    lede: 'Aynı mantık binada da geçerli: camdan geçen ısıyı, ışığı ve bakışları ayarlamak.',
  },
};

export function renderServices(): void {
  const paint = (path: Path) => {
    const copy = SERVICE_COPY[path];
    const eyebrow = slot('services-eyebrow');
    const title = slot('services-title');
    const lede = slot('services-lede');
    const body = slot('services-body');
    if (!body) return;

    if (eyebrow) eyebrow.textContent = copy.eyebrow;
    if (title) title.textContent = copy.title;
    if (lede) lede.textContent = copy.lede;

    const blocks: HTMLElement[] = [];
    if (path === 'none' || path === 'arac') blocks.push(autoBlock());
    if (path === 'none' || path === 'bina') blocks.push(buildingBlock());
    if (path !== 'none') blocks.push(switchAside(path));

    body.replaceChildren(...blocks);
  };

  paint(getPath());
  onPathChange(paint);
}

function autoBlock(): HTMLElement {
  const grid = h(
    'div',
    { class: 'autogrid' },
    ...autoServices.map((service) =>
      h(
        'article',
        { class: 'autocard' },
        h('div', { class: 'autocard__media' }, picture(service.media, { sizes: '(min-width: 60rem) 20rem, 92vw' })),
        h(
          'div',
          { class: 'autocard__body' },
          h('h4', { class: 'autocard__title', text: service.title }),
          h('p', { class: 'autocard__blurb', text: service.blurb }),
          h(
            'p',
            { class: 'autocard__context' },
            icon(ICONS.target),
            h('span', { text: service.context })
          ),
          h(
            'div',
            { class: 'autocard__action' },
            h('button', {
              class: 'btn btn--outline btn--block',
              type: 'button',
              text: 'Bu hizmet için fiyat al',
              onclick: () => {
                presetVehicleService(service.title);
                goTo('#teklif');
              },
            })
          )
        )
      )
    )
  );

  reveal(Array.from(grid.children), 55);

  return h(
    'section',
    { class: 'svcgroup' },
    h(
      'div',
      { class: 'svcgroup__head' },
      h('h3', { class: 'svcgroup__title', text: 'Otomotiv çözümleri' }),
      h('span', { class: 'svcgroup__count', text: `${autoServices.length} hizmet` })
    ),
    grid
  );
}

function buildingBlock(): HTMLElement {
  const list = h(
    'div',
    { class: 'spacelist' },
    ...buildingSpaces.map((space) =>
      h(
        'article',
        { class: 'spacecard' },
        h('div', { class: 'spacecard__media' }, picture(space.media, { sizes: '(min-width: 44rem) 12rem, 92vw' })),
        h(
          'div',
          {},
          h('h4', { class: 'spacecard__title', text: space.title }),
          h('p', { class: 'spacecard__problem', text: space.problem }),
          h(
            'p',
            { class: 'spacecard__measure' },
            icon(ICONS.ruler),
            h('span', { text: `Keşifte sorulur: ${space.measure}` })
          )
        ),
        h('button', {
          class: 'btn btn--outline',
          type: 'button',
          text: 'Keşif iste',
          onclick: () => {
            presetBuildingSpace(space.title === 'Mağaza ve vitrin' ? 'Mağaza / vitrin' : space.title);
            goTo('#teklif');
          },
        })
      )
    )
  );

  reveal(Array.from(list.children), 55);

  return h(
    'section',
    { class: 'svcgroup' },
    h(
      'div',
      { class: 'svcgroup__head' },
      h('h3', { class: 'svcgroup__title', text: 'Mimari cam çözümleri' }),
      h('span', { class: 'svcgroup__count', text: `${buildingSpaces.length} mekân türü` })
    ),
    list,
    h('p', {
      class: 'services__aside',
      text: 'Binada ihtiyaçlar birbirine benzemiyor: biri ısıdan, biri karşı binadan, biri güneşin parkeyi soldurmasından rahatsız. Bu yüzden burada hazır paket listesi yok — keşifte ihtiyacınızı konuşup filmi ona göre seçiyorsunuz.',
    })
  );
}

function switchAside(path: Path): HTMLElement {
  const other: Path = path === 'arac' ? 'bina' : 'arac';
  const label =
    path === 'arac'
      ? 'Ev, ofis veya bina cam filmi de mi gerekiyor?'
      : 'Aracınız için de cam filmi, PPF veya kaplama ister misiniz?';

  return h(
    'p',
    { class: 'services__aside' },
    h('span', { text: `${label} ` }),
    h('button', {
      class: 'btn btn--ghost',
      type: 'button',
      text: path === 'arac' ? 'Bina hizmetlerine geç' : 'Araç hizmetlerine geç',
      onclick: () => setPath(other),
    })
  );
}

// ---------------------------------------------------------------------------
// Neden Shellson
// ---------------------------------------------------------------------------

export function renderReasons(): void {
  const target = slot('reasons');
  if (!target) return;

  const nodes = reasons.map((reason) =>
    h(
      'li',
      { class: 'reason' },
      h('h3', { class: 'reason__title', text: reason.title }),
      h('p', { class: 'reason__body', text: reason.body })
    )
  );

  target.replaceChildren(...nodes);
  reveal(nodes, 60);
}

// ---------------------------------------------------------------------------
// Yorumlar
// ---------------------------------------------------------------------------

export function renderReviews(): void {
  const paint = (path: Path) => {
    const lede = slot('reviews-lede');
    const body = slot('reviews-body');
    if (!body) return;

    if (lede) {
      lede.textContent =
        'Aşağıdakiler Google İşletme Profilinde yayımlanmış gerçek yorumlardan kısaltılmış alıntılardır. Anlamları değiştirilmedi.';
    }

    const blocks: (HTMLElement | false)[] = [ratingBox()];

    if (path === 'bina') {
      blocks.push(
        h('p', {
          class: 'reviews__note',
          text: 'Not: İncelenen Google yorumlarının tamamı araç hizmetlerine ait. Bina cam filmi için yayımlanmış bir müşteri yorumu bulunamadığı için burada bina yorumu gösterilmiyor — uydurulmuş bir yorum eklemek yerine bunu söylemeyi tercih ettik.',
        })
      );
    }

    const grid = h(
      'div',
      { class: 'reviews__grid' },
      ...reviews.map((review) =>
        h(
          'figure',
          { class: 'reviewcard' },
          h('figcaption', { class: 'reviewcard__topic', text: review.topic }),
          h('blockquote', { class: 'reviewcard__quote', text: `“${review.quote}”` }),
          h(
            'div',
            { class: 'reviewcard__meta' },
            h('span', { class: 'reviewcard__author', text: review.author }),
            h('span', { text: review.date }),
            h('span', { text: '· Google' })
          )
        )
      )
    );

    blocks.push(grid);
    blocks.push(
      h('p', {
        class: 'reviews__note',
        text: `Yorum kartlarında bilinçli olarak yıldız gösterilmiyor: tekil yorumların kaç yıldız verdiği profil görüntüsünden okunamadı. Yukarıdaki ${ratingText} puanı ${nf(business.rating.count)} değerlendirmenin ortalamasıdır.`,
      })
    );

    body.replaceChildren(...(blocks.filter(Boolean) as HTMLElement[]));
    reveal(Array.from(grid.children), 45);
  };

  paint(getPath());
  onPathChange(paint);
}

function ratingBox(): HTMLElement {
  // Toplam puan doğrulandı; yıldızlar bu ortalamayı temsil eder.
  const percent = (business.rating.value / 5) * 100;

  const stars = h('span', {
    class: 'reviews__stars',
    role: 'img',
    'aria-label': `5 üzerinden ${ratingText}`,
    style: 'position:relative;display:inline-flex',
  });

  const outline = h('span', { style: 'display:inline-flex;gap:2px;opacity:.35' });
  const filled = h('span', {
    style: `display:inline-flex;gap:2px;position:absolute;left:0;top:0;overflow:hidden;width:${percent}%`,
  });

  for (let i = 0; i < 5; i++) {
    outline.append(icon(ICONS.star));
    filled.append(icon(ICONS.star, 'icon--filled'));
  }
  stars.append(outline, filled);

  return h(
    'div',
    { class: 'reviews__rating' },
    h('span', { class: 'reviews__score', text: ratingText }),
    stars,
    h('span', {
      class: 'reviews__rating-text',
      text: `${nf(business.rating.count)} Google değerlendirmesinin ortalaması · ${VERIFIED_ON} tarihinde alındı`,
    })
  );
}

// ---------------------------------------------------------------------------
// Teklif bölümü başlığı
// ---------------------------------------------------------------------------

const QUOTE_COPY: Record<Path, { title: string; lede: string }> = {
  none: {
    title: 'Talebinizi hazırlayalım',
    lede: 'Bilgileri girin, aşağıda oluşan mesajı görün, WhatsApp’ta gönderin. Sekmelerden hangi taraf olduğunu seçebilirsiniz.',
  },
  arac: {
    title: 'Aracınız için fiyat isteyin',
    lede: 'Araç bilgisi ve istediğiniz hizmetle net bir talep oluşur; Shellson tahmin etmek zorunda kalmaz, siz de daha hızlı cevap alırsınız.',
  },
  bina: {
    title: 'Mekânınız için keşif isteyin',
    lede: 'Konum, mekân türü ve yaklaşık ölçüyle keşif talebi oluşturun. Fotoğraf eklerseniz süreç daha da kısalır.',
  },
};

export function renderQuoteHeader(): void {
  const paint = (path: Path) => {
    const title = slot('quote-title');
    const lede = slot('quote-lede');
    const copy = QUOTE_COPY[path];
    if (title) title.textContent = copy.title;
    if (lede) lede.textContent = copy.lede;
  };
  paint(getPath());
  onPathChange(paint);
}

// ---------------------------------------------------------------------------
// SSS
// ---------------------------------------------------------------------------

export function renderFaq(): void {
  const paint = (path: Path) => {
    const target = slot('faq');
    if (!target) return;

    const groups: HTMLElement[] = [];
    if (path === 'none' || path === 'arac') groups.push(faqGroup('arac', 'Araç tarafı'));
    if (path === 'none' || path === 'bina') groups.push(faqGroup('bina', 'Bina tarafı'));

    target.replaceChildren(...groups);
  };

  paint(getPath());
  onPathChange(paint);
}

function faqGroup(path: 'arac' | 'bina', title: string): HTMLElement {
  const items = faqs.filter((faq) => faq.path === path);

  return h(
    'div',
    { class: 'faqgroup' },
    h('h3', { class: 'faqgroup__title', text: title }),
    ...items.map((faq) =>
      h(
        'details',
        { class: 'qa' },
        h(
          'summary',
          { class: 'qa__summary' },
          h('span', { text: faq.q }),
          h('span', { class: 'qa__icon' }, icon(ICONS.plus))
        ),
        h('div', { class: 'qa__body' }, h('p', { text: faq.a }))
      )
    )
  );
}

// ---------------------------------------------------------------------------
// İletişim
// ---------------------------------------------------------------------------

export function renderContact(): void {
  const target = slot('contact');
  if (!target) return;

  const item = (
    iconPath: string,
    label: string,
    value: Node | string,
    note?: string
  ): HTMLElement =>
    h(
      'div',
      { class: 'contact__item' },
      h('span', { class: 'contact__ico' }, icon(iconPath)),
      h(
        'div',
        {},
        h('p', { class: 'contact__label', text: label }),
        h('p', { class: 'contact__value' }, value),
        note && h('p', { class: 'contact__note', text: note })
      )
    );

  const list = h(
    'div',
    { class: 'contact__list' },
    item(
      ICONS.phone,
      'Telefon',
      h('a', { href: business.phone.href, text: business.phone.display })
    ),
    item(
      ICONS.whatsapp,
      'WhatsApp',
      h('a', {
        href: `https://wa.me/${business.whatsapp.number}?text=${encodeURIComponent(
          `Merhaba ${business.name}, cam filmi hakkında bilgi almak istiyorum.`
        )}`,
        target: '_blank',
        rel: 'noopener',
        text: business.phone.display,
      }),
      'Bu numara Google İşletme Profilinde telefon numarası olarak listeleniyor.'
    ),
    item(
      ICONS.pin,
      'Adres',
      h('a', { href: business.address.mapsUrl, target: '_blank', rel: 'noopener', text: business.address.full }),
      `Plus Code: ${business.address.plusCode}`
    ),
    item(
      ICONS.clock,
      'Çalışma saatleri',
      `Kapanış: ${business.hours.closing}`,
      business.hours.detail
        ? undefined
        : 'Gün gün açılış saatleri doğrulanamadı — yola çıkmadan önce aramanızı öneririz.'
    ),
    ...business.social.map((social) =>
      item(
        ICONS.instagram,
        social.label,
        h('a', { href: social.url, target: '_blank', rel: 'noopener', text: social.handle })
      )
    )
  );

  list.append(
    h(
      'div',
      { class: 'contact__actions' },
      h(
        'a',
        { class: 'btn btn--primary', href: business.address.directionsUrl, target: '_blank', rel: 'noopener' },
        icon(ICONS.directions),
        h('span', { text: 'Yol tarifi al' })
      ),
      h(
        'a',
        { class: 'btn btn--outline', href: business.phone.href },
        icon(ICONS.phone),
        h('span', { text: 'Hemen ara' })
      )
    )
  );

  const map = h(
    'div',
    { class: 'contact__map' },
    h('iframe', {
      title: 'Shellson konumu — Google Haritalar',
      src: `https://maps.google.com/maps?q=${encodeURIComponent(business.address.full)}&z=16&output=embed`,
      loading: 'lazy',
      referrerpolicy: 'no-referrer-when-downgrade',
    })
  );

  target.replaceChildren(list, map);
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

export function renderFooter(): void {
  const target = slot('footer-meta');
  if (!target) return;

  const column = (title: string, ...children: (Node | string | false)[]): HTMLElement =>
    h('div', {}, h('h2', { text: title }), ...(children.filter(Boolean) as (Node | string)[]));

  target.replaceChildren(
    column(
      'İletişim',
      h('p', {}, h('a', { href: business.phone.href, text: business.phone.display })),
      h('p', { text: business.address.full }),
      h('p', {}, h('a', { href: business.address.mapsUrl, target: '_blank', rel: 'noopener', text: 'Google Haritalar’da aç' }))
    ),
    column(
      'Bağlantılar',
      ...business.social.map((social) =>
        h('p', {}, h('a', { href: social.url, target: '_blank', rel: 'noopener', text: `${social.label} — ${social.handle}` }))
      ),
      h('p', { text: 'Web sitesi: bu konsept çalışma' })
    ),
    column(
      'Bu proje hakkında',
      h('p', {
        text: `İşletme bilgileri ${VERIFIED_ON} tarihinde kamuya açık kaynaklardan derlendi. Doğrulanamayan hiçbir bilgi bu sayfada gösterilmiyor.`,
      }),
      h('p', { text: 'Görseller lisanslı stok görsellerdir; Shellson’ın kendi uygulamaları değildir.' })
    )
  );

  const footer = document.querySelector('.site-footer__inner');
  footer?.append(
    h('p', {
      class: 'site-footer__legal',
      text: `${business.legalName} — bilgiler Google İşletme Profilinden alınmıştır. Bu sayfa Shellson tarafından yaptırılmamıştır ve resmî bir bağı yoktur.`,
    })
  );
}

// ---------------------------------------------------------------------------
// Mobil yapışkan CTA
// ---------------------------------------------------------------------------

export function renderDock(): void {
  const dock = slot('dock');
  if (!dock) return;

  const label = (path: Path) =>
    path === 'bina' ? 'Keşif iste' : path === 'arac' ? 'Fiyat al' : 'Teklif al';

  const cta = h('a', { class: 'btn btn--primary', href: '#teklif', text: label(getPath()) });

  dock.replaceChildren(
    h('a', { class: 'btn btn--outline', href: business.phone.href }, icon(ICONS.phone), h('span', { text: 'Ara' })),
    cta
  );
  dock.hidden = false;

  onPathChange((path) => {
    cta.textContent = label(path);
  });

  // Hero'dan çıkınca belirir, formdayken gizlenir.
  const hero = document.querySelector('#hero');
  const quote = document.querySelector('#teklif');
  let pastHero = false;
  let atQuote = false;

  const sync = () => dock.classList.toggle('is-up', pastHero && !atQuote);

  if (hero) {
    new IntersectionObserver(
      ([entry]) => {
        pastHero = !entry.isIntersecting;
        sync();
      },
      { threshold: 0 }
    ).observe(hero);
  }

  if (quote) {
    new IntersectionObserver(
      ([entry]) => {
        atQuote = entry.isIntersecting;
        sync();
      },
      { threshold: 0.12 }
    ).observe(quote);
  }
}
