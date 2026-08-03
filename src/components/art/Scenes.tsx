import { useId } from 'react';

/**
 * GALERİ SAHNELERİ
 *
 * Hepsi bu proje için sıfırdan çizilmiş özgün SVG'dir. Hiçbiri fotoğraf
 * değildir, hiçbiri Shellson'ın gerçek uygulaması olarak sunulmaz.
 * Ortak dil: koyu mürekkep siluet + filmin şeffaf düzlemi + kenarında ışık
 * yakalayan tek parlak çizgi.
 *
 * Tümü 400×300 tuvalde; kart oranına `slice` ile kırpılır.
 */

type SceneProps = { className?: string };

const VB = '0 0 400 300';
const SLICE = 'xMidYMid slice';

/* ── Ortak parçalar ───────────────────────────────────────────────────────── */

function Sun({ x, y, r = 26, id }: { x: number; y: number; r?: number; id: string }) {
  return (
    <>
      <circle cx={x} cy={y} r={r * 2.6} fill={`url(#${id}-halo)`} />
      <circle cx={x} cy={y} r={r} fill="#FFF9E8" />
    </>
  );
}

function Defs({ id, sky }: { id: string; sky: [string, string] }) {
  return (
    <defs>
      <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={sky[0]} />
        <stop offset="1" stopColor={sky[1]} />
      </linearGradient>
      <radialGradient id={`${id}-halo`}>
        <stop offset="0" stopColor="#FFF4D6" stopOpacity="0.95" />
        <stop offset="0.45" stopColor="#FFF4D6" stopOpacity="0.35" />
        <stop offset="1" stopColor="#FFF4D6" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${id}-film`} x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0" stopColor="#0B2830" stopOpacity="0.62" />
        <stop offset="1" stopColor="#0D7F7A" stopOpacity="0.42" />
      </linearGradient>
      <linearGradient id={`${id}-filmB`} x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0" stopColor="#0B2830" stopOpacity="0.5" />
        <stop offset="1" stopColor="#3F51C4" stopOpacity="0.4" />
      </linearGradient>
      <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
        <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={`${id}-gloss`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.5" />
        <stop offset="0.4" stopColor="#FFFFFF" stopOpacity="0.06" />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>
  );
}

/* ── 1. Sedan yan cam ─────────────────────────────────────────────────────── */

export function SceneSedan({ className }: SceneProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox={VB} preserveAspectRatio={SLICE} className={className} aria-hidden focusable={false}>
      <Defs id={id} sky={['#CFE0E2', '#EFF1EE']} />
      <rect width="400" height="300" fill={`url(#${id}-sky)`} />
      <Sun x={332} y={62} r={22} id={id} />
      {/* zemin */}
      <rect y="222" width="400" height="78" fill="#0B2830" opacity="0.08" />
      <path d="M0 222h400" stroke="#0B2830" strokeOpacity="0.16" strokeWidth="1.5" />

      {/* gövde */}
      <path
        d="M32 214c2-26 10-38 24-42l38-38c9-9 20-13 33-13h72c15 0 27 6 36 17l30 34 44 10c14 3 22 12 23 25l2 22c.4 6-4 11-10 11H42c-6 0-10-4-10-10z"
        fill="#0B2830"
      />
      {/* cam boşlukları */}
      <path d="M118 138 148 106c4-5 9-7 16-7h22v39z" fill="#DCE7E6" />
      <path d="M196 99h34c8 0 14 3 19 9l24 30h-77z" fill="#DCE7E6" />
      {/* uygulanan film */}
      <path d="M118 138 148 106c4-5 9-7 16-7h22v39z" fill={`url(#${id}-film)`} />
      <path d="M196 99h34c8 0 14 3 19 9l24 30h-77z" fill={`url(#${id}-film)`} />
      {/* film kenarı — ışığı yakalayan çizgi */}
      <path d="M186 99v39" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="2" />
      <rect x="112" y="136" width="165" height="2.5" fill={`url(#${id}-edge)`} />
      {/* yansıma */}
      <path d="M126 132 156 104h14l-30 28z" fill="#FFFFFF" opacity="0.22" />

      {/* tekerler */}
      <circle cx="108" cy="216" r="30" fill="#08181D" />
      <circle cx="108" cy="216" r="12" fill="#DCE7E6" opacity="0.85" />
      <circle cx="292" cy="216" r="30" fill="#08181D" />
      <circle cx="292" cy="216" r="12" fill="#DCE7E6" opacity="0.85" />
      {/* far ışığı */}
      <rect x="352" y="176" width="22" height="9" rx="4" fill="#FFF4D6" />
    </svg>
  );
}

/* ── 2. Kaput PPF ─────────────────────────────────────────────────────────── */

export function SceneHood({ className }: SceneProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox={VB} preserveAspectRatio={SLICE} className={className} aria-hidden focusable={false}>
      <Defs id={id} sky={['#E7EFEE', '#CBD9D8']} />
      <rect width="400" height="300" fill={`url(#${id}-sky)`} />
      {/* kaput yüzeyi */}
      <path d="M-20 300 60 92c6-16 20-26 37-26h206c17 0 31 10 37 26l80 208z" fill="#0B2830" />
      {/* parlaklık */}
      <path d="M-20 300 60 92c6-16 20-26 37-26h206c17 0 31 10 37 26l80 208z" fill={`url(#${id}-gloss)`} />
      {/* PPF kaplı bölge — sol yarı */}
      <path d="M-20 300 60 92c6-16 20-26 37-26h103v234z" fill="#3ED3C9" opacity="0.16" />
      {/* PPF kenarı */}
      <path d="M200 66v234" stroke="#FFFFFF" strokeOpacity="0.75" strokeWidth="2.5" />
      <path d="M200 66v234" stroke="#3ED3C9" strokeOpacity="0.6" strokeWidth="6" filter="blur(3px)" />
      {/* kaput çizgileri */}
      <path d="M120 70 92 300M280 70l28 230" stroke="#FFFFFF" strokeOpacity="0.1" strokeWidth="2" />
      {/* taş çizikleri — yalnız korumasız tarafta */}
      <path d="M244 148l14 9M266 196l11 6M238 232l16 8M290 122l9 5" stroke="#FFFFFF" strokeOpacity="0.34" strokeWidth="1.6" strokeLinecap="round" />
      {/* çekpas kenarı ışığı */}
      <rect x="196" y="60" width="9" height="240" fill={`url(#${id}-edge)`} opacity="0.5" />
    </svg>
  );
}

/* ── 3. Far koruma ────────────────────────────────────────────────────────── */

export function SceneHeadlight({ className }: SceneProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox={VB} preserveAspectRatio={SLICE} className={className} aria-hidden focusable={false}>
      <Defs id={id} sky={['#12414A', '#0B2830']} />
      <rect width="400" height="300" fill={`url(#${id}-sky)`} />
      {/* karoser */}
      <path d="M0 66h400v168H0z" fill="#0B2830" />
      <path d="M0 66h400" stroke="#FFFFFF" strokeOpacity="0.1" strokeWidth="2" />
      {/* far gövdesi */}
      <path d="M74 112h180c22 0 40 17 40 38s-18 38-40 38H74c-14 0-24-9-24-22v-32c0-13 10-22 24-22z" fill="#08181D" />
      {/* lens */}
      <path d="M82 122h168c17 0 31 12 31 28s-14 28-31 28H82c-10 0-17-6-17-15v-26c0-9 7-15 17-15z" fill="#DCE7E6" opacity="0.92" />
      {/* ışık kaynakları */}
      <circle cx="118" cy="150" r="19" fill="#FFF9E8" />
      <circle cx="118" cy="150" r="9" fill="#FFFFFF" />
      <circle cx="196" cy="150" r="13" fill="#FFF4D6" opacity="0.9" />
      <rect x="228" y="140" width="44" height="20" rx="10" fill="#FFF4D6" opacity="0.7" />
      {/* koruma filmi */}
      <path d="M82 122h168c17 0 31 12 31 28s-14 28-31 28H82c-10 0-17-6-17-15v-26c0-9 7-15 17-15z" fill="#3ED3C9" opacity="0.14" />
      <path d="M82 122h168c17 0 31 12 31 28s-14 28-31 28H82c-10 0-17-6-17-15v-26c0-9 7-15 17-15z" fill="none" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="2" />
      {/* parlama */}
      <path d="M92 126 66 176h20l26-50z" fill="#FFFFFF" opacity="0.3" />
      {/* huzme */}
      <path d="M290 132 400 96v108l-110-36z" fill="#FFF4D6" opacity="0.16" />
    </svg>
  );
}

/* ── 4. Mat kaplama geçişi ────────────────────────────────────────────────── */

export function SceneMatte({ className }: SceneProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox={VB} preserveAspectRatio={SLICE} className={className} aria-hidden focusable={false}>
      <Defs id={id} sky={['#DCE7E6', '#EFF1EE']} />
      <rect width="400" height="300" fill={`url(#${id}-sky)`} />
      {/* panel */}
      <rect x="0" y="44" width="400" height="212" fill="#0B2830" />
      {/* parlak yarı — sert yansımalar */}
      <path d="M0 44h200v212H0z" fill={`url(#${id}-gloss)`} />
      <path d="M22 256 128 44h44L66 256z" fill="#FFFFFF" opacity="0.16" />
      <path d="M96 256 200 44h26L122 256z" fill="#FFFFFF" opacity="0.1" />
      {/* mat yarı — dağınık, yumuşak */}
      <rect x="200" y="44" width="200" height="212" fill="#12333C" />
      <rect x="200" y="44" width="200" height="212" fill="#0D7F7A" opacity="0.1" />
      <ellipse cx="300" cy="120" rx="90" ry="44" fill="#FFFFFF" opacity="0.045" />
      {/* geçiş kenarı */}
      <path d="M200 44v212" stroke="#FFFFFF" strokeOpacity="0.8" strokeWidth="2.5" />
      <rect x="194" y="44" width="12" height="212" fill={`url(#${id}-edge)`} opacity="0.45" />
      {/* kavis çizgisi */}
      <path d="M0 196c120-34 280-34 400 0" stroke="#FFFFFF" strokeOpacity="0.12" strokeWidth="2" fill="none" />
    </svg>
  );
}

/* ── 5. Ofis cephesi ──────────────────────────────────────────────────────── */

export function SceneOffice({ className }: SceneProps) {
  const id = useId().replace(/:/g, '');
  const cols = [0, 1, 2, 3, 4];
  const rows = [0, 1, 2, 3];
  return (
    <svg viewBox={VB} preserveAspectRatio={SLICE} className={className} aria-hidden focusable={false}>
      <Defs id={id} sky={['#BFD4D6', '#E8EEEC']} />
      <rect width="400" height="300" fill={`url(#${id}-sky)`} />
      <Sun x={44} y={40} r={20} id={id} />
      {/* bina gövdesi */}
      <rect x="52" y="16" width="300" height="284" fill="#0B2830" />
      {/* pencereler */}
      {rows.map((r) =>
        cols.map((c) => {
          const x = 70 + c * 56;
          const y = 38 + r * 64;
          const filmed = r < 2; // üst iki sıra film uygulanmış
          return (
            <g key={`${r}-${c}`}>
              <rect x={x} y={y} width="44" height="46" rx="2" fill="#E4EDEB" />
              {filmed ? (
                <rect x={x} y={y} width="44" height="46" rx="2" fill={`url(#${id}-filmB)`} />
              ) : (
                <>
                  <rect x={x} y={y} width="44" height="46" rx="2" fill="#FFF4D6" opacity="0.72" />
                  <path d={`M${x} ${y + 46} ${x + 44} ${y}`} stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="6" />
                </>
              )}
              <rect x={x} y={y} width="44" height="46" rx="2" fill="none" stroke="#0B2830" strokeOpacity="0.5" />
            </g>
          );
        }),
      )}
      {/* uygulama kenarı — iki sıra arası */}
      <rect x="60" y="164" width="284" height="2.5" fill={`url(#${id}-edge)`} />
      <path d="M60 165.2h284" stroke="#93A3F5" strokeOpacity="0.55" strokeWidth="1" />
      {/* zemin */}
      <rect y="286" width="400" height="14" fill="#0B2830" opacity="0.14" />
    </svg>
  );
}

/* ── 6. Ev salonu ─────────────────────────────────────────────────────────── */

export function SceneLiving({ className }: SceneProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox={VB} preserveAspectRatio={SLICE} className={className} aria-hidden focusable={false}>
      <Defs id={id} sky={['#F2F4F1', '#DFE6E3']} />
      <rect width="400" height="300" fill={`url(#${id}-sky)`} />
      {/* pencere boşluğu */}
      <rect x="44" y="26" width="312" height="196" rx="3" fill="#CBDDDD" />
      {/* dışarısı */}
      <rect x="52" y="34" width="296" height="180" fill="#D9E8E6" />
      <Sun x={272} y={78} r={24} id={id} />
      <path d="M52 168h296v46H52z" fill="#0B2830" opacity="0.1" />
      {/* film düzlemi */}
      <rect x="52" y="34" width="296" height="180" fill={`url(#${id}-filmB)`} opacity="0.85" />
      {/* kanat ayırıcı */}
      <rect x="196" y="26" width="8" height="196" fill="#0B2830" opacity="0.85" />
      <rect x="44" y="26" width="312" height="196" rx="3" fill="none" stroke="#0B2830" strokeWidth="7" />
      {/* film kenarı */}
      <rect x="46" y="120" width="308" height="2.5" fill={`url(#${id}-edge)`} />
      {/* içeri düşen ışık — yumuşatılmış */}
      <path d="M204 222 300 300H150z" fill="#FFF4D6" opacity="0.4" />
      {/* mobilya siluetleri */}
      <path d="M28 300v-42c0-8 6-14 14-14h96c8 0 14 6 14 14v42z" fill="#0B2830" opacity="0.9" />
      <rect x="286" y="252" width="86" height="10" rx="4" fill="#0B2830" opacity="0.85" />
      <rect x="298" y="262" width="8" height="38" fill="#0B2830" opacity="0.85" />
      <rect x="352" y="262" width="8" height="38" fill="#0B2830" opacity="0.85" />
    </svg>
  );
}

/* ── 7. Mağaza vitrini ────────────────────────────────────────────────────── */

export function SceneStore({ className }: SceneProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox={VB} preserveAspectRatio={SLICE} className={className} aria-hidden focusable={false}>
      <Defs id={id} sky={['#E9EFED', '#D2DEDC']} />
      <rect width="400" height="300" fill={`url(#${id}-sky)`} />
      {/* tente */}
      <path d="M20 20h360l-14 44H34z" fill="#0B2830" />
      <path d="M34 64h332l-8 12H42z" fill="#3F51C4" opacity="0.5" />
      {/* vitrin çerçevesi */}
      <rect x="34" y="76" width="332" height="200" fill="#0B2830" />
      <rect x="48" y="90" width="304" height="172" fill="#DDE9E7" />
      {/* film */}
      <rect x="48" y="90" width="304" height="172" fill={`url(#${id}-filmB)`} />
      {/* kapı */}
      <rect x="248" y="150" width="88" height="112" fill="#12333C" />
      <circle cx="262" cy="208" r="4" fill="#93A3F5" />
      {/* vitrin ürünleri — solmaya karşı korunan */}
      <rect x="74" y="196" width="34" height="52" rx="3" fill="#93A3F5" opacity="0.85" />
      <rect x="120" y="176" width="34" height="72" rx="3" fill="#FFF4D6" opacity="0.8" />
      <rect x="166" y="206" width="34" height="42" rx="3" fill="#3ED3C9" opacity="0.75" />
      <rect x="66" y="248" width="150" height="8" rx="3" fill="#0B2830" opacity="0.5" />
      {/* film kenarı */}
      <rect x="44" y="144" width="312" height="2.5" fill={`url(#${id}-edge)`} />
      {/* cam yansıması */}
      <path d="M60 262 152 90h30L90 262z" fill="#FFFFFF" opacity="0.13" />
      <rect y="276" width="400" height="24" fill="#0B2830" opacity="0.12" />
    </svg>
  );
}

/* ── 8. Zemin kat mahremiyet ──────────────────────────────────────────────── */

export function ScenePrivacy({ className }: SceneProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox={VB} preserveAspectRatio={SLICE} className={className} aria-hidden focusable={false}>
      <Defs id={id} sky={['#DCE6E4', '#C2D2D0']} />
      <rect width="400" height="300" fill={`url(#${id}-sky)`} />
      {/* cephe */}
      <rect y="0" width="400" height="300" fill="#12333C" />
      {/* iki pencere: solda filmsiz (içerisi görünür), sağda filmli */}
      <rect x="30" y="58" width="152" height="184" rx="2" fill="#E4EDEB" />
      <rect x="218" y="58" width="152" height="184" rx="2" fill="#E4EDEB" />

      {/* sol: içerisi seçiliyor */}
      <g>
        <rect x="30" y="58" width="152" height="184" fill="#F2F6F4" />
        <rect x="52" y="150" width="60" height="72" rx="4" fill="#0B2830" opacity="0.55" />
        <circle cx="132" cy="132" r="18" fill="#0B2830" opacity="0.55" />
        <rect x="112" y="152" width="42" height="70" rx="14" fill="#0B2830" opacity="0.55" />
        <rect x="42" y="86" width="128" height="8" rx="4" fill="#0B2830" opacity="0.25" />
      </g>

      {/* sağ: film uygulanmış — siluetler kayboluyor */}
      <g>
        <rect x="218" y="58" width="152" height="184" fill="#E4EDEB" />
        <rect x="240" y="150" width="60" height="72" rx="4" fill="#0B2830" opacity="0.1" />
        <circle cx="320" cy="132" r="18" fill="#0B2830" opacity="0.1" />
        <rect x="300" y="152" width="42" height="70" rx="14" fill="#0B2830" opacity="0.1" />
        <rect x="218" y="58" width="152" height="184" fill={`url(#${id}-filmB)`} />
        <path d="M226 242 320 58h26l-94 184z" fill="#FFFFFF" opacity="0.14" />
      </g>

      {/* çerçeveler */}
      <rect x="30" y="58" width="152" height="184" rx="2" fill="none" stroke="#0B2830" strokeWidth="8" />
      <rect x="218" y="58" width="152" height="184" rx="2" fill="none" stroke="#0B2830" strokeWidth="8" />
      {/* film kenarı */}
      <rect x="212" y="52" width="9" height="196" fill={`url(#${id}-edge)`} opacity="0.55" />
      {/* kaldırım */}
      <rect y="272" width="400" height="28" fill="#0B2830" opacity="0.35" />
    </svg>
  );
}

export const SCENES = {
  sedan: SceneSedan,
  hood: SceneHood,
  headlight: SceneHeadlight,
  matte: SceneMatte,
  office: SceneOffice,
  living: SceneLiving,
  store: SceneStore,
  privacy: ScenePrivacy,
} as const;

export type SceneKey = keyof typeof SCENES;
