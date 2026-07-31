/**
 * Hareket katmanı.
 *
 * Tek bir fikir var: filmin yüzeye serilmesi. Bölümler soldan sağa açılır.
 * `prefers-reduced-motion` açıksa hiçbir şey animasyon yapmaz — CSS tarafında
 * da ayrıca kapatılır, burada gözlemci hiç kurulmaz.
 */

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Gizleme kuralını etkinleştirir. `.js` sınıfı eklenmeden hiçbir içerik
 * gizlenmez — script yüklenmezse sayfa yine de tam okunur kalır.
 */
export function enableReveals(): void {
  if (prefersReducedMotion()) return;
  if (!('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('js');
}

let observer: IntersectionObserver | null = null;

function ensureObserver(): IntersectionObserver | null {
  if (prefersReducedMotion()) return null;
  if (observer) return observer;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );
  return observer;
}

/**
 * Verilen elemanları kaydırma ile ortaya çıkacak şekilde işaretler.
 *
 * Gözlemleme bilinçli olarak bir kare ertelenir: bölümler önce bellekte
 * kurulup sonra DOM'a ekleniyor, henüz bağlı olmayan bir elemanı gözlemlemek
 * güvenilir değil. Bir kare sonra hâlâ bağlı değilse eleman doğrudan
 * görünür yapılır — içerik hiçbir koşulda gizli kalmaz.
 */
export function reveal(elements: Element[], staggerMs = 70): void {
  const io = ensureObserver();

  elements.forEach((el, index) => {
    el.setAttribute('data-reveal', '');
    (el as HTMLElement).style.setProperty('--reveal-delay', `${Math.min(index, 6) * staggerMs}ms`);
  });

  if (!io) {
    for (const el of elements) el.classList.add('is-in');
    return;
  }

  requestAnimationFrame(() => {
    for (const el of elements) {
      if (el.isConnected) io.observe(el);
      else el.classList.add('is-in');
    }
  });
}

/** Bir bölümün doğrudan çocuklarını sırayla açar. */
export function revealChildren(container: Element | null, staggerMs = 70): void {
  if (!container) return;
  reveal(Array.from(container.children), staggerMs);
}
