import { contact, demoMode, identity, RESEARCH_DATE_TR } from '../content/business';

export function Footer() {
  return (
    <footer className="foot section--ink on-ink">
      <div className="wrap foot__inner">
        <div className="foot__brand">
          <span className="brand__name display">{identity.brand}</span>
          <p className="foot__addr">
            {contact.address.value}
            <br />
            {contact.phoneDisplay.value}
          </p>
        </div>

        <div className="foot__notice">
          <p className="foot__disclaimer">{demoMode.footerNote}</p>
          <p className="foot__meta">
            İşletme bilgileri {RESEARCH_DATE_TR} tarihinde Google İşletme Profilinden
            doğrulanmıştır. Kaynaklar, çelişkiler ve doğrulanamayan bilgiler depodaki{' '}
            <code>RESEARCH.md</code> dosyasında listelenmiştir.
          </p>
          <p className="foot__meta">
            Sayfadaki tüm görseller bu konsept çalışma için çizilmiş özgün illüstrasyonlardır.
            Fiyat, garanti süresi ve marka bayiliği iddiası içermez.
          </p>
        </div>
      </div>
    </footer>
  );
}
