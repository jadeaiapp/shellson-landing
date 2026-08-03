/**
 * Hizmet ikonları — bu proje için çizilmiş, tek çizgi ağırlığında (1.6),
 * tek dil. Emoji kullanılmaz.
 */
type P = { className?: string };

const base = {
  viewBox: '0 0 32 32',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false as const,
};

/* ── Otomotiv ─────────────────────────────────────────────────────────────── */

export const IconTint = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 20.5 6.6 13a3 3 0 0 1 2.8-2h13.2a3 3 0 0 1 2.8 2L28 20.5" />
    <path d="M2.8 20.5h26.4v4.2a1 1 0 0 1-1 1h-3.2a1 1 0 0 1-1-1v-1.3H9v1.3a1 1 0 0 1-1 1H4.8a1 1 0 0 1-1-1z" />
    <path d="M16 11v9.5" />
    <path d="M9 13.4h5.2v6H7z" fill="currentColor" fillOpacity="0.16" stroke="none" />
    <path d="M17.8 13.4H23l2 6h-7.2z" fill="currentColor" fillOpacity="0.32" stroke="none" />
  </svg>
);

export const IconPpf = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M5 22c2.4-6.2 6-9.6 11-10.2 5-.6 8.7 1.4 11 6" />
    <path d="M5 26c2.4-6.2 6-9.6 11-10.2 5-.6 8.7 1.4 11 6" strokeDasharray="2.5 2.5" />
    <path d="M12.5 7.5 15 5l2.5 2.5" />
    <path d="M15 5v6" />
  </svg>
);

export const IconWrap = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 9.5 16 4l12 5.5-12 5.5z" />
    <path d="M4 9.5v11L16 26l12-5.5v-11" />
    <path d="M16 15v11" />
    <path d="M10 12.2v10.4" strokeDasharray="2 2.4" />
  </svg>
);

export const IconColor = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="16" cy="16" r="11" />
    <path d="M16 5a11 11 0 0 1 0 22z" fill="currentColor" fillOpacity="0.22" stroke="none" />
    <path d="M16 5v22" />
    <path d="M9.5 11.5h4M8.6 16h5.4M9.5 20.5h4" />
  </svg>
);

/* ── Mimari ───────────────────────────────────────────────────────────────── */

export const IconFacade = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M6 27V8.5L17 4l9 3.6V27" />
    <path d="M3 27h26" />
    <path d="M10 12h4v4.5h-4zM19 12h4v4.5h-4zM10 20h4v4h-4zM19 20h4v4h-4z" />
    <path d="M19 12h4v4.5h-4z" fill="currentColor" fillOpacity="0.28" stroke="none" />
    <path d="M10 20h4v4h-4z" fill="currentColor" fillOpacity="0.28" stroke="none" />
  </svg>
);

export const IconHeat = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="16" cy="10" r="4.5" />
    <path d="M16 2v2.4M16 15.6V18M24 10h-2.4M10.4 10H8M21.6 4.4l-1.7 1.7M12.1 13.9l-1.7 1.7M21.6 15.6l-1.7-1.7M12.1 6.1 10.4 4.4" />
    <path d="M5 22h22M5 26h22" />
  </svg>
);

export const IconGlare = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M6 7h20v13H6z" />
    <path d="M12 25h8M16 20v5" />
    <path d="m9 17 5-7 3.4 4.4L20 12l3 5z" fill="currentColor" fillOpacity="0.22" />
    <path d="M22 4.5 26.5 9M25 4l1.6 1.6" />
  </svg>
);

export const IconPrivacy = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 16s4.4-7 12-7 12 7 12 7-4.4 7-12 7-12-7-12-7z" />
    <circle cx="16" cy="16" r="3.2" />
    <path d="M6 26 26 6" strokeWidth="2" />
  </svg>
);

export const IconUv = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M7 5v9.5a5 5 0 0 0 10 0V5" />
    <path d="M20 5h3.6a3.4 3.4 0 0 1 0 6.8H20V5z" />
    <path d="M20 11.8v7.7" />
    <path d="M5 25h22" strokeDasharray="3 3" />
  </svg>
);

/* ── Yardımcı ─────────────────────────────────────────────────────────────── */

export const IconWhatsApp = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable={false} className={className}>
    <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.18-1.36a9.9 9.9 0 0 0 4.86 1.24h.01c5.5 0 9.96-4.46 9.96-9.96 0-2.66-1.04-5.16-2.92-7.04A9.88 9.88 0 0 0 12.04 2Zm0 1.82c2.18 0 4.22.85 5.76 2.39a8.1 8.1 0 0 1 2.38 5.76c0 4.5-3.65 8.14-8.15 8.14a8.2 8.2 0 0 1-4.15-1.13l-.3-.18-3.07.8.82-3-.2-.31a8.1 8.1 0 0 1-1.26-4.33c0-4.5 3.66-8.14 8.17-8.14Zm-2.4 4.03c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.34.99 2.5c.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.46-.28-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.55.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.45-1.35-1.69-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.32-.74-1.8-.2-.48-.4-.41-.55-.42h-.47Z" />
  </svg>
);

export const IconArrow = ({ className }: P) => (
  <svg {...base} className={className} viewBox="0 0 24 24">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const IconChevron = ({ className }: P) => (
  <svg {...base} className={className} viewBox="0 0 24 24">
    <path d="m7 10 5 5 5-5" />
  </svg>
);

export const IconClose = ({ className }: P) => (
  <svg {...base} className={className} viewBox="0 0 24 24" strokeWidth={2}>
    <path d="M6 6 18 18M18 6 6 18" />
  </svg>
);

export const IconPin = ({ className }: P) => (
  <svg {...base} className={className} viewBox="0 0 24 24">
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

export const IconPhone = ({ className }: P) => (
  <svg {...base} className={className} viewBox="0 0 24 24">
    <path d="M6.5 3h3l1.6 4-2.1 1.5a12 12 0 0 0 5.5 5.5L16 11.9l4 1.6v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3.4 5.2 2 2 0 0 1 5.4 3h1.1Z" />
  </svg>
);

export const IconClock = ({ className }: P) => (
  <svg {...base} className={className} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5.4l3.4 2" />
  </svg>
);

export const ICONS = {
  tint: IconTint,
  ppf: IconPpf,
  wrap: IconWrap,
  color: IconColor,
  facade: IconFacade,
  heat: IconHeat,
  glare: IconGlare,
  privacy: IconPrivacy,
  uv: IconUv,
} as const;

export type IconKey = keyof typeof ICONS;
