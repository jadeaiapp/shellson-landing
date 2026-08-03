import { archNeeds, autoServices, paths, type PathKey } from '../content/business';
import { useReveal } from '../hooks/useReveal';
import { IconArrow, IconFacade, IconTint } from './art/Icons';

/**
 * İki yol ayrımı. Sayfanın asıl işi burada başlıyor: ziyaretçi hangi
 * dünyadan geldiğini söylüyor, sayfanın geri kalanı buna göre şekilleniyor.
 */
export function PathChooser({
  path,
  onChoose,
}: {
  path: PathKey;
  onChoose: (p: PathKey, o?: { scrollTo?: string }) => void;
}) {
  const ref = useReveal<HTMLDivElement>(0.2);

  const cards = [
    {
      key: 'arac' as PathKey,
      Icon: IconTint,
      items: autoServices.map((s) => s.title),
      note: 'Fiyat ve süre bilgisi',
    },
    {
      key: 'yapi' as PathKey,
      Icon: IconFacade,
      items: ['Bina cam filmi', ...archNeeds.map((n) => n.title)],
      note: 'Ücretsiz keşif talebi',
    },
  ];

  return (
    <section className="section section--tight chooser" id="yol" aria-labelledby="chooser-title">
      <div className="wrap">
        <div className="section-head">
          <p className="tag">Başlangıç</p>
          <h2 className="display t-h2" id="chooser-title">
            Ne için geldiniz?
          </h2>
          <p className="lede">
            Seçiminiz sayfanın geri kalanını değiştirir: hizmetler, örnekler, sorular ve
            WhatsApp’a gidecek mesaj buna göre hazırlanır.
          </p>
        </div>

        <div className="chooser__grid stagger" ref={ref}>
          {cards.map((c, i) => {
            const p = paths[c.key];
            const active = path === c.key;
            return (
              <button
                key={c.key}
                type="button"
                className={`pcard glint${active ? ' is-active' : ''}`}
                data-path={c.key}
                style={{ ['--i' as string]: i }}
                onClick={() => onChoose(c.key, { scrollTo: 'hizmetler' })}
                aria-pressed={active}
              >
                <span className="pcard__top">
                  <c.Icon className="pcard__icon" />
                  <span className="pcard__eyebrow">{p.eyebrow}</span>
                </span>

                <span className="pcard__title display t-h3">{p.label}</span>
                <span className="pcard__lede">{p.lede}</span>

                <span className="pcard__items">
                  {c.items.map((it) => (
                    <span className="pcard__chip" key={it}>
                      {it}
                    </span>
                  ))}
                </span>

                <span className="pcard__foot">
                  <span className="pcard__note">{c.note}</span>
                  <span className="pcard__go">
                    {p.cta}
                    <IconArrow className="pcard__arrow" />
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
