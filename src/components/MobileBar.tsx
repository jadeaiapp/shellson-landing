import { useEffect, useState } from 'react';
import { contact, paths, type PathKey } from '../content/business';
import { IconPhone, IconWhatsApp } from './art/Icons';

/**
 * Mobilde alt eylem çubuğu. Hero'daki ana CTA ekrandan çıktıktan sonra
 * belirir, böylece kullanıcı sayfanın neresinde olursa olsun talebe bir
 * dokunuş uzakta kalır. Masaüstünde gizlidir.
 */
export function MobileBar({ path }: { path: PathKey }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 560);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`mbar${show ? ' is-show' : ''}`}>
      <a className="mbar__call" href={`tel:${contact.phoneE164.value}`}>
        <IconPhone className="mbar__icon" />
        <span className="sr-only">Shellson’ı ara: {contact.phoneDisplay.value}</span>
        <span aria-hidden>Ara</span>
      </a>
      <a className="mbar__main" href="#teklif">
        <IconWhatsApp className="mbar__icon" />
        <span>{paths[path].cta}</span>
      </a>
    </div>
  );
}
