import { useCallback, useEffect, useRef, useState } from 'react';
import { gallery, galleryNote, type GalleryItem, type PathKey } from '../content/business';
import { useReveal } from '../hooks/useReveal';
import { SCENES, type SceneKey } from './art/Scenes';
import { IconClose } from './art/Icons';

type Filter = 'hepsi' | PathKey;

export function Gallery({ path }: { path: PathKey }) {
  const [filter, setFilter] = useState<Filter>(path);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useReveal<HTMLUListElement>(0.08);

  // Yol değişince galeri filtresi de o yola geçer
  useEffect(() => setFilter(path), [path]);

  const items = filter === 'hepsi' ? gallery : gallery.filter((g) => g.path === filter);

  const filters: { key: Filter; label: string }[] = [
    { key: 'hepsi', label: 'Hepsi' },
    { key: 'arac', label: 'Araç' },
    { key: 'yapi', label: 'Bina' },
  ];

  return (
    <section className="section gallery" id="uygulamalar" aria-labelledby="gal-title">
      <div className="wrap">
        <div className="gallery__head">
          <div className="section-head gallery__headText">
            <p className="tag">Görsel anlatım</p>
            <h2 className="display t-h2" id="gal-title">
              Film nereye, nasıl geliyor?
            </h2>
            <p className="lede">
              Aşağıdaki her görsel bu konsept çalışma için çizilmiş özgün illüstrasyondur.
              Shellson’ın gerçek uygulama fotoğrafı değildir.
            </p>
          </div>

          <div className="gallery__filters" role="group" aria-label="Galeri filtresi">
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                className={`chip${filter === f.key ? ' is-on' : ''}`}
                aria-pressed={filter === f.key}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <ul className="gal-grid stagger" ref={ref}>
          {items.map((item, i) => {
            const Scene = SCENES[item.art as SceneKey];
            return (
              <li key={item.id} className={`gal gal--${item.ratio}`} style={{ ['--i' as string]: i }}>
                <button
                  type="button"
                  className="gal__btn glint"
                  onClick={() => setOpenIndex(gallery.indexOf(item))}
                  aria-label={`${item.title} — büyüt. Konsept görsel.`}
                >
                  <span className="gal__frame">
                    <Scene className="gal__svg" />
                  </span>
                  <span className="gal__meta">
                    <span className="gal__title">{item.title}</span>
                    <span className="gal__badge">Konsept görsel</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <p className="gallery__note body-sm">{galleryNote}</p>
      </div>

      {openIndex !== null && (
        <Lightbox
          items={gallery}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onNav={(next) => setOpenIndex(next)}
        />
      )}
    </section>
  );
}

/* ── Lightbox ─────────────────────────────────────────────────────────────── */

function Lightbox({
  items,
  index,
  onClose,
  onNav,
}: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onNav: (i: number) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const item = items[index];
  const Scene = SCENES[item.art as SceneKey];

  const go = useCallback(
    (dir: number) => onNav((index + dir + items.length) % items.length),
    [index, items.length, onNav],
  );

  useEffect(() => {
    returnTo.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      } else if (e.key === 'Tab') {
        // Odağı diyalog içinde tut
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>('button');
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      returnTo.current?.focus?.();
    };
  }, [go, onClose]);

  return (
    <div className="lb" role="dialog" aria-modal="true" aria-label={`${item.title} — konsept görsel`}>
      <button type="button" className="lb__scrim" onClick={onClose} tabIndex={-1} aria-hidden />
      <div className="lb__panel" ref={dialogRef}>
        <div className="lb__stage">
          <Scene className="lb__svg" />
        </div>
        <div className="lb__bar">
          <div className="lb__text">
            <p className="lb__title">{item.title}</p>
            <p className="lb__caption">{item.caption}</p>
            <p className="lb__badge">Konsept görsel — Shellson’ın gerçek uygulama fotoğrafı değildir.</p>
          </div>
          <div className="lb__nav">
            <button type="button" className="lb__navBtn" onClick={() => go(-1)}>
              <span className="sr-only">Önceki görsel</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="m14 6-6 6 6 6" />
              </svg>
            </button>
            <span className="lb__count" aria-live="polite">
              {index + 1} / {items.length}
            </span>
            <button type="button" className="lb__navBtn" onClick={() => go(1)}>
              <span className="sr-only">Sonraki görsel</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="m10 6 6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
        <button type="button" className="lb__close" onClick={onClose} ref={closeRef}>
          <span className="sr-only">Kapat</span>
          <IconClose className="lb__closeIcon" />
        </button>
      </div>
    </div>
  );
}
