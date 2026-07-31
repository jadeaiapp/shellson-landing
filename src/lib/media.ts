/**
 * Görsel yardımcıları.
 *
 * Dosyalar `public/media/` altında durur ve URL'ler `import.meta.env.BASE_URL`
 * ile kurulur — böylece GitHub Pages alt dizini (/shellson-landing/) altında da
 * doğru çözülürler. Hiçbir görsel dış siteden çekilmez.
 */
import mediaData from '../data/media.json';
import { h } from './dom';

export interface MediaEntry {
  slug: string;
  group: string;
  alt: string;
  width: number;
  height: number;
  ratio: number;
  sizes: { w: number; h: number }[];
  lqip: string;
  source: string;
  sourceUrl: string;
  photographer: string | null;
  license: string;
}

const DATA = mediaData as unknown as Record<string, MediaEntry>;
const BASE = import.meta.env.BASE_URL;

export function media(slug: string): MediaEntry {
  const entry = DATA[slug];
  if (!entry) throw new Error(`Bilinmeyen görsel: ${slug}`);
  return entry;
}

export function allMedia(): MediaEntry[] {
  return Object.values(DATA);
}

export function srcFor(slug: string, width = 960): string {
  return `${BASE}media/${slug}-${width}.webp`;
}

function srcset(entry: MediaEntry): string {
  return entry.sizes.map((s) => `${BASE}media/${entry.slug}-${s.w}.webp ${s.w}w`).join(', ');
}

interface ImageOptions {
  /** `sizes` özniteliği — tarayıcının doğru genişliği seçmesi için. */
  sizes?: string;
  className?: string;
  /** Hero gibi ilk ekranda görünen görseller için `true`. */
  eager?: boolean;
  /** Alt metni ezmek gerekirse. */
  alt?: string;
}

/**
 * `<picture>` üretir: WebP kaynakları + JPEG yedeği.
 * Genişlik/yükseklik verilir, böylece yer önceden ayrılır (CLS = 0).
 * LQIP arka plan olarak basılır; görsel yüklenince kaybolur.
 */
export function picture(slug: string, options: ImageOptions = {}): HTMLElement {
  const entry = media(slug);
  const img = h('img', {
    src: `${BASE}media/${entry.slug}-1200.jpg`,
    srcset: srcset(entry),
    sizes: options.sizes ?? '100vw',
    alt: options.alt ?? entry.alt,
    width: entry.width,
    height: entry.height,
    loading: options.eager ? 'eager' : 'lazy',
    decoding: 'async',
    fetchpriority: options.eager ? 'high' : 'auto',
    class: options.className ?? '',
    style: `background-image:url(${entry.lqip});background-size:cover;background-position:center`,
  });

  img.addEventListener(
    'load',
    () => {
      img.style.backgroundImage = '';
    },
    { once: true }
  );

  return img;
}
