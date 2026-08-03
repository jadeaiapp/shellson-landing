import { contact, identity, reputation, RESEARCH_DATE_TR, type PathKey } from '../content/business';
import { IconArrow, IconPin } from './art/Icons';

/**
 * Hero — tezi ilk üç saniyede söyler:
 *   1) Shellson ne yapıyor (camdaki ışığı ve yüzeyi kontrol ediyor)
 *   2) Hem araç hem bina
 *   3) Kağıthane
 *   4) Buradan fiyat / keşif talebi çıkar
 *
 * Görsel: üst üste serilmiş film tabakaları. Sayfa yüklenirken tabakalar
 * soldan sağa açılır — çekpasın camda ilerlemesi.
 */
export function Hero({
  onChoose,
}: {
  onChoose: (p: PathKey, o?: { scrollTo?: string }) => void;
}) {
  return (
    <section className="hero" id="top">
      <HeroBackdrop />

      <div className="wrap hero__inner">
        <p className="tag tag--accent hero__eyebrow">
          Kağıthane · Araç &amp; bina cam filmi
        </p>

        <h1 className="display t-mega hero__title">
          <span className="hero__line hero__line--1">Aynı cam.</span>
          <span className="hero__line hero__line--2">Başka bir gün.</span>
        </h1>

        <p className="lede hero__lede">
          Oto cam filmi, PPF boya koruma, araç kaplama ve bina cam filmi — hepsi Harmantepe’deki
          dükkânda. Ne için geldiğinizi seçin, Shellson’a gidecek mesajı birlikte hazırlayalım.
        </p>

        <div className="hero__cta">
          <button
            type="button"
            className="btn btn--accent"
            onClick={() => onChoose('arac', { scrollTo: 'teklif' })}
          >
            Aracım için fiyat al
            <IconArrow className="btn__wa" />
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => onChoose('yapi', { scrollTo: 'teklif' })}
          >
            Bina için keşif iste
          </button>
        </div>

        <a className="hero__scroll" href="#hizmetler">
          Uygulamaları incele
        </a>

        <dl className="hero__facts">
          <div className="hero__fact">
            <dt className="tag">Google</dt>
            <dd>
              <strong>{String(reputation.rating.value).replace('.', ',')}</strong> puan ·{' '}
              {reputation.reviewCount.value} değerlendirme
              <span className="hero__asof">{RESEARCH_DATE_TR} itibarıyla</span>
            </dd>
          </div>
          <div className="hero__fact">
            <dt className="tag">Dükkân</dt>
            <dd>
              <IconPin className="hero__pin" />
              {identity.district.value}
              <span className="hero__asof">Kapanış {contact.closingTime.value}</span>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

/** Üst üste serilen film tabakaları. Tamamen dekoratif. */
function HeroBackdrop() {
  return (
    <div className="hero__bg" aria-hidden>
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="hero__bg-svg">
        <defs>
          <linearGradient id="hb-sky" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0" stopColor="#FFFDF6" />
            <stop offset="0.45" stopColor="#EFF1EE" />
            <stop offset="1" stopColor="#E2E9E7" />
          </linearGradient>
          <radialGradient id="hb-sun" cx="0.78" cy="0.16" r="0.55">
            <stop offset="0" stopColor="#FFF4D6" stopOpacity="0.95" />
            <stop offset="0.5" stopColor="#FFF4D6" stopOpacity="0.3" />
            <stop offset="1" stopColor="#FFF4D6" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hb-l1" x1="0" y1="0" x2="1" y2="0.6">
            <stop offset="0" stopColor="#0D7F7A" stopOpacity="0.22" />
            <stop offset="1" stopColor="#0B2830" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="hb-l2" x1="0" y1="0" x2="1" y2="0.4">
            <stop offset="0" stopColor="#3F51C4" stopOpacity="0.17" />
            <stop offset="1" stopColor="#0B2830" stopOpacity="0.06" />
          </linearGradient>
          <linearGradient id="hb-edge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="0.42" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="1440" height="900" fill="url(#hb-sky)" />
        <rect width="1440" height="900" fill="url(#hb-sun)" />

        {/* Tabaka 1 */}
        <g className="hero__sheet hero__sheet--1">
          <path d="M-40 236 1480 118v244L-40 486z" fill="url(#hb-l1)" />
          <path d="M-40 236 1480 118" stroke="url(#hb-edge)" strokeWidth="2.5" />
        </g>

        {/* Tabaka 2 */}
        <g className="hero__sheet hero__sheet--2">
          <path d="M-40 470 1480 330v270L-40 742z" fill="url(#hb-l2)" />
          <path d="M-40 470 1480 330" stroke="url(#hb-edge)" strokeWidth="2" />
        </g>

        {/* Tabaka 3 — ince, en üstte */}
        <g className="hero__sheet hero__sheet--3">
          <path d="M-40 704 1480 582v96L-40 812z" fill="#0B2830" fillOpacity="0.07" />
          <path d="M-40 704 1480 582" stroke="url(#hb-edge)" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}
