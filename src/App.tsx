import { useCallback, useState } from 'react';
import './styles/tokens.css';
import './styles/base.css';
import './styles/sections.css';

import { ConceptRibbon } from './components/ConceptRibbon';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PathChooser } from './components/PathChooser';
import { Services } from './components/Services';
import { FilmSimulator } from './components/FilmSimulator';
import { Gallery } from './components/Gallery';
import { Trust } from './components/Trust';
import { Reviews } from './components/Reviews';
import { QuoteForm } from './components/QuoteForm';
import { Faq } from './components/Faq';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { MobileBar } from './components/MobileBar';

import { usePath } from './hooks/usePath';

export default function App() {
  const { path, setPath } = usePath('arac');
  const [preset, setPreset] = useState<string | null>(null);

  /** Hizmet kartından forma aktarım: seçimi taşı ve forma kaydır. */
  const pickService = useCallback((value: string) => {
    setPreset(value);
    const el = document.getElementById('teklif');
    el?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
  }, []);

  return (
    <>
      <ConceptRibbon />
      <a className="skip-link" href="#icerik">
        İçeriğe geç
      </a>

      <Header path={path} setPath={setPath} />

      <main id="icerik">
        <Hero onChoose={setPath} />
        <PathChooser path={path} onChoose={setPath} />
        <Services path={path} onPick={pickService} />
        <FilmSimulator path={path} />
        <Gallery path={path} />
        <Trust />
        <Reviews path={path} />
        <QuoteForm path={path} preset={preset} onPresetConsumed={() => setPreset(null)} />
        <Faq path={path} />
        <Contact />
      </main>

      <Footer />
      <MobileBar path={path} />
    </>
  );
}
