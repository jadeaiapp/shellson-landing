/** Küçük DOM yardımcıları — çerçeve yok, innerHTML yok. */

type Child = Node | string | number | false | null | undefined;

interface Props {
  class?: string;
  text?: string;
  html?: never; // bilinçli olarak yok: metin her zaman textContent ile basılır
  [key: string]: unknown;
}

/**
 * Eleman üretir. `on*` anahtarları olay dinleyicisi, `data-*`/`aria-*`
 * anahtarları öznitelik olarak bağlanır.
 */
export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Props | null = null,
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);

  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (value === false || value === null || value === undefined) continue;

      if (key === 'class') {
        el.className = String(value);
      } else if (key === 'text') {
        el.textContent = String(value);
      } else if (key.startsWith('on') && typeof value === 'function') {
        el.addEventListener(key.slice(2).toLowerCase(), value as EventListener);
      } else if (key in el && !key.includes('-')) {
        // value, checked, disabled, hidden gibi özellikler
        (el as unknown as Record<string, unknown>)[key] = value;
      } else {
        el.setAttribute(key, String(value));
      }
    }
  }

  append(el, children);
  return el;
}

export function append(parent: Node, children: Child[]): void {
  for (const child of children) {
    if (child === false || child === null || child === undefined) continue;
    parent.appendChild(typeof child === 'object' ? child : document.createTextNode(String(child)));
  }
}

/** SVG çizgi ikonu. Emoji kullanılmaz. */
export function icon(path: string, extraClass = ''): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', `icon ${extraClass}`.trim());
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('d', path);
  svg.appendChild(p);
  return svg;
}

/** Projede kullanılan ikon yolları (Lucide çizgi stiline yakın, elle sadeleştirilmiş). */
export const ICONS = {
  arrowRight: 'M5 12h13M13 6l6 6-6 6',
  phone:
    'M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .58 3.6 1 1 0 0 1-.25 1z',
  whatsapp:
    'M3.5 20.5l1.2-4.3A8.2 8.2 0 1 1 7.9 19zM9 8.6c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .6.5l.7 1.6c.1.3 0 .5-.1.7l-.4.5c-.2.2-.3.4-.1.7a6 6 0 0 0 2.7 2.4c.3.2.5.1.7-.1l.5-.6c.2-.2.4-.2.6-.1l1.5.8c.2.1.4.2.4.4s0 .9-.3 1.2c-.3.4-1 .8-1.5.8-1.6.1-3.8-1.2-5.3-3-.9-1-1.6-2.3-1.7-3.3-.1-.9.3-1.6.6-2z',
  pin: 'M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7.5V12l3 1.8',
  instagram:
    'M7.5 3.5h9a4 4 0 0 1 4 4v9a4 4 0 0 1-4 4h-9a4 4 0 0 1-4-4v-9a4 4 0 0 1 4-4z M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M17.2 6.9h.01',
  directions: 'M12 2.6 21.4 12 12 21.4 2.6 12 12 2.6z M10 14v-2.6a1.4 1.4 0 0 1 1.4-1.4H15 M13 8l2.4 2-2.4 2',
  star: 'M12 3.6l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.8l5.9-.9z',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 11v5 M12 8h.01',
  alert: 'M12 9v4m0 4h.01M10.3 3.9 1.8 18.1A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.7-2.9L13.7 3.9a2 2 0 0 0-3.4 0z',
  drag: 'M9 6L4 12l5 6M15 6l5 6-5 6',
  plus: 'M12 5v14M5 12h14',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z M12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
  ruler: 'M4 14.5 14.5 4l5.5 5.5L9.5 20zM8 10l1.6 1.6M11 7l1.6 1.6M14.5 13 16 14.5',
  send: 'M4.5 12 20 4.5 15.5 20l-3.7-5.8z M11.8 14.2 20 4.5',
} as const;

export function qs<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T | null {
  return root.querySelector<T>(selector);
}

export function qsa<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

/** `data-render="..."` işaretli hedefi bulur. */
export function slot(name: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-render="${name}"]`);
}
