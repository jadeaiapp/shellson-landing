import { demoMode } from '../content/business';

/**
 * Konsept şeridi — sayfanın en üstünde, her ekran boyutunda görünür.
 * Demo modu açıkken bu şerit kaldırılmaz.
 */
export function ConceptRibbon() {
  if (!demoMode.enabled) return null;

  return (
    <div className="ribbon" role="note">
      <div className="ribbon__inner">
        <span className="ribbon__mark" aria-hidden />
        <p className="ribbon__text">{demoMode.ribbon}</p>
      </div>
    </div>
  );
}
