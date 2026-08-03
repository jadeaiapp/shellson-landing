import { useEffect, useRef } from 'react';

/**
 * Görünür alana girince `is-in` sınıfı ekler.
 *
 * PROGRESSIVE ENHANCEMENT
 * Gizleme kurallarını CSS'e sabitlemek yerine, bu hook önce `reveal-armed`
 * sınıfını ekler; gizleme yalnız o sınıf varken uygulanır. Böylece JavaScript
 * çalışmazsa, IntersectionObserver desteklenmezse veya bir hata olursa içerik
 * gizli kalmaz — sadece animasyonsuz görünür.
 *
 * Ayrıca 2.5 saniyelik bir emniyet zamanlayıcısı var: gözlemci herhangi bir
 * sebeple tetiklenmezse içerik yine de açılır.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.18) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      el.classList.add('is-in');
      return;
    }

    el.classList.add('reveal-armed');

    const show = () => el.classList.add('is-in');

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show();
            io.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    );

    io.observe(el);
    const failsafe = window.setTimeout(show, 2500);

    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [threshold]);

  return ref;
}
