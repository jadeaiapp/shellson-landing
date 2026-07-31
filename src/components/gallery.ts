/**
 * Uygulama galerisi + lightbox.
 *
 * Tüm görseller lisanslı stok görsellerdir ve her kartta "Konsept görsel"
 * etiketi taşır. Shellson'ın kendi fotoğrafları kullanılmamıştır
 * (RESEARCH.md §9).
 */
import { allMedia, picture, srcFor, media, type MediaEntry } from '../lib/media';
import { h, qs, slot } from '../lib/dom';
import { getPath, onPathChange, type Path } from '../lib/state';
import { reveal } from '../lib/motion';
import { concept } from '../data/business';

type Category = 'oto' | 'bina';

const FILTERS: { id: Category | 'tumu'; label: string }[] = [
  { id: 'tumu', label: 'Tümü' },
  { id: 'oto', label: 'Araç' },
  { id: 'bina', label: 'Ev, ofis ve bina' },
];

/** Etkileşimli sahneler de galeriye girer; kategorileri konularından türetilir. */
function categoryOf(entry: MediaEntry): Category {
  if (entry.group === 'oto' || entry.group === 'bina') return entry.group;
  return entry.slug.includes('arac') ? 'oto' : 'bina';
}

const ITEMS = allMedia();
let visible: MediaEntry[] = [];
let activeFilter: Category | 'tumu' = 'tumu';

export function renderGallery(): void {
  const notice = slot('gallery-notice');
  if (notice) notice.textContent = concept.imageNotice;

  const filterBox = slot('gallery-filters');
  const grid = slot('gallery-grid');
  if (!filterBox || !grid) return;

  filterBox.replaceChildren(
    ...FILTERS.map((filter) =>
      h('button', {
        class: 'chip',
        type: 'button',
        text: filter.label,
        'data-filter': filter.id,
        'aria-pressed': String(filter.id === activeFilter),
        onclick: () => applyFilter(filter.id),
      })
    )
  );

  function applyFilter(next: Category | 'tumu'): void {
    activeFilter = next;
    for (const button of filterBox!.querySelectorAll<HTMLButtonElement>('[data-filter]')) {
      button.setAttribute('aria-pressed', String(button.dataset.filter === next));
    }
    paint(grid!);
  }

  paint(grid);

  // Yol seçimi galeriyi de takip eder.
  onPathChange((path: Path) => {
    if (path === 'arac') applyFilter('oto');
    else if (path === 'bina') applyFilter('bina');
  });

  const current = getPath();
  if (current === 'arac') applyFilter('oto');
  else if (current === 'bina') applyFilter('bina');

  setupLightbox();
}

function paint(grid: HTMLElement): void {
  visible = ITEMS.filter((entry) => activeFilter === 'tumu' || categoryOf(entry) === activeFilter);

  if (visible.length === 0) {
    grid.replaceChildren(h('p', { class: 'gallery__empty', text: 'Bu filtrede görsel yok.' }));
    return;
  }

  const nodes = visible.map((entry, index) =>
    h(
      'li',
      { class: 'shot' },
      h(
        'button',
        {
          class: 'shot__btn',
          type: 'button',
          'aria-label': `Büyüt: ${entry.alt}`,
          onclick: () => openLightbox(index),
        },
        picture(entry.slug, {
          sizes: '(min-width: 66rem) 24rem, (min-width: 40rem) 45vw, 92vw',
        }),
        h(
          'span',
          { class: 'shot__meta' },
          h('span', { class: 'shot__label', text: entry.alt }),
          h('span', { class: 'shot__badge', text: 'Konsept görsel' })
        )
      )
    )
  );

  grid.replaceChildren(...nodes);
  reveal(nodes, 45);
}

// ---------------------------------------------------------------------------
// Lightbox
// ---------------------------------------------------------------------------

let dialog: HTMLDialogElement | null = null;
let cursor = 0;
let opener: HTMLElement | null = null;

function setupLightbox(): void {
  dialog = qs<HTMLDialogElement>('#lightbox');
  if (!dialog) return;

  qs('.lightbox__close', dialog)?.addEventListener('click', () => dialog?.close());
  qs('.lightbox__nav--prev', dialog)?.addEventListener('click', () => step(-1));
  qs('.lightbox__nav--next', dialog)?.addEventListener('click', () => step(1));

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      step(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      step(1);
    }
  });

  // Görselin dışına tıklayınca kapansın
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog?.close();
  });

  // Kapanınca odak, açan düğmeye döner
  dialog.addEventListener('close', () => {
    opener?.focus();
    opener = null;
  });
}

function openLightbox(index: number): void {
  if (!dialog || visible.length === 0) return;
  opener = document.activeElement as HTMLElement | null;
  cursor = index;
  show();
  dialog.showModal();
}

function step(delta: number): void {
  if (visible.length === 0) return;
  cursor = (cursor + delta + visible.length) % visible.length;
  show();
}

function show(): void {
  if (!dialog) return;
  const entry = visible[cursor];
  const img = qs<HTMLImageElement>('.lightbox__img', dialog);
  const caption = qs('.lightbox__caption', dialog);
  const hasNav = visible.length > 1;

  if (img) {
    img.src = srcFor(entry.slug, 1600);
    img.alt = entry.alt;
    img.width = media(entry.slug).width;
    img.height = media(entry.slug).height;
  }

  if (caption) {
    caption.replaceChildren(
      h('span', { class: 'shot__badge', text: 'Konsept görsel' }),
      h('span', { text: entry.alt }),
      h('span', {
        class: 'reviews__rating-text',
        text: `${cursor + 1} / ${visible.length} · Kaynak: ${entry.source} (${entry.license})`,
      })
    );
  }

  for (const nav of dialog.querySelectorAll<HTMLButtonElement>('.lightbox__nav')) {
    nav.hidden = !hasNav;
  }
}
