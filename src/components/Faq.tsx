import { faq, paths, type PathKey } from '../content/business';
import { useReveal } from '../hooks/useReveal';
import { IconChevron } from './art/Icons';

/**
 * SSS — aktif yola göre iki ayrı grup.
 * <details>/<summary> kullanılıyor: klavye ve ekran okuyucu desteği yerel
 * olarak gelir, JavaScript olmadan da açılır.
 */
export function Faq({ path }: { path: PathKey }) {
  const ref = useReveal<HTMLDivElement>(0.1);
  const items = faq[path];
  const p = paths[path];

  return (
    <section className="section faq" id="sss" aria-labelledby="faq-title">
      <div className="wrap faq__wrap">
        <div className="faq__aside">
          <p className="tag tag--accent">{p.eyebrow}</p>
          <h2 className="display t-h2" id="faq-title">
            Sık sorulanlar
          </h2>
          <p className="lede">
            Fiyat, süre ve ton kararları araç ya da mekân görülmeden netleşmiyor. Bu yüzden
            burada kesin rakam yok — sorularınızı doğrudan Shellson’a iletebilirsiniz.
          </p>
        </div>

        <div className="faq__list" ref={ref} key={path}>
          {items.map((f) => (
            <details className="fq" key={f.q}>
              <summary className="fq__q">
                <span>{f.q}</span>
                <IconChevron className="fq__chev" />
              </summary>
              <div className="fq__a">
                <p>{f.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
