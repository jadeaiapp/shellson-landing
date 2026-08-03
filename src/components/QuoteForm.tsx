import { useEffect, useMemo, useRef, useState } from 'react';
import {
  archNeedOptions,
  autoAreaOptions,
  autoServiceOptions,
  contact,
  demoMode,
  paths,
  placeTypeOptions,
  sizeOptions,
  type PathKey,
} from '../content/business';
import { IconWhatsApp } from './art/Icons';

/* ── Doğrulama ────────────────────────────────────────────────────────────── */

/** Türkiye cep numarası: 5xx xxx xx xx (başında 0 / +90 / 90 olabilir). */
function normalizePhone(raw: string): string | null {
  const d = raw.replace(/[^\d]/g, '');
  let core = d;
  if (core.startsWith('90') && core.length === 12) core = core.slice(2);
  else if (core.startsWith('0') && core.length === 11) core = core.slice(1);
  if (core.length !== 10 || !core.startsWith('5')) return null;
  return `0${core}`;
}

type Errors = Record<string, string>;

/* ── Bileşen ──────────────────────────────────────────────────────────────── */

export function QuoteForm({
  path,
  preset,
  onPresetConsumed,
}: {
  path: PathKey;
  preset: string | null;
  onPresetConsumed: () => void;
}) {
  const p = paths[path];

  // Araç alanları
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [service, setService] = useState(autoServiceOptions[0]);
  const [area, setArea] = useState('');

  // Bina alanları
  const [place, setPlace] = useState(placeTypeOptions[0]);
  const [location, setLocation] = useState('');
  const [need, setNeed] = useState(archNeedOptions[0]);
  const [size, setSize] = useState(sizeOptions[0]);

  // Ortak
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');

  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  /* Hizmet/ihtiyaç kartından gelen ön seçim */
  useEffect(() => {
    if (!preset) return;
    if (path === 'arac' && autoServiceOptions.includes(preset)) setService(preset);
    if (path === 'yapi' && archNeedOptions.includes(preset)) setNeed(preset);

    // Görsel geri bildirim: hangi alanın değiştiğini belli et
    const el = highlightRef.current;
    if (el) {
      el.classList.remove('is-flash');
      void el.offsetWidth; // reflow — animasyonu yeniden başlat
      el.classList.add('is-flash');
    }
    onPresetConsumed();
  }, [preset, path, onPresetConsumed]);

  /* Yol değişince gönderim durumunu sıfırla */
  useEffect(() => setSent(false), [path]);

  const validate = (): Errors => {
    const e: Errors = {};
    if (path === 'arac') {
      if (!brand.trim()) e.brand = 'Araç markasını yazın (örn. Renault).';
      if (!model.trim()) e.model = 'Araç modelini yazın (örn. Clio).';
      if (year.trim()) {
        const y = Number(year);
        const now = new Date().getFullYear();
        if (!Number.isInteger(y) || y < 1970 || y > now + 1) {
          e.year = `Model yılı 1970 ile ${now + 1} arasında olmalı.`;
        }
      }
    } else {
      if (!location.trim()) e.location = 'İlçe veya semt yazın (örn. Kağıthane).';
    }
    if (!phone.trim()) {
      e.phone = 'Telefon numaranızı yazın, Shellson size dönebilsin.';
    } else if (!normalizePhone(phone)) {
      e.phone = 'Numara 5 ile başlayan 10 haneli cep numarası olmalı (örn. 0555 044 10 82).';
    }
    return e;
  };

  /* Canlı mesaj önizlemesi */
  const message = useMemo(() => {
    const tel = normalizePhone(phone) ?? phone.trim();
    const lines: string[] = [];

    if (path === 'arac') {
      const car = [year.trim() && `${year.trim()} model`, brand.trim(), model.trim()]
        .filter(Boolean)
        .join(' ');
      lines.push(
        `Merhaba Shellson, ${car || 'aracım'} için ${service.toLocaleLowerCase('tr-TR')} hakkında fiyat ve süre bilgisi almak istiyorum.`,
      );
      if (area) lines.push(`Uygulanacak bölge: ${area}`);
    } else {
      const where = location.trim() ? `${location.trim()}'deki` : '';
      lines.push(
        `Merhaba Shellson, ${where} ${place.toLocaleLowerCase('tr-TR')} için bina cam filmi hakkında keşif ve fiyat bilgisi almak istiyorum.`.replace(
          /\s+/g,
          ' ',
        ),
      );
      lines.push(`İhtiyaç: ${need}`);
      lines.push(`Yaklaşık büyüklük: ${size}`);
    }

    if (tel) lines.push(`Telefon: ${tel}`);
    if (note.trim()) lines.push(`Not: ${note.trim()}`);
    if (path === 'yapi') lines.push('(Camların fotoğrafını buradan gönderebilirim.)');

    return lines.join('\n');
  }, [path, brand, model, year, service, area, place, location, need, size, phone, note]);

  const waHref = `https://wa.me/${contact.whatsapp.value}?text=${encodeURIComponent(message)}`;

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    setTouched((t) => ({ ...t, brand: true, model: true, location: true, phone: true, year: true }));

    if (Object.keys(e).length > 0) {
      // İlk hatalı alana odaklan
      const first = Object.keys(e)[0];
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
      el?.focus();
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }

    setSent(true);
    window.open(waHref, '_blank', 'noopener,noreferrer');
  };

  const blur = (field: string) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate());
  };

  const err = (field: string) => (touched[field] ? errors[field] : undefined);

  return (
    <section className="section section--ink on-ink form-sec" id="teklif" aria-labelledby="form-title">
      <div className="wrap">
        <div className="form-sec__grid">
          {/* ── Sol: başlık + güvence ── */}
          <div className="form-sec__intro">
            <p className="tag tag--accent">{p.eyebrow}</p>
            <h2 className="display t-h2" id="form-title">
              {p.formTitle}
            </h2>
            <p className="lede">{p.formLede}</p>

            <ul className="form-sec__steps">
              <li>
                <span className="form-sec__stepNo">1</span>
                Alanları doldurun
              </li>
              <li>
                <span className="form-sec__stepNo">2</span>
                Mesaj aşağıda hazırlanır
              </li>
              <li>
                <span className="form-sec__stepNo">3</span>
                WhatsApp açılır, siz gönderirsiniz
              </li>
            </ul>

            <p className="form-sec__privacy">{demoMode.formNote}</p>
          </div>

          {/* ── Sağ: form ── */}
          <form className="form card" onSubmit={handleSubmit} ref={formRef} noValidate>
            {path === 'arac' ? (
              <>
                <div className="form__row form__row--2">
                  <Field
                    label="Araç markası"
                    name="brand"
                    value={brand}
                    onChange={setBrand}
                    onBlur={blur('brand')}
                    error={err('brand')}
                    placeholder="Renault"
                    required
                    autoComplete="off"
                  />
                  <Field
                    label="Model"
                    name="model"
                    value={model}
                    onChange={setModel}
                    onBlur={blur('model')}
                    error={err('model')}
                    placeholder="Clio"
                    required
                    autoComplete="off"
                  />
                </div>

                <div className="form__row form__row--2">
                  <Field
                    label="Model yılı"
                    name="year"
                    value={year}
                    onChange={setYear}
                    onBlur={blur('year')}
                    error={err('year')}
                    placeholder="2022"
                    inputMode="numeric"
                    hint="İsteğe bağlı"
                  />
                  <div className="field" ref={highlightRef}>
                    <label className="field__label" htmlFor="f-service">
                      İstenen hizmet
                    </label>
                    <select
                      id="f-service"
                      name="service"
                      className="field__input field__input--select"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                    >
                      {autoServiceOptions.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="f-area">
                    Uygulanacak bölge <span className="field__hint">İsteğe bağlı</span>
                  </label>
                  <select
                    id="f-area"
                    name="area"
                    className="field__input field__input--select"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                  >
                    <option value="">Seçmek istemiyorum</option>
                    {autoAreaOptions.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="form__row form__row--2">
                  <div className="field">
                    <label className="field__label" htmlFor="f-place">
                      Mekân türü
                    </label>
                    <select
                      id="f-place"
                      name="place"
                      className="field__input field__input--select"
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                    >
                      {placeTypeOptions.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <Field
                    label="İlçe / semt"
                    name="location"
                    value={location}
                    onChange={setLocation}
                    onBlur={blur('location')}
                    error={err('location')}
                    placeholder="Kağıthane"
                    required
                    autoComplete="address-level2"
                  />
                </div>

                <div className="field" ref={highlightRef}>
                  <label className="field__label" htmlFor="f-need">
                    Çözmek istediğiniz sorun
                  </label>
                  <select
                    id="f-need"
                    name="need"
                    className="field__input field__input--select"
                    value={need}
                    onChange={(e) => setNeed(e.target.value)}
                  >
                    {archNeedOptions.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                  <p className="field__help">
                    Hangi filmin uygun olduğuna keşifte, camları görerek karar veriliyor.
                  </p>
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="f-size">
                    Yaklaşık cam adedi
                  </label>
                  <select
                    id="f-size"
                    name="size"
                    className="field__input field__input--select"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                  >
                    {sizeOptions.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <Field
              label="Telefon numaranız"
              name="phone"
              value={phone}
              onChange={setPhone}
              onBlur={blur('phone')}
              error={err('phone')}
              placeholder="0555 044 10 82"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
            />

            <div className="field">
              <label className="field__label" htmlFor="f-note">
                Eklemek istediğiniz not <span className="field__hint">İsteğe bağlı</span>
              </label>
              <textarea
                id="f-note"
                name="note"
                className="field__input field__input--area"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={
                  path === 'arac'
                    ? 'Örn. hafta içi öğleden sonra müsaitim.'
                    : 'Örn. 3. kat, cephe sabit cam.'
                }
                maxLength={400}
              />
            </div>

            {/* Canlı önizleme */}
            <div className="preview">
              <p className="preview__head">
                <span className="tag tag--accent">WhatsApp’a gidecek mesaj</span>
              </p>
              <pre className="preview__body">{message}</pre>
            </div>

            {path === 'yapi' && (
              <p className="form__photo">
                Camların fotoğrafını WhatsApp’tan gönderirseniz keşif çok daha hızlı netleşir.
              </p>
            )}

            <button type="submit" className="btn btn--accent btn--wide form__submit">
              <IconWhatsApp className="btn__wa" />
              <span>{p.cta} — WhatsApp’ta aç</span>
            </button>

            <p className="form__status" role="status" aria-live="polite">
              {sent
                ? 'WhatsApp yeni sekmede açıldı. Mesaj hazır; göndermeden önce düzenleyebilirsiniz.'
                : ''}
            </p>

            <p className="form__legal body-sm">
              Numara: {contact.phoneDisplay.value} · Mesaj gönderilmeden önce WhatsApp’ta
              görünür, dilediğiniz gibi değiştirebilirsiniz.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ── Alan ─────────────────────────────────────────────────────────────────── */

function Field({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  type = 'text',
  inputMode,
  autoComplete,
  required,
  hint,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  type?: string;
  inputMode?: 'text' | 'numeric' | 'tel';
  autoComplete?: string;
  required?: boolean;
  hint?: string;
}) {
  const id = `f-${name}`;
  const errId = `${id}-err`;
  return (
    <div className={`field${error ? ' has-error' : ''}`}>
      <label className="field__label" htmlFor={id}>
        {label}
        {required && (
          <span className="field__req" aria-hidden>
            *
          </span>
        )}
        {hint && <span className="field__hint">{hint}</span>}
        {required && <span className="sr-only"> (zorunlu)</span>}
      </label>
      <input
        id={id}
        name={name}
        className="field__input"
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
      />
      {error && (
        <p className="field__error" id={errId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
