import { useCallback, useEffect, useState } from 'react';
import type { PathKey } from '../content/business';

const VALID: PathKey[] = ['arac', 'yapi'];

function readFromUrl(): PathKey | null {
  if (typeof window === 'undefined') return null;
  const q = new URLSearchParams(window.location.search).get('yol');
  if (q && VALID.includes(q as PathKey)) return q as PathKey;
  return null;
}

/**
 * Aktif hizmet yolu. URL'de ?yol=arac|yapi olarak taşınır; böylece
 * bağlantı paylaşılabilir ve sayfa yenilendiğinde seçim korunur.
 * Seçim ayrıca <html data-path> üzerine yazılır — tüm vurgu renkleri
 * tek bir CSS değişkeni üzerinden değişir.
 */
export function usePath(initial: PathKey = 'arac') {
  const [path, setPathState] = useState<PathKey>(() => readFromUrl() ?? initial);
  const [chosen, setChosen] = useState<boolean>(() => readFromUrl() !== null);

  useEffect(() => {
    document.documentElement.setAttribute('data-path', path);
  }, [path]);

  useEffect(() => {
    const onPop = () => {
      const next = readFromUrl();
      if (next) {
        setPathState(next);
        setChosen(true);
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const setPath = useCallback((next: PathKey, opts?: { scrollTo?: string }) => {
    setPathState(next);
    setChosen(true);

    const url = new URL(window.location.href);
    url.searchParams.set('yol', next);
    window.history.replaceState({}, '', url);

    if (opts?.scrollTo) {
      // Yol değişimi DOM'a yansıdıktan sonra kaydır
      window.requestAnimationFrame(() => {
        const el = document.getElementById(opts.scrollTo!);
        el?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'start',
        });
      });
    }
  }, []);

  return { path, setPath, chosen };
}
