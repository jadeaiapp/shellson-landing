import { archNeeds, archService, autoServices, paths, type PathKey } from '../content/business';
import { useReveal } from '../hooks/useReveal';
import { ICONS, IconArrow, type IconKey } from './art/Icons';

/**
 * Hizmetler. Otomotiv ve mimari ASLA aynı kart grubuna karışmaz — iki ayrı
 * içerik sistemi, iki ayrı görsel dil.
 *
 * Mimari tarafta önemli bir dürüstlük kararı var: Shellson için doğrulanmış
 * tek mimari hizmet "bina cam filmi" (işletme adında geçiyor). Isı/UV/
 * mahremiyet/güvenlik filmlerinin her birini ayrı ayrı sunduğu doğrulanmadı.
 * Bu yüzden alt başlıklar "Shellson şunu satıyor" diye değil, "sizin sorununuz
 * hangisi" diye sunuluyor ve karar keşife bırakılıyor.
 */
export function Services({
  path,
  onPick,
}: {
  path: PathKey;
  onPick: (value: string) => void;
}) {
  const ref = useReveal<HTMLDivElement>(0.12);
  const p = paths[path];

  return (
    <section className="section services" id="hizmetler" aria-labelledby="svc-title">
      <div className="wrap">
        <div className="section-head">
          <p className="tag tag--accent">{p.eyebrow}</p>
          <h2 className="display t-h2" id="svc-title">
            {p.headline}
          </h2>
          <p className="lede">{p.lede}</p>
        </div>

        <div key={path} className="services__body">
          {path === 'arac' ? (
            <div className="svc-grid stagger" ref={ref}>
              {autoServices.map((s, i) => {
                const Icon = ICONS[s.art as IconKey];
                return (
                  <article className="svc card glint" key={s.id} style={{ ['--i' as string]: i }}>
                    <Icon className="svc__icon" />
                    <h3 className="t-h3 svc__title">{s.title}</h3>
                    <p className="svc__benefit">{s.benefit}</p>
                    <p className="svc__context">
                      <span className="tag">Nerede</span>
                      {s.context}
                    </p>
                    <button type="button" className="svc__cta" onClick={() => onPick(s.title)}>
                      Bu hizmet için fiyat al
                      <IconArrow className="svc__arrow" />
                    </button>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="arch" ref={ref}>
              <article className="arch__lead card">
                <span className="arch__leadIcon">
                  {(() => {
                    const Icon = ICONS[archService.art as IconKey];
                    return <Icon className="svc__icon" />;
                  })()}
                </span>
                <h3 className="t-h3">{archService.title}</h3>
                <p className="svc__benefit">{archService.benefit}</p>
                <p className="svc__context">
                  <span className="tag">Nerede</span>
                  {archService.context}
                </p>
                <button
                  type="button"
                  className="btn btn--accent arch__leadCta"
                  onClick={() => onPick('Hangisi uygun, birlikte karar verelim')}
                >
                  Keşif iste
                  <IconArrow className="btn__wa" />
                </button>
              </article>

              <div className="arch__needs">
                <p className="tag arch__needsTag">Önce sorunu söyleyin</p>
                <div className="need-grid stagger is-in">
                  {archNeeds.map((n, i) => {
                    const Icon = ICONS[n.art as IconKey];
                    return (
                      <button
                        key={n.id}
                        type="button"
                        className="need card glint"
                        style={{ ['--i' as string]: i }}
                        onClick={() => onPick(needToOption(n.id))}
                      >
                        <Icon className="need__icon" />
                        <span className="need__title">{n.title}</span>
                        <span className="need__desc">{n.desc}</span>
                        <span className="need__go">
                          Keşif talebine ekle
                          <IconArrow className="need__arrow" />
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="arch__note body-sm">
                  Hangi filmin uygun olduğuna camları görmeden karar verilmiyor. Bu yüzden burada
                  ürün değil, çözülecek sorun seçiyorsunuz — gerisi keşifte netleşiyor.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** Sorun başlığını form seçeneğine çevirir. */
function needToOption(id: string): string {
  switch (id) {
    case 'isi':
      return 'Isı ve güneş kontrolü';
    case 'parlama':
      return 'Parlama azaltma';
    case 'mahremiyet':
      return 'Dışarıdan görünmeme (mahremiyet)';
    case 'uv':
      return 'UV / solma koruması';
    default:
      return 'Hangisi uygun, birlikte karar verelim';
  }
}
