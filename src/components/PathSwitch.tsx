import { paths, type PathKey } from '../content/business';

/**
 * Yol seçici. Dekoratif değildir: seçim vurgu rengini, hizmet listesini,
 * galeri filtresini, SSS grubunu, formu ve WhatsApp mesajını değiştirir.
 * Radyo grubu semantiği kullanılır — klavyede ok tuşlarıyla gezilir.
 */
export function PathSwitch({
  path,
  setPath,
  size = 'md',
  onPick,
}: {
  path: PathKey;
  setPath: (p: PathKey, o?: { scrollTo?: string }) => void;
  size?: 'sm' | 'md' | 'lg';
  onPick?: () => void;
}) {
  const order: PathKey[] = ['arac', 'yapi'];

  return (
    <div className={`pswitch pswitch--${size}`} role="radiogroup" aria-label="Hizmet yolu seçimi">
      <span className="pswitch__slider" data-active={path} aria-hidden />
      {order.map((key) => {
        const active = path === key;
        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={active}
            className={`pswitch__btn${active ? ' is-active' : ''}`}
            data-path={key}
            onClick={() => {
              setPath(key);
              onPick?.();
            }}
          >
            {size === 'sm' ? paths[key].shortLabel : paths[key].label}
          </button>
        );
      })}
    </div>
  );
}
