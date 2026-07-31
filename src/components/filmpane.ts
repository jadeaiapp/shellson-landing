/**
 * Film paneli — sayfanın imza bileşeni.
 *
 * Aynı kare üzerinde filmin yüzeye serilmesini gösterir. Sol taraf filmli,
 * sağ taraf filmsizdir; kolu sürükledikçe film yüzeyi kaplar. Ton düğmeleri
 * filmin koyuluğunu değiştirir.
 *
 * DÜRÜSTLÜK KURALI: Bu bir görsel benzetimdir. İki farklı fotoğraf
 * karşılaştırılmaz, hiçbir yüzde veya ölçüm değeri gösterilmez —
 * Shellson'a ait doğrulanmış bir ısı/UV oranı yoktur (RESEARCH.md §7).
 */
import { h, icon, ICONS } from '../lib/dom';
import { picture, media } from '../lib/media';
import { prefersReducedMotion } from '../lib/motion';

export interface Scene {
  slug: string;
  label: string;
}

/** Ton adımları. Yüzde değil, ad — uydurma teknik değer üretmemek için. */
const TONES = [
  { id: 'acik', label: 'Açık', alpha: 0.17 },
  { id: 'orta', label: 'Orta', alpha: 0.35 },
  { id: 'koyu', label: 'Koyu', alpha: 0.55 },
] as const;

export interface FilmPaneOptions {
  scenes: Scene[];
  /** Ton düğmeleri gösterilsin mi? */
  tones?: boolean;
  /** Sahne değiştirme düğmeleri gösterilsin mi? */
  sceneSwitch?: boolean;
  initialPos?: number;
  initialTone?: (typeof TONES)[number]['id'];
  /** İlk ekranda görünüyorsa görsel eager yüklenir. */
  eager?: boolean;
  sizes?: string;
}

export interface FilmPaneHandle {
  element: HTMLElement;
  showScene(slug: string): void;
}

export function createFilmPane(options: FilmPaneOptions): FilmPaneHandle {
  const {
    scenes,
    tones = true,
    sceneSwitch = false,
    initialPos = 52,
    initialTone = 'orta',
    eager = false,
    sizes = '100vw',
  } = options;

  let activeScene = scenes[0];
  let toneId: string = initialTone;

  const root = h('div', { class: 'filmpane' });
  const stage = h('div', { class: 'filmpane__stage' });

  // --- Sahne görseli ---
  let sceneImg = picture(activeScene.slug, {
    className: 'filmpane__scene',
    eager,
    sizes,
  });
  applyRatio(activeScene.slug);

  const film = h('div', { class: 'filmpane__film' });

  const range = h('input', {
    class: 'filmpane__range',
    type: 'range',
    min: '0',
    max: '100',
    step: '1',
    value: String(initialPos),
    'aria-label': 'Filmin kapladığı alan',
    'aria-valuetext': `${initialPos}% filmli`,
  });

  const handle = h('div', { class: 'filmpane__handle' }, icon(ICONS.drag));
  const edge = h('div', { class: 'filmpane__edge' }, handle);

  stage.append(
    sceneImg,
    film,
    range,
    edge,
    h('span', { class: 'filmpane__tag filmpane__tag--left', text: 'Filmli' }),
    h('span', { class: 'filmpane__tag filmpane__tag--right', text: 'Filmsiz' })
  );

  root.append(stage);

  // --- Kontroller ---
  const controls = h('div', { class: 'filmpane__controls' });

  if (sceneSwitch && scenes.length > 1) {
    const group = h(
      'div',
      { class: 'filmpane__group', role: 'group', 'aria-label': 'Sahne seçimi' },
      h('span', { class: 'filmpane__group-label', text: 'Sahne' })
    );
    for (const scene of scenes) {
      group.append(
        h('button', {
          class: 'chip',
          type: 'button',
          text: scene.label,
          'aria-pressed': String(scene.slug === activeScene.slug),
          onclick: () => showScene(scene.slug),
        })
      );
    }
    controls.append(group);
  }

  if (tones) {
    const group = h(
      'div',
      { class: 'filmpane__group', role: 'group', 'aria-label': 'Film tonu' },
      h('span', { class: 'filmpane__group-label', text: 'Ton' })
    );
    for (const tone of TONES) {
      group.append(
        h('button', {
          class: 'chip',
          type: 'button',
          text: tone.label,
          'data-tone': tone.id,
          'aria-pressed': String(tone.id === toneId),
          onclick: () => setTone(tone.id),
        })
      );
    }
    controls.append(group);
  }

  if (controls.childElementCount > 0) root.append(controls);

  root.append(
    h('p', {
      class: 'filmpane__note',
      text: 'Kolu sürükleyin veya ok tuşlarıyla ilerletin. Görsel benzetim — ölçüm değildir.',
    })
  );

  // --- Davranış ---
  function applyRatio(slug: string): void {
    const entry = media(slug);
    stage.style.setProperty('--ratio', `${entry.width} / ${entry.height}`);
  }

  function setPos(value: number): void {
    const clamped = Math.min(100, Math.max(0, value));
    root.style.setProperty('--pos', `${clamped}%`);
    range.setAttribute('aria-valuetext', `${Math.round(clamped)}% filmli`);
  }

  function setTone(id: string): void {
    toneId = id;
    const tone = TONES.find((t) => t.id === id) ?? TONES[1];
    root.style.setProperty('--tone', String(tone.alpha));
    for (const button of root.querySelectorAll<HTMLButtonElement>('[data-tone]')) {
      button.setAttribute('aria-pressed', String(button.dataset.tone === id));
    }
  }

  function showScene(slug: string): void {
    const scene = scenes.find((s) => s.slug === slug);
    if (!scene || scene.slug === activeScene.slug) return;
    activeScene = scene;
    applyRatio(slug);

    const next = picture(slug, { className: 'filmpane__scene', sizes });
    sceneImg.replaceWith(next);
    sceneImg = next;

    for (const button of root.querySelectorAll<HTMLButtonElement>('.filmpane__group button')) {
      if (button.dataset.tone) continue;
      button.setAttribute('aria-pressed', String(button.textContent === scene.label));
    }
  }

  range.addEventListener('input', () => setPos(Number(range.value)));

  setPos(initialPos);
  setTone(toneId);

  // İlk görünüşte kısa bir ipucu hareketi: film geri çekilip yerine oturur.
  // Sürekli tekrarlamaz, kullanıcı dokunduğu an iptal olur.
  if (!prefersReducedMotion()) {
    let hinted = false;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || hinted) continue;
          hinted = true;
          observer.disconnect();
          hint();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(stage);

    let cancelled = false;
    const cancel = () => {
      cancelled = true;
    };
    range.addEventListener('pointerdown', cancel, { once: true });
    range.addEventListener('keydown', cancel, { once: true });

    function hint(): void {
      const start = performance.now();
      const from = 100;
      const to = initialPos;
      const duration = 1100;
      setPos(from);
      const step = (now: number) => {
        if (cancelled) {
          setPos(Number(range.value));
          return;
        }
        const t = Math.min(1, (now - start) / duration);
        // expo.out
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        setPos(from + (to - from) * eased);
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }

  return { element: root, showScene };
}
