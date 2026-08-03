import { trustPoints } from '../content/business';
import { useReveal } from '../hooks/useReveal';

/**
 * "Neden Shellson" — yalnızca doğrulanmış maddeler.
 * Garanti süresi, deneyim yılı, marka bayiliği ve fiyat bilinçli olarak
 * dışarıda bırakıldı; gerekçeleri RESEARCH.md'de.
 */
export function Trust() {
  const ref = useReveal<HTMLUListElement>(0.14);

  return (
    <section className="section section--tight trust" aria-labelledby="trust-title">
      <div className="wrap">
        <div className="section-head">
          <p className="tag">Doğrulanmış</p>
          <h2 className="display t-h2" id="trust-title">
            Neye dayanarak yazıyoruz?
          </h2>
          <p className="lede">
            Aşağıdaki maddelerin her biri Google İşletme Profilinden ve açık müşteri
            yorumlarından doğrulandı. Doğrulayamadığımız hiçbir iddia bu sayfada yok.
          </p>
        </div>

        <ul className="trust-grid stagger" ref={ref}>
          {trustPoints.map((t, i) => (
            <li className="tp card" key={t.id} style={{ ['--i' as string]: i }}>
              {t.stat && <span className="tp__stat display">{t.stat}</span>}
              <h3 className="tp__title">{t.title}</h3>
              <p className="tp__desc">{t.desc}</p>
              {t.footnote && <p className="tp__note">{t.footnote}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
