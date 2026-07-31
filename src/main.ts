import './styles/index.css';

import { createFilmPane, type FilmPaneHandle } from './components/filmpane';
import { renderForms } from './components/forms';
import { renderGallery } from './components/gallery';
import {
  renderConceptTexts,
  renderContact,
  renderDock,
  renderFaq,
  renderFooter,
  renderHeroFacts,
  renderQuoteHeader,
  renderReasons,
  renderReviews,
  renderServices,
} from './components/sections';
import { qs, qsa } from './lib/dom';
import { enableReveals, reveal } from './lib/motion';
import { getPath, initPath, onPathChange, setPath, type Path } from './lib/state';

const SCENES = {
  arac: { slug: 'sahne-arac-ic', label: 'Araç içi' },
  bina: { slug: 'sahne-salon', label: 'Oturma odası' },
};

function bootstrap(): void {
  enableReveals();
  initPath();

  renderConceptTexts();
  renderHeroFacts();

  // Formlar önce kurulur: hizmet kartları bunlara önayar gönderiyor.
  renderForms();
  renderQuoteHeader();
  renderServices();
  renderReasons();
  renderReviews();
  renderGallery();
  renderFaq();
  renderContact();
  renderFooter();
  renderDock();

  mountFilmPanes();
  wirePathButtons();
  wireNav();
  wireReveals();
}

// ---------------------------------------------------------------------------

function mountFilmPanes(): void {
  const heroHost = qs('[data-film-pane="hero"]');
  const labHost = qs('[data-film-pane="lab"]');

  const initialScene = getPath() === 'bina' ? SCENES.bina : SCENES.arac;

  let heroPane: FilmPaneHandle | null = null;
  if (heroHost) {
    // Hero'da tek bir etkileşim var: filmi yüzeye ser. Ton kontrolü
    // bilinçli olarak laboratuvara bırakıldı.
    heroPane = createFilmPane({
      scenes: [initialScene],
      tones: false,
      eager: true,
      initialPos: 56,
      sizes: '(min-width: 62rem) 34rem, 92vw',
    });
    heroHost.replaceChildren(heroPane.element);
  }

  let labPane: FilmPaneHandle | null = null;
  if (labHost) {
    labPane = createFilmPane({
      scenes: [SCENES.arac, SCENES.bina],
      tones: true,
      sceneSwitch: true,
      initialPos: 50,
      sizes: '(min-width: 62rem) 58rem, 92vw',
    });
    labHost.replaceChildren(labPane.element);
    if (getPath() === 'bina') labPane.showScene(SCENES.bina.slug);
  }

  // Yol değişince sahneler de o dünyaya geçer.
  onPathChange((path) => {
    if (path === 'none') return;
    const scene = path === 'bina' ? SCENES.bina : SCENES.arac;
    labPane?.showScene(scene.slug);

    // Hero paneli tek sahneyle kurulduğu için yeniden kurulur.
    if (heroHost) {
      heroPane = createFilmPane({
        scenes: [scene],
        tones: false,
        eager: true,
        initialPos: 56,
        sizes: '(min-width: 62rem) 34rem, 92vw',
      });
      heroHost.replaceChildren(heroPane.element);
    }
  });
}

// ---------------------------------------------------------------------------

function wirePathButtons(): void {
  for (const element of qsa<HTMLElement>('[data-choose-path]')) {
    element.addEventListener('click', () => {
      const next = element.dataset.choosePath as Path | undefined;
      if (!next) return;
      setPath(next);

      const scrollTo = element.dataset.scroll;
      if (scrollTo) {
        const target = document.querySelector(scrollTo);
        target?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'start',
        });
      }
    });
  }

  const syncCards = (path: Path) => {
    for (const card of qsa<HTMLElement>('.pathcard')) {
      card.classList.toggle('is-active', card.dataset.choosePath === path);
      card.setAttribute('aria-pressed', String(card.dataset.choosePath === path));
    }
  };

  syncCards(getPath());
  onPathChange(syncCards);
}

// ---------------------------------------------------------------------------

function wireNav(): void {
  const toggle = qs<HTMLButtonElement>('.nav__toggle');
  const list = qs<HTMLElement>('.nav__list');
  if (!toggle || !list) return;

  const close = () => {
    list.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    list.classList.toggle('is-open', !open);
    toggle.setAttribute('aria-expanded', String(!open));
  });

  for (const link of qsa('a', list)) link.addEventListener('click', close);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && list.classList.contains('is-open')) {
      close();
      toggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (!list.classList.contains('is-open')) return;
    const target = event.target as Node;
    if (!list.contains(target) && !toggle.contains(target)) close();
  });
}

// ---------------------------------------------------------------------------

function wireReveals(): void {
  reveal(qsa('.section-head'), 0);
  reveal(qsa('.fork__cards > *'), 90);
  reveal(qsa('.hero__copy > *'), 60);
  reveal(qsa('.tonelab__pane, .contact__grid > *, .site-footer__inner > *'), 70);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  bootstrap();
}
