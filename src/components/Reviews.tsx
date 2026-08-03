import { RESEARCH_DATE_TR, reputation, reviews, reviewsNote, type PathKey } from '../content/business';
import { useReveal } from '../hooks/useReveal';

/**
 * Gerçek Google yorumları.
 *
 * Tek tek yıldız puanları kaynakta görünmediği için YILDIZ GÖSTERİLMEZ —
 * tahmin etmektense hiç göstermemek doğru olan. Sorun yaşanıp işletme
 * sahibinin telafi teklif ettiği yorum referans olarak kullanılmadı.
 */
export function Reviews({ path }: { path: PathKey }) {
  const ref = useReveal<HTMLUListElement>(0.1);
  const list = reviews.filter((r) => r.path === 'both' || r.path === path);
  const shown = list.length >= 3 ? list : reviews;

  return (
    <section className="section section--ink on-ink reviews" id="yorumlar" aria-labelledby="rev-title">
      <div className="wrap">
        <div className="reviews__head">
          <div className="section-head">
            <p className="tag tag--accent">Google yorumları</p>
            <h2 className="display t-h2" id="rev-title">
              Dükkâna gidenler ne yazmış?
            </h2>
          </div>
          <div className="reviews__score">
            <span className="reviews__num display">
              {String(reputation.rating.value).replace('.', ',')}
            </span>
            <span className="reviews__meta">
              {reputation.reviewCount.value} değerlendirme
              <br />
              <span className="reviews__asof">{RESEARCH_DATE_TR} itibarıyla</span>
            </span>
          </div>
        </div>

        <ul className="rev-grid stagger" ref={ref}>
          {shown.map((r, i) => (
            <li className="rev card" key={r.name + r.when} style={{ ['--i' as string]: i }}>
              <blockquote className="rev__quote">
                <p>{r.text}</p>
              </blockquote>
              <footer className="rev__foot">
                <span className="rev__name">{r.name}</span>
                <span className="rev__when">Google · {r.when}</span>
              </footer>
            </li>
          ))}
        </ul>

        <p className="reviews__note body-sm">{reviewsNote}</p>
      </div>
    </section>
  );
}
