/**
 * Talep formları.
 *
 * Form hiçbir sunucuya veri göndermez. Girilenler yalnızca tarayıcıda bir
 * WhatsApp mesajına dönüşür; kullanıcı göndermeden önce mesajı görür.
 */
import {
  autoServices,
  buildingNeeds,
  buildingSpaceOptions,
  buildingMessage,
  vehicleMessage,
  whatsappUrl,
  concept,
  formatPhone,
} from '../data/business';
import { h, icon, ICONS, slot } from '../lib/dom';
import { getPath, onPathChange, setPath, type Path } from '../lib/state';

interface FieldSpec {
  name: string;
  label: string;
  type: 'text' | 'tel' | 'select' | 'textarea';
  required?: boolean;
  options?: readonly string[];
  hint?: string;
  placeholder?: string;
  wide?: boolean;
  inputmode?: string;
  autocomplete?: string;
}

type Values = Record<string, string>;

const YEARS = ['Belirtmek istemiyorum', ...range(2027, 1995)];

function range(from: number, to: number): string[] {
  const out: string[] = [];
  for (let y = from; y >= to; y--) out.push(String(y));
  return out;
}

/** Türkiye cep telefonu için gevşek ama işe yarar bir kontrol. */
function normalisePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  if (/^90\d{10}$/.test(digits)) return digits.slice(2);
  if (/^0\d{10}$/.test(digits)) return digits.slice(1);
  if (/^\d{10}$/.test(digits)) return digits;
  return null;
}

function buildField(spec: FieldSpec, formId: string, onInput: () => void): HTMLElement {
  const id = `${formId}-${spec.name}`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const describedBy = [spec.hint ? hintId : '', errorId].filter(Boolean).join(' ');

  const shared: Record<string, unknown> = {
    id,
    name: spec.name,
    'aria-describedby': describedBy,
    oninput: onInput,
    onchange: onInput,
  };

  let control: HTMLElement;
  if (spec.type === 'select') {
    control = h(
      'select',
      { ...shared, required: spec.required },
      h('option', { value: '', text: 'Seçin…' }),
      ...(spec.options ?? []).map((option) => h('option', { value: option, text: option }))
    );
  } else if (spec.type === 'textarea') {
    control = h('textarea', {
      ...shared,
      rows: 3,
      placeholder: spec.placeholder ?? '',
    });
  } else {
    control = h('input', {
      ...shared,
      type: spec.type,
      required: spec.required,
      placeholder: spec.placeholder ?? '',
      inputmode: spec.inputmode,
      autocomplete: spec.autocomplete,
    });
  }

  return h(
    'div',
    { class: `field${spec.wide ? ' field--wide' : ''}`, 'data-field': spec.name },
    h(
      'label',
      { class: 'field__label', for: id },
      spec.label,
      !spec.required && h('span', { class: 'field__opt', text: ' (isteğe bağlı)' })
    ),
    control,
    spec.hint && h('p', { class: 'field__hint', id: hintId, text: spec.hint }),
    h('p', { class: 'field__error', id: errorId, role: 'alert' }, icon(ICONS.alert), h('span', { text: '' }))
  );
}

function readValues(form: HTMLFormElement): Values {
  const values: Values = {};
  for (const element of Array.from(form.elements)) {
    const field = element as HTMLInputElement;
    if (field.name) values[field.name] = field.value.trim();
  }
  return values;
}

function setError(form: HTMLFormElement, name: string, message: string | null): void {
  const wrapper = form.querySelector<HTMLElement>(`[data-field="${name}"]`);
  if (!wrapper) return;
  const control = wrapper.querySelector<HTMLInputElement>('input, select, textarea');
  const errorText = wrapper.querySelector<HTMLElement>('.field__error span');

  wrapper.classList.toggle('is-invalid', Boolean(message));
  if (control) control.setAttribute('aria-invalid', message ? 'true' : 'false');
  if (errorText) errorText.textContent = message ?? '';
}

interface FormConfig {
  id: string;
  path: Exclude<Path, 'none'>;
  fields: FieldSpec[];
  required: { name: string; message: string }[];
  compose(values: Values, phone: string): string;
  extraNote?: string;
  submitLabel: string;
}

function buildForm(config: FormConfig): HTMLFormElement {
  const form = h('form', {
    class: 'qform',
    id: `panel-${config.path}`,
    role: 'tabpanel',
    'aria-labelledby': `tab-${config.path}`,
    novalidate: true,
  }) as HTMLFormElement;

  const previewText = h('p', {
    class: 'qform__preview-text',
    text: 'Alanları doldurdukça mesajınız burada oluşur.',
  });

  const grid = h('div', { class: 'qform__grid' });
  const update = () => {
    const values = readValues(form);
    const phone = normalisePhone(values.phone ?? '');
    // Ön izleme, zorunlu alanlar eksik olsa da elde ne varsa onu gösterir.
    previewText.textContent = config.compose(values, phone ? formatPhone(phone) : (values.phone ?? ''));
  };

  for (const spec of config.fields) grid.append(buildField(spec, config.id, update));

  const submit = h(
    'button',
    { class: 'btn btn--wa', type: 'submit' },
    icon(ICONS.whatsapp),
    h('span', { text: config.submitLabel })
  );

  form.append(
    grid,
    h(
      'div',
      { class: 'qform__foot' },
      h(
        'div',
        { class: 'qform__preview' },
        h(
          'p',
          { class: 'qform__preview-label' },
          icon(ICONS.send),
          h('span', { text: 'Gönderilecek mesaj' })
        ),
        previewText
      ),
      config.extraNote && h('p', { class: 'qform__hint', text: config.extraNote }),
      submit,
      h('p', {
        class: 'qform__hint',
        text: 'WhatsApp yeni sekmede açılır. Göndermeden önce mesajı düzenleyebilirsiniz.',
      })
    )
  );

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const values = readValues(form);

    let firstInvalid: string | null = null;
    for (const rule of config.required) {
      const missing = !values[rule.name];
      setError(form, rule.name, missing ? rule.message : null);
      if (missing && !firstInvalid) firstInvalid = rule.name;
    }

    const phone = normalisePhone(values.phone ?? '');
    if (values.phone && !phone) {
      setError(form, 'phone', 'Numarayı 10 haneli olarak yazın, örnek: 0555 044 10 82');
      if (!firstInvalid) firstInvalid = 'phone';
    }

    if (firstInvalid) {
      const control = form.querySelector<HTMLElement>(
        `[data-field="${firstInvalid}"] input, [data-field="${firstInvalid}"] select, [data-field="${firstInvalid}"] textarea`
      );
      control?.focus();
      return;
    }

    const message = config.compose(values, formatPhone(phone!));
    window.open(whatsappUrl(message), '_blank', 'noopener');
  });

  update();
  return form;
}

// ---------------------------------------------------------------------------

const SERVICE_OPTIONS = [
  ...autoServices.map((service) => service.title),
  'Emin değilim, önerinizi istiyorum',
];

const NEED_OPTIONS = buildingNeeds.map((need) => need.label);

let vehicleForm: HTMLFormElement | null = null;
let buildingForm: HTMLFormElement | null = null;

export function renderForms(): void {
  const target = slot('quote-forms');
  if (!target) return;

  vehicleForm = buildForm({
    id: 'arac',
    path: 'arac',
    submitLabel: 'WhatsApp’tan fiyat iste',
    fields: [
      { name: 'brand', label: 'Araç markası', type: 'text', required: true, placeholder: 'Örn. BMW', autocomplete: 'off' },
      { name: 'model', label: 'Araç modeli', type: 'text', required: true, placeholder: 'Örn. 3 Serisi', autocomplete: 'off' },
      { name: 'year', label: 'Model yılı', type: 'select', required: true, options: YEARS },
      { name: 'service', label: 'İstediğiniz hizmet', type: 'select', required: true, options: SERVICE_OPTIONS },
      {
        name: 'area',
        label: 'Uygulanacak bölge',
        type: 'text',
        wide: true,
        placeholder: 'Örn. sadece yan ve arka camlar / kaput ve farlar',
        hint: 'Aklınızda belirli bir bölge varsa yazın; yoksa boş bırakın.',
      },
      {
        name: 'phone',
        label: 'Telefon numaranız',
        type: 'tel',
        required: true,
        placeholder: '0555 044 10 82',
        inputmode: 'tel',
        autocomplete: 'tel',
        hint: 'Size dönebilmeleri için.',
      },
      { name: 'note', label: 'Ek not', type: 'textarea', wide: true, placeholder: 'Eklemek istediğiniz bir şey var mı?' },
    ],
    required: [
      { name: 'brand', message: 'Araç markasını yazın.' },
      { name: 'model', message: 'Araç modelini yazın.' },
      { name: 'year', message: 'Model yılını seçin.' },
      { name: 'service', message: 'Hangi hizmeti istediğinizi seçin.' },
      { name: 'phone', message: 'Telefon numaranızı yazın.' },
    ],
    compose: (values, phone) =>
      vehicleMessage({
        brand: values.brand || '[marka]',
        model: values.model || '[model]',
        year: values.year && values.year !== 'Belirtmek istemiyorum' ? values.year : '',
        service: values.service || '[hizmet]',
        area: values.area,
        phone: phone || '[telefon]',
        note: values.note,
      }),
  });

  buildingForm = buildForm({
    id: 'bina',
    path: 'bina',
    submitLabel: 'WhatsApp’tan keşif iste',
    extraNote:
      'İpucu: WhatsApp’a geçtiğinizde camların fotoğrafını da gönderirseniz ön değerlendirme belirgin şekilde hızlanır.',
    fields: [
      { name: 'space', label: 'Mekân türü', type: 'select', required: true, options: buildingSpaceOptions },
      {
        name: 'location',
        label: 'İlçe veya semt',
        type: 'text',
        required: true,
        placeholder: 'Örn. Kağıthane',
        autocomplete: 'address-level2',
      },
      {
        name: 'need',
        label: 'İhtiyacınız',
        type: 'select',
        required: true,
        options: NEED_OPTIONS,
        wide: true,
        hint: 'Bunlar ihtiyaç başlıklarıdır; hangi ürünün uygun olduğuna keşifte birlikte karar verilir.',
      },
      {
        name: 'size',
        label: 'Yaklaşık cam adedi veya m²',
        type: 'text',
        placeholder: 'Örn. 12 pencere veya 25 m²',
        hint: 'Tam bilmiyorsanız kabaca yazın.',
      },
      {
        name: 'phone',
        label: 'Telefon numaranız',
        type: 'tel',
        required: true,
        placeholder: '0555 044 10 82',
        inputmode: 'tel',
        autocomplete: 'tel',
      },
      { name: 'note', label: 'Ek not', type: 'textarea', wide: true, placeholder: 'Kat, cephe yönü, erişim durumu…' },
    ],
    required: [
      { name: 'space', message: 'Mekân türünü seçin.' },
      { name: 'location', message: 'İlçe veya semt yazın.' },
      { name: 'need', message: 'İhtiyacınızı seçin.' },
      { name: 'phone', message: 'Telefon numaranızı yazın.' },
    ],
    compose: (values, phone) =>
      buildingMessage({
        space: values.space || '[mekân]',
        location: values.location || '[konum]',
        need: values.need || '[ihtiyaç]',
        size: values.size,
        phone: phone || '[telefon]',
        note: values.note,
      }),
  });

  target.replaceChildren(vehicleForm, buildingForm);

  const notice = slot('form-notice');
  if (notice) {
    notice.replaceChildren(icon(ICONS.info), h('span', { text: concept.formNotice }));
  }

  syncFormVisibility(getPath());
  onPathChange(syncFormVisibility);
}

function syncFormVisibility(path: Path): void {
  // Yol seçilmemişse varsayılan olarak araç formu görünür; sekmeler her hâlükârda çalışır.
  const active = path === 'bina' ? 'bina' : 'arac';
  if (vehicleForm) vehicleForm.hidden = active !== 'arac';
  if (buildingForm) buildingForm.hidden = active !== 'bina';

  for (const tab of document.querySelectorAll<HTMLButtonElement>('.quote__tab')) {
    const isActive = tab.dataset.choosePath === active;
    tab.setAttribute('aria-selected', String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  }
}

/** Bir hizmet kartından gelindiğinde formu hazırlar. */
export function presetVehicleService(title: string): void {
  setPath('arac');
  const select = vehicleForm?.querySelector<HTMLSelectElement>('[name="service"]');
  if (!select) return;
  const match = Array.from(select.options).find((option) => option.value === title);
  select.value = match ? title : 'Emin değilim, önerinizi istiyorum';
  select.dispatchEvent(new Event('change', { bubbles: true }));
}

/** Bir mekân kartından gelindiğinde formu hazırlar. */
export function presetBuildingSpace(title: string): void {
  setPath('bina');
  const select = buildingForm?.querySelector<HTMLSelectElement>('[name="space"]');
  if (!select) return;
  const match = Array.from(select.options).find((option) => option.value === title);
  if (match) {
    select.value = title;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }
}
