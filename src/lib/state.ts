/**
 * Yol durumu — sayfanın tamamını yöneten tek karar.
 *
 * Kullanıcı "Aracım için" veya "Binam için" seçtiğinde bu değer değişir;
 * hizmetler, uygulamalar, yorumlar, SSS ve form buna göre yeniden kurulur.
 * Seçim sekme oturumu boyunca korunur.
 */
export type Path = 'arac' | 'bina' | 'none';

const KEY = 'shellson:path';
const listeners = new Set<(path: Path) => void>();

let current: Path = 'none';

function isPath(value: string | null): value is Path {
  return value === 'arac' || value === 'bina';
}

export function initPath(): void {
  let stored: string | null = null;
  try {
    stored = sessionStorage.getItem(KEY);
  } catch {
    // Depolama kapalıysa sorun değil; varsayılanla devam edilir.
  }
  if (isPath(stored)) {
    current = stored;
  }
  document.body.dataset.path = current;
}

export function getPath(): Path {
  return current;
}

export function setPath(next: Path): void {
  if (next === current) return;
  current = next;
  document.body.dataset.path = next;
  try {
    if (next === 'none') sessionStorage.removeItem(KEY);
    else sessionStorage.setItem(KEY, next);
  } catch {
    // yoksay
  }
  for (const listener of listeners) listener(next);
}

export function onPathChange(listener: (path: Path) => void): void {
  listeners.add(listener);
}

/** Yolun ekranda görünen adı. */
export function pathLabel(path: Path): string {
  if (path === 'arac') return 'Aracım için';
  if (path === 'bina') return 'Binam için';
  return 'Henüz seçilmedi';
}
