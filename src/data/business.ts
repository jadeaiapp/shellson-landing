/**
 * Shellson — merkezi içerik kaynağı.
 *
 * Sayfadaki her işletme bilgisi, hizmet, yorum ve WhatsApp metni buradan gelir.
 * Bir bilgiyi güncellemek için yalnızca bu dosyayı değiştirmek yeterlidir.
 *
 * KURAL: Buraya doğrulanmamış bilgi yazılmaz. Doğrulanmamış bir alan varsa
 * `null` bırakılır ve arayüz o bölümü otomatik olarak gizler. Her alanın
 * kaynağı ve doğrulama seviyesi RESEARCH.md içinde kayıtlıdır.
 */

export type ServicePath = 'arac' | 'bina';

/** Bilgilerin son doğrulandığı tarih. Puan/yorum sayısı bununla birlikte gösterilir. */
export const VERIFIED_ON = '31 Temmuz 2026';

export const business = {
  /** Google İşletme Profilindeki tam ad. Sayfa başlığında ve footer'da kullanılır. */
  legalName:
    'Shellson Profesyonel Araç Kaplama ve Cam Filmi | PPF Kaplama ve Koruma | Kağıthane | Bina Cam Filmi',
  name: 'Shellson',
  tagline: 'Araç ve bina cam filmi · Kağıthane',

  phone: {
    display: '0555 044 10 82',
    /** tel: bağlantısı için E.164 */
    href: 'tel:+905550441082',
  },

  whatsapp: {
    /** wa.me için ülke kodlu, işaretsiz numara */
    number: '905550441082',
    /**
     * Bu numaranın WhatsApp'a kayıtlı olduğu DOĞRULANAMADI (RESEARCH.md §2.1).
     * Google profilinde yalnızca telefon numarası olarak listeleniyor.
     * Yayına almadan önce işletmeden teyit alınmalı.
     */
    verified: false,
  },

  address: {
    street: 'Harmantepe, Okul Cd. No:95',
    district: 'Kağıthane',
    city: 'İstanbul',
    postalCode: '34410',
    full: 'Harmantepe, Okul Cd. No:95, 34410 Kağıthane / İstanbul',
    plusCode: '3XHQ+G5 Kağıthane, İstanbul',
    mapsUrl: 'https://maps.app.goo.gl/d1fhVjgrctqvfthP6',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=' +
      encodeURIComponent('Harmantepe, Okul Cd. No:95, 34410 Kağıthane/İstanbul'),
  },

  rating: {
    value: 4.8,
    /** Bu sayı zamanla değişir — güncellerken VERIFIED_ON tarihini de güncelleyin. */
    count: 242,
    source: 'Google',
  },

  hours: {
    /** Profilde yalnızca kapanış saati okunabildi. */
    closing: '19:00',
    /**
     * Gün gün açılış–kapanış tablosu DOĞRULANAMADI (RESEARCH.md §2.2).
     * İşletmeden alındığında buraya `[{ day: 'Pazartesi', open: '09:00', close: '19:00' }, ...]`
     * biçiminde yazılır; arayüz tabloyu otomatik gösterir.
     */
    detail: null as { day: string; open: string; close: string }[] | null,
  },

  social: [
    {
      label: 'Instagram',
      handle: '@shellsonwindowfilm',
      url: 'https://www.instagram.com/shellsonwindowfilm/',
    },
    // Facebook ve YouTube hesapları doğrulanamadığı için eklenmedi (RESEARCH.md §10).
  ],
} as const;

/** Demo modu uyarı metinleri. */
export const concept = {
  banner: 'Bağımsız konsept çalışma — Shellson’ın resmî web sitesi değildir.',
  footer:
    'Bu sayfa Shellson için hazırlanmış bağımsız bir konsept çalışmadır. Shellson’ın resmî web sitesi değildir.',
  formNotice:
    'Bu form hiçbir sunucuya veri göndermez. Girdikleriniz yalnızca tarayıcınızda bir WhatsApp mesajına dönüştürülür; göndermeden önce mesajı görebilir ve değiştirebilirsiniz.',
  imageNotice:
    'Aşağıdaki görseller Shellson’ın kendi uygulamaları değildir. Hizmet türlerini anlatmak için kullanılan lisanslı stok görsellerdir.',
} as const;

// ---------------------------------------------------------------------------
// Hizmetler
// ---------------------------------------------------------------------------

export interface AutoService {
  id: string;
  title: string;
  /** Ne işe yaradığı — fayda odaklı, iddiasız. */
  blurb: string;
  /** Nerede/hangi durumda tercih edildiği. */
  context: string;
  media: string;
}

/**
 * Otomotiv hizmetleri — tamamı RESEARCH.md §5.1'de "A" seviyesinde doğrulandı.
 *
 * NOT: "Ön cam filmi" bilinçli olarak listelenmiyor. Karayolları Trafik
 * Yönetmeliği çerçevesinde ön cama film uygulaması kabul edilmiyor; ayrıca
 * Shellson'ın ön cama film uyguladığına dair bir kanıt da yok — yorumlarda
 * geçen işlemler ön camdaki ESKİ filmin sökülmesi yönünde.
 */
export const autoServices: AutoService[] = [
  {
    id: 'oto-cam-filmi',
    title: 'Oto cam filmi',
    blurb:
      'Yan ve arka camlara film. Kabin daha az ısınır, güneş parlaması azalır, gündüz dışarıdan içerisi zor seçilir.',
    context: 'Yaz sıcağında park eden, uzun yol yapan veya arka koltukta çocuk taşıyan araçlar için.',
    media: 'oto-kapi-cami',
  },
  {
    id: 'film-sokum-yenileme',
    title: 'Film sökümü ve yenileme',
    blurb:
      'Kabarmış, morarmış veya çizilmiş eski filmin sökülüp yenisiyle değiştirilmesi. Arka cam rezistansı ve anten hatları korunarak çalışılır.',
    context: 'İkinci el alınan araçlarda ve ömrünü doldurmuş filmlerde.',
    media: 'oto-film-yayma',
  },
  {
    id: 'ppf',
    title: 'PPF boya koruma filmi',
    blurb:
      'Boyanın üzerine uygulanan şeffaf koruma filmi. Taş çizikleri ve günlük sürtünmeler boyaya değil filme gelir.',
    context: 'Sıfır araçlarda ve boyası korunmak istenen araçlarda.',
    media: 'oto-film-serme',
  },
  {
    id: 'ppf-bolgesel',
    title: 'Şeffaf kaput ve far koruma',
    blurb:
      'Aracın en çok darbe alan bölgelerine kısmi PPF: kaput ön kısmı, tampon, farlar, ayna kapakları, kapı kolu çevresi.',
    context: 'Komple PPF istemeyip en kritik bölgeleri korumak isteyenler için.',
    media: 'oto-rakle',
  },
  {
    id: 'komple-kaplama',
    title: 'Komple araç kaplama',
    blurb:
      'Aracın tamamına folyo uygulaması. Görünüm değişirken orijinal boya altta kalır.',
    context: 'Filo araçları, ticari araçlar ve görünümünü değiştirmek isteyen sürücüler için.',
    media: 'oto-atolye',
  },
  {
    id: 'renk-degisimi',
    title: 'Renk değişimi ve mat kaplama',
    blurb:
      'Farklı renk veya mat doku. Boya sökülmeden yapılır, istendiğinde kaplama kaldırılabilir.',
    context: 'Aracın rengini kalıcı işlem yapmadan değiştirmek isteyenler için.',
    media: 'oto-cam-manzara',
  },
];

export interface BuildingSpace {
  id: string;
  title: string;
  /** Bu mekânda cam filminin çözdüğü somut sorun. */
  problem: string;
  /** Keşifte sorulan ölçü bilgisi. */
  measure: string;
  media: string;
}

/**
 * Mimari taraf — Google işletme adının kendisi "Bina Cam Filmi" ile bittiği için
 * hizmetin varlığı "A" seviyesinde doğrulanmıştır (RESEARCH.md §5.2).
 *
 * Otomotiv tarafından farklı olarak burada HİZMET kartı değil MEKÂN kartı
 * kullanılıyor. Sebebi doğruluk: Shellson'ın bina tarafında ısı/UV/mahremiyet/
 * güvenlik başlıklarını ayrı ürün hatları olarak sunduğu doğrulanamadı.
 * Mekân bağlamı ise doğrulanmış tek hizmetin (bina cam filmi) kapsamı içinde.
 */
export const buildingSpaces: BuildingSpace[] = [
  {
    id: 'ev',
    title: 'Ev',
    problem:
      'Güneş gören odalar öğleden sonra ısınır, mobilya ve parke rengini atar, perde sürekli kapalı kalır.',
    measure: 'Pencere sayısı ve yaklaşık cam ölçüsü',
    media: 'sahne-salon',
  },
  {
    id: 'ofis',
    title: 'Ofis',
    problem:
      'Ekranlarda güneş parlaması, cam kenarındaki masalarda ısı farkı, klimanın sürekli çalışması.',
    measure: 'Yaklaşık cam alanı (m²) ve kat',
    media: 'bina-ofis-aksam',
  },
  {
    id: 'magaza',
    title: 'Mağaza ve vitrin',
    problem:
      'Vitrindeki ürünlerin güneşte solması, gün içinde ısınan satış alanı, camın kırılma riski.',
    measure: 'Vitrin cam sayısı ve yaklaşık ölçü',
    media: 'bina-jaluzi',
  },
  {
    id: 'plaza',
    title: 'Plaza ve iş merkezi',
    problem:
      'Geniş cam cephede kat kat ısı yükü ve cephe genelinde görünüm bütünlüğü ihtiyacı.',
    measure: 'Toplam cephe alanı (m²) ve kat sayısı',
    media: 'bina-kavisli',
  },
];

/**
 * Keşif formundaki ihtiyaç seçenekleri.
 *
 * Bunlar "Shellson'ın sunduğu doğrulanmış ürün hatları" DEĞİL, müşterinin
 * ihtiyacını tarif etmesi için sunulan seçeneklerdir. Form metni bunu
 * açıkça belirtir (RESEARCH.md §5.2).
 */
export const buildingNeeds = [
  { id: 'isi', label: 'Isı ve güneş kontrolü' },
  { id: 'uv', label: 'UV koruma (solma önleme)' },
  { id: 'mahremiyet', label: 'Mahremiyet / dışarıdan görünmeme' },
  { id: 'guvenlik', label: 'Cam kırılma güvenliği' },
  { id: 'gorunum', label: 'Görünüm ve cephe bütünlüğü' },
  { id: 'emin-degilim', label: 'Emin değilim, önerinizi istiyorum' },
] as const;

export const buildingSpaceOptions = [
  'Ev',
  'Ofis',
  'Mağaza / vitrin',
  'Plaza veya iş merkezi',
  'Diğer',
] as const;

// ---------------------------------------------------------------------------
// Neden Shellson — yalnızca doğrulanmış maddeler
// ---------------------------------------------------------------------------

export const reasons = [
  {
    title: `Google’da ${business.rating.value.toString().replace('.', ',')} puan`,
    body: `${business.rating.count} değerlendirmenin ortalaması. ${VERIFIED_ON} tarihinde Google İşletme Profilinden alındı.`,
  },
  {
    title: 'Kağıthane’de fiziksel atölye',
    body: 'Harmantepe, Okul Caddesi’nde açık adres. Aracınızı bırakabileceğiniz, gidip görebileceğiniz bir yer.',
  },
  {
    title: 'Araç ve bina, tek yerden',
    body: 'Oto cam filmi, PPF ve kaplamanın yanında bina cam filmi de aynı işletmede. İki ayrı firma aramanız gerekmiyor.',
  },
  {
    title: 'Seçenekleri anlatarak çalışma',
    body: 'Google yorumlarında en çok tekrar eden konu: film seçeneklerinin gösterilerek ve denenerek anlatılması, kararın müşteriye bırakılması.',
  },
  {
    title: 'Yorumlara dönen bir işletme',
    body: 'İşletme sahibi Google yorumlarına düzenli yanıt veriyor; memnuniyetsizlik bildiren yorumlarda telafi teklif ediyor.',
  },
] as const;

// ---------------------------------------------------------------------------
// Müşteri yorumları — tamamı gerçek, Google İşletme Profilinden
// ---------------------------------------------------------------------------

export interface Review {
  author: string;
  /** Profilde göründüğü göreli tarih. */
  date: string;
  /** Kısaltılmış ama anlamı değiştirilmemiş alıntı. */
  quote: string;
  topic: string;
  path: ServicePath;
}

/**
 * KURAL: Bu listeye uydurma yorum eklenmez.
 *
 * Yıldız gösterilmiyor — tekil yorumların kaç yıldız verdiği profil
 * görüntüsünde okunamadı (RESEARCH.md §8.2). Okunamayan bir puanı
 * göstermektense hiç göstermemek doğru olan.
 *
 * Bina cam filmi hizmetine ait müşteri yorumu BULUNAMADI (§8.4). Bu yüzden
 * hepsi `path: 'arac'`. Arayüz, bina yolu seçildiğinde bunu açıkça söyler.
 */
export const reviews: Review[] = [
  {
    author: 'Erdem C.',
    date: 'bir ay önce',
    quote:
      'Gittiğimizde güler yüzle karşılandık, ürün çeşitlerini ve özelliklerini deneyerek göstererek anlatarak seçmemize yardımcı oldular.',
    topic: 'Ürün seçimi',
    path: 'arac',
  },
  {
    author: 'Hakan I.',
    date: '4 hafta önce',
    quote:
      'Aşırı ilgili ve titiz bir ekip. Gönül rahatlığıyla gözünüz kapalı gelebilirsiniz.',
    topic: 'İşçilik',
    path: 'arac',
  },
  {
    author: 'mehdi k.',
    date: '2 ay önce',
    quote:
      'Clio aracıma 3M cam filmi yaptırdım… işinin ehli bir esnaf, çok memnun kaldım, tavsiye ediyorum.',
    topic: 'Oto cam filmi',
    path: 'arac',
  },
  {
    author: 'Tural K.',
    date: '4 ay önce',
    quote:
      'Aracıma cam film uygulaması yaptırdım, aldığım hizmetten oldukça memnun kaldım. İşlem 1 saat civarı sürdü.',
    topic: 'Uygulama süresi',
    path: 'arac',
  },
  {
    author: 'Filiz T. Ş.',
    date: '9 ay önce',
    quote:
      'Sıfır araç aldım ve bıraktım, 2 gün içinde PPF kaplamasını yapıp teslim ettiler. Güzel işçilik.',
    topic: 'PPF',
    path: 'arac',
  },
  {
    author: 'Furkan K.',
    date: '10 ay önce',
    quote:
      'Chery aracımıza mat kaplama ve cam filmi uygulaması yaptırdık. Çok yakıştı… tüm süreç boyunca çok ilgilendi.',
    topic: 'Mat kaplama',
    path: 'arac',
  },
  {
    author: 'Taha Y. O.',
    date: 'bir yıl önce',
    quote:
      'Aracımın farlarına PPF kaplama ve ön kapı camlarına amerikan menşeli film yaptırdım. Kısa sürede titiz bir işçilikle hemen teslim ettiler.',
    topic: 'Far PPF',
    path: 'arac',
  },
  {
    author: 'mahsun p.',
    date: 'bir yıl önce',
    quote:
      'Şirket arabamızı farklı renkte komple kaplama yaptırdık. İşçilikleri 10 numara.',
    topic: 'Renk değişimi',
    path: 'arac',
  },
];

// ---------------------------------------------------------------------------
// SSS
// ---------------------------------------------------------------------------

export interface Faq {
  q: string;
  a: string;
  path: ServicePath;
}

export const faqs: Faq[] = [
  {
    path: 'arac',
    q: 'Cam filmi fiyatı neye göre değişir?',
    a: 'Aracın cam sayısı ve cam ölçüleri, seçilen filmin tipi ve tonu, camlarda sökülmesi gereken eski film olup olmadığı fiyatı belirleyen ana başlıklar. Bu yüzden tek bir liste fiyatı vermek doğru olmuyor; aracınızın bilgisiyle net fiyat isteyin.',
  },
  {
    path: 'arac',
    q: 'Film tonunu nasıl seçerim?',
    a: 'Ton, camdan ne kadar ışık geçeceğini belirler. Koyu ton gündüz mahremiyeti ve daha az parlama demek; ancak gece görüşünüzü de o oranda azaltır. Karar verirken günün hangi saatlerinde araç kullandığınızı düşünün ve tonu uygulama öncesi camda görün.',
  },
  {
    path: 'arac',
    q: 'Cam filmi yasal mı? Ön cama film olur mu?',
    a: 'Cam filmi Türkiye’de Karayolları Trafik Yönetmeliği kapsamında düzenleniyor. Genel çerçeve şu: ön cama film uygulaması kabul edilmiyor, yan ve arka camlarda ise sürücünün görüşünü engellemeyen uygulamalara izin veriliyor. Kurallar ve muayene yorumu değişebildiği için aracınıza uygulanacak tonu işlem öncesi Shellson ile netleştirin. Buradaki bilgi genel bilgilendirmedir, hukuki görüş değildir.',
  },
  {
    path: 'arac',
    q: 'PPF ile cam filmi aynı şey mi?',
    a: 'Hayır, iki farklı ürün. Cam filmi cama uygulanır; ısı, parlama ve UV ile ilgilenir. PPF ise boyalı yüzeye uygulanan şeffaf koruma filmidir; taş çiziği ve sürtünmeye karşı boyayı korur. İkisi birlikte de yaptırılabilir.',
  },
  {
    path: 'arac',
    q: 'Uygulama ne kadar sürer?',
    a: 'İşin kapsamına göre değişiyor. Google yorumlarında bir müşteri cam filmi uygulamasının yaklaşık 1 saat sürdüğünü, bir diğeri sıfır aracın PPF kaplamasının 2 günde teslim edildiğini yazmış. Sizin aracınız için kesin süreyi randevu alırken sorun.',
  },
  {
    path: 'arac',
    q: 'Kaplama boyaya zarar verir mi?',
    a: 'Kaplama, orijinal boyanın üzerine uygulanır ve boyayı dış etkenlerden ayırır. Belirleyici olan mevcut boyanın durumu ve sökümün doğru yapılması. Aracınızda önceden yapılmış boya işlemi varsa uygulama öncesi mutlaka söyleyin — bu, hem sonucu hem söküm davranışını etkiler.',
  },
  {
    path: 'arac',
    q: 'Garanti veriliyor mu?',
    a: 'Shellson kendi Instagram profilinde "10 Yıl Garanti ile Cam Filmi & PPF Kaplama" ifadesini kullanıyor. Garantinin tam kapsamını, hangi ürünlerde geçerli olduğunu ve koşullarını uygulama öncesi işletmeden yazılı olarak teyit etmenizi öneririz. Bu konsept sayfa garanti taahhüdü vermez.',
  },
  {
    path: 'bina',
    q: 'Bina cam filmi ne işe yarar?',
    a: 'Cam, binanın en zayıf yalıtım noktası. Cama uygulanan film güneşten gelen ısının bir kısmını dışarıda tutar, parlamayı azaltır, mobilya ve zeminin solmasına yol açan UV’yi süzer. Tercihe göre dışarıdan içerinin görünmesini zorlaştıran veya cam kırıldığında parçaları bir arada tutan seçenekler de var.',
  },
  {
    path: 'bina',
    q: 'Evim veya ofisim daha karanlık olur mu?',
    a: 'Seçtiğiniz filme bağlı. Filmler, geçirdikleri ışık miktarına göre farklı seviyelerde oluyor; neredeyse fark edilmeyen şeffaf seçeneklerden belirgin şekilde koyultan seçeneklere kadar. Odanın hangi yöne baktığını ve gün içinde nasıl kullandığınızı keşifte konuşun.',
  },
  {
    path: 'bina',
    q: 'Keşif için hangi bilgiler gerekir?',
    a: 'Mekân türü, ilçe, yaklaşık cam adedi veya metrekare, camların hangi yöne baktığı ve kaçıncı katta olduğu. Bu bilgilerle ön değerlendirme yapılabiliyor. Camların fotoğrafını WhatsApp’tan göndermeniz süreci belirgin şekilde hızlandırır.',
  },
  {
    path: 'bina',
    q: 'Fiyat neye göre değişir?',
    a: 'Toplam cam alanı, cam sayısı, seçilen film tipi ve uygulamanın yapılacağı yere erişim. Yüksek katta veya dış cepheden çalışılması gereken işler farklı planlanıyor. Net fiyat keşif sonrası veriliyor.',
  },
  {
    path: 'bina',
    q: 'Uygulama sırasında alanı boşaltmalı mıyım?',
    a: 'Camların önündeki eşyaların çekilmesi ve pencere önünün boşaltılması gerekiyor; mekânın tamamının boşaltılması genelde gerekmiyor. Ne kadar alan gerekeceği keşifte netleşir.',
  },
];

// ---------------------------------------------------------------------------
// WhatsApp mesaj kurgusu
// ---------------------------------------------------------------------------

export interface VehicleRequest {
  brand: string;
  model: string;
  year: string;
  service: string;
  area?: string;
  phone: string;
  note?: string;
}

export interface BuildingRequest {
  space: string;
  location: string;
  need: string;
  size?: string;
  phone: string;
  note?: string;
}

/**
 * 10 haneli numarayı okunur hâle getirir: 5321112233 → 0532 111 22 33
 * Mesajı alan kişinin numarayı gözle okuyabilmesi için.
 */
export function formatPhone(digits: string): string {
  if (!/^\d{10}$/.test(digits)) return digits;
  return `0${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
}

/** Araç fiyat talebi mesajı. Boş alanlar cümleye hiç girmez. */
export function vehicleMessage(r: VehicleRequest): string {
  const car = [r.year && `${r.year} model`, r.brand, r.model].filter(Boolean).join(' ').trim();
  const parts: string[] = [
    `Merhaba ${business.name}, ${car} aracım için ${r.service.toLocaleLowerCase('tr-TR')} hakkında fiyat ve süre bilgisi almak istiyorum.`,
  ];
  if (r.area?.trim()) parts.push(`Uygulanacak bölge: ${r.area.trim()}.`);
  parts.push(`Telefon: ${r.phone}.`);
  if (r.note?.trim()) parts.push(`Not: ${r.note.trim()}`);
  return parts.join(' ');
}

/** Bina keşif talebi mesajı. */
export function buildingMessage(r: BuildingRequest): string {
  const place = r.space.toLocaleLowerCase('tr-TR');
  const parts: string[] = [
    `Merhaba ${business.name}, ${r.location.trim()} konumundaki ${place} için ${r.need.toLocaleLowerCase('tr-TR')} konusunda keşif ve fiyat bilgisi almak istiyorum.`,
  ];
  if (r.size?.trim()) parts.push(`Yaklaşık ölçü: ${r.size.trim()}.`);
  parts.push(`Telefon: ${r.phone}.`);
  if (r.note?.trim()) parts.push(`Not: ${r.note.trim()}`);
  return parts.join(' ');
}

/** Hazır mesajla WhatsApp bağlantısı üretir. */
export function whatsappUrl(message: string): string {
  return `https://wa.me/${business.whatsapp.number}?text=${encodeURIComponent(message)}`;
}
