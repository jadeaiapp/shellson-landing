import { useId, useState } from 'react';
import type { PathKey } from '../content/business';
import { useReveal } from '../hooks/useReveal';

/**
 * İMZA ÖĞESİ — "Filmin serildiği an"
 *
 * Aynı sahne iki kez çizilir: filmsiz ve filmli. Kullanıcı aradaki kenarı
 * sürükledikçe film yüzeye serilir. Çekpasın camda ilerlemesinin karşılığı.
 *
 * DÜRÜSTLÜK NOTLARI
 *  • Sahne fotoğraf değil, bu proje için çizilmiş özgün illüstrasyondur.
 *  • İki taraf AYNI sahnedir — farklı ortamlardan sahte bir "önce/sonra"
 *    kurgusu yoktur.
 *  • Hiçbir ısı/UV engelleme yüzdesi ya da ton değeri gösterilmez; doğrulanmış
 *    bir ölçüm bulunmadığı için sayı vermek yanıltıcı olurdu.
 *  • Erişilebilirlik: görünmez bir <input type="range"> ile klavye ve dokunma
 *    desteği yerel olarak gelir.
 */

const SCENES: Record<PathKey, { label: string; on: string; off: string; caption: string }> = {
  arac: {
    label: 'Araç ön camı',
    off: 'Filmsiz cam',
    on: 'Film uygulanmış cam',
    caption: 'Direksiyon başında öğleden sonra güneşi.',
  },
  yapi: {
    label: 'Ofis camı',
    off: 'Filmsiz cam',
    on: 'Film uygulanmış cam',
    caption: 'Batıya bakan çalışma alanı, aynı saat.',
  },
};

export function FilmSimulator({ path }: { path: PathKey }) {
  const [pos, setPos] = useState(52);
  const id = useId().replace(/:/g, '');
  const ref = useReveal<HTMLDivElement>(0.25);
  const scene = SCENES[path];

  const clipId = `${id}-clip`;

  return (
    <section className="section section--ink on-ink" id="fark" aria-labelledby="sim-title">
      <div className="wrap">
        <div className="sim">
          <div className="sim__intro">
            <p className="tag tag--accent">Ne değişiyor</p>
            <h2 className="display t-h2" id="sim-title">
              Kenarı tutup çekin.
              <br />
              Film camı böyle sakinleştirir.
            </h2>
            <p className="lede">
              İki taraf da aynı sahne. Tek fark, camda film olup olmaması. Sürgüyü kaydırın ya da
              ok tuşlarını kullanın.
            </p>
            <p className="sim__disclaimer">
              Temsilî illüstrasyon. Gerçek ölçüm, ton değeri veya ısı engelleme oranı değildir —
              doğrulanmış bir ölçüm bulunmadığı için sayı verilmiyor.
            </p>
          </div>

          <div className="sim__stage-wrap" ref={ref}>
            <div className="sim__stage" style={{ ['--pos' as string]: `${pos}%` }}>
              <svg viewBox="0 0 640 420" className="sim__svg" role="img" aria-label={`${scene.label}: solda film uygulanmış, sağda filmsiz karşılaştırma`}>
                <defs>
                  <clipPath id={clipId}>
                    <rect x="0" y="0" width={(pos / 100) * 640} height="420" />
                  </clipPath>
                  <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#BBD3D6" />
                    <stop offset="1" stopColor="#E9EFEC" />
                  </linearGradient>
                  <radialGradient id={`${id}-sun`}>
                    <stop offset="0" stopColor="#FFFFFF" />
                    <stop offset="0.3" stopColor="#FFF4D6" stopOpacity="0.9" />
                    <stop offset="1" stopColor="#FFF4D6" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id={`${id}-tint`} x1="0" y1="0" x2="0.2" y2="1">
                    <stop offset="0" stopColor="#0B2830" stopOpacity="0.58" />
                    <stop offset="1" stopColor={path === 'arac' ? '#0D7F7A' : '#3F51C4'} stopOpacity="0.34" />
                  </linearGradient>
                </defs>

                {/* ── FİLMSİZ (taban) ─────────────────────────────────── */}
                <g>
                  <rect width="640" height="420" fill={`url(#${id}-sky)`} />
                  <SceneBody path={path} id={id} blown />
                </g>

                {/* ── FİLMLİ (kırpılmış üst katman) ────────────────────── */}
                <g clipPath={`url(#${clipId})`}>
                  <rect width="640" height="420" fill={`url(#${id}-sky)`} />
                  <SceneBody path={path} id={id} blown={false} />
                  {/* filmin kendisi — yalnızca cam alanını kaplar, kabini değil */}
                  <rect
                    x="0"
                    y="0"
                    width="640"
                    height={path === 'arac' ? 296 : 300}
                    fill={`url(#${id}-tint)`}
                  />
                </g>

                {/* ── Film kenarı ─────────────────────────────────────── */}
                <g className="sim__edge" transform={`translate(${(pos / 100) * 640} 0)`}>
                  <rect x="-1.5" y="0" width="3" height="420" fill="#FFFFFF" opacity="0.92" />
                  <rect x="-9" y="0" width="18" height="420" fill="#FFFFFF" opacity="0.12" />
                </g>
              </svg>

              {/* Tutamak */}
              <div className="sim__handle" aria-hidden>
                <span className="sim__handle-dot">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M9 7 5 12l4 5M15 7l4 5-4 5" />
                  </svg>
                </span>
              </div>

              <input
                className="sim__range"
                type="range"
                min={0}
                max={100}
                step={1}
                value={pos}
                onChange={(e) => setPos(Number(e.target.value))}
                aria-label={`${scene.label} karşılaştırması: filmin cam üzerinde ne kadar ilerlediği`}
                aria-valuetext={`Camın %${pos} kadarında film var`}
              />

              <span className="sim__badge sim__badge--on">{scene.on}</span>
              <span className="sim__badge sim__badge--off">{scene.off}</span>
            </div>
            <p className="sim__caption body-sm">{scene.caption}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Sahne gövdesi ────────────────────────────────────────────────────────── */

function SceneBody({ path, id, blown }: { path: PathKey; id: string; blown: boolean }) {
  return path === 'arac' ? <CarScene id={id} blown={blown} /> : <OfficeScene id={id} blown={blown} />;
}

/** Kabin içinden ön cama bakış. */
function CarScene({ id, blown }: { id: string; blown: boolean }) {
  return (
    <>
      {/* güneş */}
      <circle cx="452" cy="96" r={blown ? 132 : 92} fill={`url(#${id}-sun)`} opacity={blown ? 1 : 0.55} />
      <circle cx="452" cy="96" r={blown ? 40 : 26} fill="#FFFFFF" opacity={blown ? 1 : 0.8} />

      {/* uzak yapılar */}
      <path d="M0 200h72v-52h34v52h58v-40h44v40h72v-64h40v64h84v-46h48v46h100v40H0z" fill="#0B2830" opacity={blown ? 0.16 : 0.3} />

      {/* yol */}
      <path d="M0 214h640v82H0z" fill="#0B2830" opacity={blown ? 0.46 : 0.68} />
      <path d="M296 214 236 296h150l-24-82z" fill="#EFF1EE" opacity={blown ? 0.22 : 0.36} />
      <path d="M0 214h640" stroke="#EFF1EE" strokeOpacity={blown ? 0.3 : 0.45} strokeWidth="2" />
      {/* şerit çizgileri */}
      <path d="M104 296 152 214M540 296l-44-82" stroke="#EFF1EE" strokeOpacity={blown ? 0.16 : 0.26} strokeWidth="3" />

      {/* parlama huzmeleri — yalnızca filmsiz tarafta */}
      {blown && (
        <g opacity="0.75">
          <path d="M452 96 640 0v78zM452 96 218 0h96zM452 96 640 210v-64zM452 96 300 254h-86z" fill="#FFF9E8" opacity="0.5" />
          <rect x="0" y="70" width="640" height="54" fill="#FFF9E8" opacity="0.28" />
        </g>
      )}

      {/* kabin: torpido + direksiyon (camın altında, filmden etkilenmez) */}
      <path d="M0 296h640v124H0z" fill="#08181D" />
      <path d="M0 296h640" stroke="#0B2830" strokeWidth="6" />
      <path d="M104 420v-30c0-42 34-76 76-76h56c42 0 76 34 76 76v30z" fill="#0B2830" />
      <ellipse cx="208" cy="382" rx="72" ry="22" fill="none" stroke="#3A5A61" strokeWidth="9" />
      <rect x="192" y="374" width="32" height="16" rx="5" fill="#3A5A61" />
      {/* gösterge ışığı */}
      <rect x="424" y="332" width="140" height="52" rx="8" fill="#12333C" />
      <rect x="440" y="348" width="72" height="6" rx="3" fill="#3ED3C9" opacity="0.7" />
      <rect x="440" y="362" width="44" height="6" rx="3" fill="#3ED3C9" opacity="0.35" />
    </>
  );
}

/** Ofis içinden pencereye bakış. */
function OfficeScene({ id, blown }: { id: string; blown: boolean }) {
  return (
    <>
      <circle cx="470" cy="112" r={blown ? 140 : 96} fill={`url(#${id}-sun)`} opacity={blown ? 1 : 0.5} />
      <circle cx="470" cy="112" r={blown ? 42 : 28} fill="#FFFFFF" opacity={blown ? 1 : 0.78} />

      {/* şehir silueti */}
      <path d="M0 300h88v-96h50v96h72v-70h56v70h84v-118h58v118h96v-84h64v84h72v-56h44v56H0z" fill="#0B2830" opacity={blown ? 0.14 : 0.28} />

      {blown && (
        <g opacity="0.8">
          <path d="M470 112 640 22v96zM470 112 250 24h104zM470 112 640 250v-72z" fill="#FFF9E8" opacity="0.45" />
          <rect x="0" y="84" width="640" height="62" fill="#FFF9E8" opacity="0.3" />
        </g>
      )}

      {/* pencere kanadı ayırıcı */}
      <rect x="312" y="0" width="12" height="300" fill="#0B2830" opacity="0.85" />
      {/* pencere çerçevesi alt */}
      <rect x="0" y="292" width="640" height="16" fill="#0B2830" />

      {/* iç mekân — camın altında */}
      <rect x="0" y="308" width="640" height="112" fill="#0F2C34" />
      {/* masa */}
      <rect x="0" y="342" width="640" height="12" rx="4" fill="#173F49" />
      {/* monitör */}
      <rect x="92" y="252" width="164" height="92" rx="6" fill="#08181D" />
      <rect x="102" y="262" width="144" height="72" rx="3" fill={blown ? '#5E7A80' : '#25505A'} />
      {blown && <path d="M102 334 246 262v14L120 334z" fill="#FFF9E8" opacity="0.55" />}
      <rect x="160" y="344" width="28" height="10" fill="#08181D" />
      {/* bitki */}
      <rect x="486" y="316" width="34" height="38" rx="4" fill="#173F49" />
      <path d="M503 316c-18-12-24-30-18-46 16 4 26 20 24 40 8-18 24-26 40-22-2 18-18 30-40 30z" fill="#0D7F7A" opacity="0.65" />
    </>
  );
}
