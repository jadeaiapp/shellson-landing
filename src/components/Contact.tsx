import { contact, identity, social } from '../content/business';
import { useReveal } from '../hooks/useReveal';
import { IconClock, IconPhone, IconPin, IconWhatsApp } from './art/Icons';

/**
 * İletişim & konum. Google profilindeki iki bozuk domain bilinçli olarak
 * BAĞLANTI OLARAK KULLANILMAZ. Yalnızca doğrulanmış numara ve adres var.
 * Haftalık program doğrulanamadığı için gösterilmiyor; yalnız kapanış saati.
 */
export function Contact() {
  const ref = useReveal<HTMLDivElement>(0.12);
  const live = social.filter((s) => s.v === 'verified');

  return (
    <section className="section contact" id="iletisim" aria-labelledby="contact-title">
      <div className="wrap">
        <div className="section-head">
          <p className="tag">İletişim</p>
          <h2 className="display t-h2" id="contact-title">
            Harmantepe, Okul Caddesi
          </h2>
          <p className="lede">
            Aracınızı bırakabileceğiniz, uygulamayı yerinde görebileceğiniz fiziki bir dükkân.
            Bina keşfi için ise Shellson size geliyor.
          </p>
        </div>

        <div className="contact__grid" ref={ref}>
          <div className="contact__info">
            <ul className="cinfo">
              <li className="cinfo__item">
                <IconPhone className="cinfo__icon" />
                <div>
                  <span className="tag">Telefon &amp; WhatsApp</span>
                  <a className="cinfo__strong" href={`tel:${contact.phoneE164.value}`}>
                    {contact.phoneDisplay.value}
                  </a>
                </div>
              </li>
              <li className="cinfo__item">
                <IconPin className="cinfo__icon" />
                <div>
                  <span className="tag">Adres</span>
                  <a
                    className="cinfo__strong"
                    href={contact.mapsUrl.value}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {contact.address.value}
                  </a>
                  <span className="cinfo__sub">Plus Code: {contact.plusCode.value}</span>
                </div>
              </li>
              <li className="cinfo__item">
                <IconClock className="cinfo__icon" />
                <div>
                  <span className="tag">Saatler</span>
                  <span className="cinfo__strong">Kapanış {contact.closingTime.value}</span>
                  <span className="cinfo__sub">
                    Haftalık çalışma programı doğrulanamadığı için yazılmadı — gelmeden önce
                    arayın.
                  </span>
                </div>
              </li>
            </ul>

            <div className="contact__actions">
              <a
                className="btn btn--accent"
                href={`https://wa.me/${contact.whatsapp.value}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconWhatsApp className="btn__wa" />
                <span>WhatsApp’tan yaz</span>
              </a>
              <a className="btn btn--ghost" href={`tel:${contact.phoneE164.value}`}>
                <IconPhone className="btn__wa" />
                <span>Ara</span>
              </a>
            </div>

            <div className="contact__social">
              <span className="tag">Sosyal medya</span>
              <ul className="social">
                {live.map((s) => (
                  <li key={s.key}>
                    <a
                      className="social__link"
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {s.label}
                      <span className="social__handle">{s.handle}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="contact__map card">
            <iframe
              className="contact__frame"
              src={contact.mapsEmbed.value}
              title={`${identity.brand} konumu — ${contact.address.value}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              className="contact__directions"
              href={contact.mapsUrl.value}
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Haritalar’da aç · yol tarifi al
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
