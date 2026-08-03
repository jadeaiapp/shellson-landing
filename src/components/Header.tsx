import { useEffect, useState } from 'react';
import { contact, paths, type PathKey } from '../content/business';
import { IconWhatsApp, IconPhone } from './art/Icons';
import { PathSwitch } from './PathSwitch';

const NAV = [
  { href: '#hizmetler', label: 'Hizmetler' },
  { href: '#fark', label: 'Ne değişiyor' },
  { href: '#uygulamalar', label: 'Uygulamalar' },
  { href: '#yorumlar', label: 'Yorumlar' },
  { href: '#sss', label: 'Sık sorulanlar' },
  { href: '#iletisim', label: 'İletişim' },
];

export function Header({
  path,
  setPath,
}: {
  path: PathKey;
  setPath: (p: PathKey, o?: { scrollTo?: string }) => void;
}) {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Menü açıkken arkadaki sayfa kaymasın + Esc ile kapansın
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className={`hdr${stuck ? ' is-stuck' : ''}`}>
      <div className="hdr__bar wrap">
        <a href="#top" className="brand" aria-label="Shellson — sayfa başı">
          <span className="brand__mark" aria-hidden>
            <svg viewBox="0 0 28 28" fill="none" aria-hidden>
              <rect x="1" y="1" width="26" height="26" rx="7" stroke="currentColor" strokeWidth="1.6" />
              <path d="M4 18h20" stroke="currentColor" strokeWidth="1.6" />
              <path d="M4 18 24 6v12z" fill="currentColor" fillOpacity="0.22" />
              <path d="M4 18 24 6" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
          <span className="brand__name">Shellson</span>
        </a>

        <nav className="hdr__nav" aria-label="Bölümler">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="hdr__link">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hdr__right">
          <div className="hdr__switch">
            <PathSwitch path={path} setPath={setPath} size="sm" />
          </div>
          <a
            className="btn btn--accent hdr__cta"
            href={`https://wa.me/${contact.whatsapp.value}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconWhatsApp className="btn__wa" />
            <span>WhatsApp</span>
          </a>
          <button
            type="button"
            className="hdr__burger"
            aria-expanded={open}
            aria-controls="mobil-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? 'Menüyü kapat' : 'Menüyü aç'}</span>
            <span className={`burger${open ? ' is-open' : ''}`} aria-hidden>
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>

      {/* Mobil menü */}
      <div id="mobil-menu" className={`mnav${open ? ' is-open' : ''}`} hidden={!open}>
        <div className="mnav__inner">
          <p className="tag">Ne için geldiniz?</p>
          <PathSwitch path={path} setPath={setPath} size="lg" onPick={() => setOpen(false)} />

          <hr className="hairline" />

          <nav aria-label="Bölümler (mobil)">
            <ul className="mnav__list">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="mnav__link" onClick={() => setOpen(false)}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mnav__actions">
            <a
              className="btn btn--accent btn--wide"
              href={`https://wa.me/${contact.whatsapp.value}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconWhatsApp className="btn__wa" />
              <span>WhatsApp’tan yaz</span>
            </a>
            <a className="btn btn--ghost btn--wide" href={`tel:${contact.phoneE164.value}`}>
              <IconPhone className="btn__wa" />
              <span>{contact.phoneDisplay.value}</span>
            </a>
          </div>
          <p className="body-sm mnav__note">{paths[path].label} için hazırlanıyor</p>
        </div>
      </div>
    </header>
  );
}
