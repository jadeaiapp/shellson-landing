/**
 * ─────────────────────────────────────────────────────────────────────────────
 * MERKEZİ İŞLETME İÇERİĞİ — Shellson konsept landing page
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Sitedeki HER işletme bilgisi bu dosyadan gelir. Başka hiçbir yerde telefon,
 * adres, puan, saat veya hizmet adı sabit yazılmaz.
 *
 * DOĞRULAMA KURALI
 * Her alanın bir `v` (verification) etiketi vardır:
 *   'verified'   → bağımsız olarak doğrulandı, sitede gösterilebilir
 *   'unverified' → doğrulanamadı, sitede GÖSTERİLMEZ (bileşenler filtreler)
 *   'claim'      → işletmenin kendi beyanı, kaynak belirtilmeden gösterilmez
 *
 * Kaynaklar ve çelişkiler için: /RESEARCH.md
 * Araştırma tarihi: 2026-08-03
 */

export type Verification = 'verified' | 'unverified' | 'claim';

export interface Fact<T> {
  value: T;
  v: Verification;
  source?: string;
}

const fact = <T,>(value: T, v: Verification, source?: string): Fact<T> => ({ value, v, source });

/** Sitede yalnızca doğrulanmış değerleri göstermek için yardımcı. */
export function shown<T>(f: Fact<T>): T | null {
  return f.v === 'verified' ? f.value : null;
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  DEMO MODU                                                                 */
/* ══════════════════════════════════════════════════════════════════════════ */

export const demoMode = {
  /** true iken: noindex, konsept şeridi görünür, LocalBusiness JSON-LD YOK. */
  enabled: true,
  ribbon: 'Bağımsız konsept çalışma — Shellson’ın resmî web sitesi değildir.',
  footerNote:
    'Bu sayfa Shellson için hazırlanmış bağımsız bir konsept çalışmadır. Shellson’ın resmî web sitesi değildir.',
  formNote:
    'Bu formlar hiçbir sunucuya veri göndermez. Girdikleriniz yalnızca tarayıcınızda, WhatsApp’ta açılacak hazır mesaja dönüştürülür.',
} as const;

/* ══════════════════════════════════════════════════════════════════════════ */
/*  KİMLİK & İLETİŞİM                                                         */
/* ══════════════════════════════════════════════════════════════════════════ */

export const RESEARCH_DATE = '2026-08-03';
export const RESEARCH_DATE_TR = '3 Ağustos 2026';

export const identity = {
  brand: 'Shellson',
  /** Google İşletme Profilinde görünen tam ad. */
  fullName: fact(
    'Shellson Profesyonel Araç Kaplama ve Cam Filmi | PPF Kaplama ve Koruma | Kağıthane | Bina Cam Filmi',
    'verified',
    'Google İşletme Profili',
  ),
  category: fact('Pencere Film Kaplama Hizmeti', 'verified', 'Google İşletme Profili'),
  district: fact('Kağıthane, İstanbul', 'verified', 'Google İşletme Profili'),
  /** Logo/kurumsal renk bulunamadı — palet sıfırdan üretildi. Bkz. RESEARCH.md */
  logo: fact(null, 'unverified'),
};

export const contact = {
  phoneDisplay: fact('0555 044 10 82', 'verified', 'Google İşletme Profili'),
  /** tel: ve wa.me için E.164 */
  phoneE164: fact('+905550441082', 'verified', 'Google İşletme Profili'),
  whatsapp: fact('905550441082', 'verified', 'Google İşletme Profili (aynı numara)'),
  address: fact('Harmantepe, Okul Cd. No:95, 34410 Kağıthane / İstanbul', 'verified', 'Google İşletme Profili'),
  plusCode: fact('3XHQ+G5 Kağıthane, İstanbul', 'verified', 'Google İşletme Profili'),
  mapsUrl: fact(
    'https://www.google.com/maps/search/?api=1&query=Shellson+Harmantepe+Okul+Cd.+No%3A95+34410+Ka%C4%9F%C4%B1thane+%C4%B0stanbul',
    'verified',
    'Google Maps arama bağlantısı (adres doğrulandı)',
  ),
  mapsEmbed: fact(
    'https://maps.google.com/maps?q=Harmantepe%2C%20Okul%20Cd.%20No%3A95%2C%2034410%20Ka%C4%9F%C4%B1thane%2F%C4%B0stanbul&t=&z=16&ie=UTF8&iwloc=&output=embed',
    'verified',
    'Adres tabanlı gömülü harita',
  ),
  /** Yalnızca kapanış saati doğrulandı. Haftalık program doğrulanamadı → gösterilmiyor. */
  closingTime: fact('19:00', 'verified', 'Google İşletme Profili'),
  weeklyHours: fact(null, 'unverified'),
  email: fact(null, 'unverified'),
};

export const social = [
  {
    key: 'instagram',
    label: 'Instagram',
    handle: '@shellsonwindowfilm',
    url: 'https://www.instagram.com/shellsonwindowfilm/',
    v: 'verified' as Verification,
  },
  {
    key: 'facebook',
    label: 'Facebook',
    handle: 'Shellson Window Film’s',
    url: 'https://www.facebook.com/SHELLSONN/',
    v: 'verified' as Verification,
  },
  {
    key: 'youtube',
    label: 'YouTube',
    handle: '@ShellsonWindowFilm',
    url: 'https://www.youtube.com/@ShellsonWindowFilm',
    v: 'verified' as Verification,
  },
];

/**
 * Google profilindeki iki web sitesi bağlantısı da çalışmıyor (2026-08-03).
 * Sitede bağlantı olarak KULLANILMAZ; yalnızca RESEARCH.md'de belgelenir.
 */
export const brokenDomains = [
  { domain: 'otocamfilmcisi.com', status: 'DNS çözülmüyor — alan adı yanıt vermiyor' },
  { domain: 'shellsonwindowfilm.com', status: 'Park/yakalama sayfası (*.catched.com sertifikası, 2023’te süresi dolmuş)' },
];

/* ══════════════════════════════════════════════════════════════════════════ */
/*  GOOGLE İTİBARI                                                            */
/* ══════════════════════════════════════════════════════════════════════════ */

export const reputation = {
  rating: fact(4.8, 'verified', 'Google İşletme Profili'),
  reviewCount: fact(243, 'verified', 'Google İşletme Profili'),
  /** Puan/yorum sayısı değişkendir — gösterildiği yerde bu tarih belirtilir. */
  asOf: RESEARCH_DATE_TR,
  ownerReplies: fact(true, 'verified', 'Google yorumlarında işletme sahibi yanıtları görüldü'),
};

/* ══════════════════════════════════════════════════════════════════════════ */
/*  HİZMET YOLLARI                                                            */
/* ══════════════════════════════════════════════════════════════════════════ */

export type PathKey = 'arac' | 'yapi';

export interface ServiceItem {
  id: string;
  title: string;
  /** Kısa fayda açıklaması */
  benefit: string;
  /** Kullanım alanı / bağlam */
  context: string;
  art: string;
  v: Verification;
  source: string;
}

/**
 * OTOMOTİV — hepsi doğrulandı (işletme adı + gerçek Google yorumları).
 */
export const autoServices: ServiceItem[] = [
  {
    id: 'oto-cam-filmi',
    title: 'Oto cam filmi',
    benefit: 'Kabine düşen güneş ve parlama azalır, camın arkası gün boyu daha serin kalır.',
    context: 'Binek araç, SUV, ticari araç',
    art: 'tint',
    v: 'verified',
    source: 'İşletme adı + çok sayıda Google yorumu',
  },
  {
    id: 'ppf',
    title: 'PPF boya koruma',
    benefit: 'Şeffaf koruma filmi boyayı taş çiziği ve sürtünmeye karşı örter.',
    context: 'Kaput, ön tampon, far, kapı kenarları',
    art: 'ppf',
    v: 'verified',
    source: 'İşletme adı + Google yorumları (far PPF, TPU PPF uygulamaları)',
  },
  {
    id: 'kaplama',
    title: 'Araç kaplama',
    benefit: 'Aracın yüzeyi sökülebilir film ile yeni bir dokuya kavuşur.',
    context: 'Komple gövde ya da parça bazlı',
    art: 'wrap',
    v: 'verified',
    source: 'İşletme adı + Google yorumu (mat kaplama uygulaması)',
  },
  {
    id: 'mat-kaplama',
    title: 'Mat kaplama & renk değişimi',
    benefit: 'Boyaya dokunmadan yüzey rengini ve parlaklığını değiştirir.',
    context: 'Gövde, tavan, ayna kapakları, detay parçalar',
    art: 'color',
    v: 'verified',
    source: 'Google yorumu (Chery aracına mat kaplama + cam filmi)',
  },
];

/**
 * MİMARİ — işletme adında "Bina Cam Filmi" açıkça geçiyor (doğrulandı).
 * Alt kırılımlar (ısı, UV, mahremiyet, güvenlik) Shellson için ayrı ayrı
 * DOĞRULANMADI. Bu yüzden "sattığımız ürünler" gibi değil, kullanıcının
 * ihtiyacını tarif ettiği "keşif talebi başlıkları" olarak sunulur.
 */
export const archService: ServiceItem = {
  id: 'bina-cam-filmi',
  title: 'Bina cam filmi',
  benefit: 'Camdan gelen ısı, parlama ve dışarıdan görünürlük kontrol altına alınır.',
  context: 'Ev, ofis, mağaza, iş merkezi',
  art: 'facade',
  v: 'verified',
  source: 'Google İşletme Profilindeki işletme adı',
};

export interface ArchNeed {
  id: string;
  title: string;
  desc: string;
  art: string;
}

/** Kullanıcının çözmek istediği problem — Shillson hizmet iddiası değil. */
export const archNeeds: ArchNeed[] = [
  {
    id: 'isi',
    title: 'İçerisi çok ısınıyor',
    desc: 'Güneye ya da batıya bakan camlar öğleden sonra mekânı fırına çeviriyor.',
    art: 'heat',
  },
  {
    id: 'parlama',
    title: 'Ekranda parlama var',
    desc: 'Işık monitöre ve masaya vuruyor, perde kapatmak tek çare oluyor.',
    art: 'glare',
  },
  {
    id: 'mahremiyet',
    title: 'Dışarıdan içerisi görünüyor',
    desc: 'Zemin kat, cadde cephesi ya da karşı bina rahatsız edici.',
    art: 'privacy',
  },
  {
    id: 'uv',
    title: 'Eşyalar soluyor',
    desc: 'Parke, mobilya, kumaş ve vitrin ürünleri güneşten rengini kaybediyor.',
    art: 'uv',
  },
];

export const paths: Record<
  PathKey,
  {
    key: PathKey;
    label: string;
    shortLabel: string;
    eyebrow: string;
    headline: string;
    lede: string;
    cta: string;
    formTitle: string;
    formLede: string;
  }
> = {
  arac: {
    key: 'arac',
    label: 'Aracım için',
    shortLabel: 'Araç',
    eyebrow: 'Katman / Araç',
    headline: 'Camın arkası serinlesin, boya örtülü kalsın',
    lede: 'Oto cam filmi, PPF boya koruma ve araç kaplama. Aracınızın bilgilerini bırakın, Shellson size fiyat ve süre yazsın.',
    cta: 'Aracım için fiyat al',
    formTitle: 'Araç için fiyat talebi',
    formLede: 'Aşağıyı doldurun, WhatsApp’ta hazır mesaj açılsın.',
  },
  yapi: {
    key: 'yapi',
    label: 'Evim & iş yerim için',
    shortLabel: 'Bina',
    eyebrow: 'Katman / Yapı',
    headline: 'Aynı cam, kontrol altındaki ışık',
    lede: 'Ev, ofis ve mağaza camları için bina cam filmi. Mekânı tarif edin, Shellson keşif için size dönsün.',
    cta: 'Keşif iste',
    formTitle: 'Bina için keşif talebi',
    formLede: 'Mekânı kısaca tarif edin, WhatsApp’ta hazır mesaj açılsın.',
  },
};

/* ══════════════════════════════════════════════════════════════════════════ */
/*  FORM SEÇENEKLERİ                                                          */
/* ══════════════════════════════════════════════════════════════════════════ */

export const autoServiceOptions = autoServices.map((s) => s.title);

export const autoAreaOptions = [
  'Ön yan camlar',
  'Arka camlar',
  'Komple cam',
  'Kaput',
  'Ön tampon',
  'Farlar',
  'Komple gövde',
  'Henüz emin değilim',
];

export const placeTypeOptions = ['Ev', 'Ofis', 'Mağaza', 'Plaza / iş merkezi', 'Diğer'];

export const archNeedOptions = [
  'Isı ve güneş kontrolü',
  'Parlama azaltma',
  'Dışarıdan görünmeme (mahremiyet)',
  'UV / solma koruması',
  'Hangisi uygun, birlikte karar verelim',
];

export const sizeOptions = [
  '1–5 cam',
  '6–15 cam',
  '16–40 cam',
  '40+ cam',
  'Metrekare olarak yazacağım',
];

/* ══════════════════════════════════════════════════════════════════════════ */
/*  GERÇEK GOOGLE YORUMLARI                                                   */
/* ══════════════════════════════════════════════════════════════════════════ */

/**
 * KURALLAR (uygulandı):
 *  • Metinler Google İşletme Profilinden alındı, anlamı değiştirilmedi.
 *  • Soyadları kısaltıldı.
 *  • Yıldız sayısı GÖSTERİLMİYOR: tek tek yorum puanları kaynakta görünmüyordu,
 *    tahmin etmek yerine hiç göstermiyoruz.
 *  • Tarihler Google’da göründüğü göreli biçimde bırakıldı.
 *  • Sorun yaşanıp telafi teklif edilen yorum referans olarak KULLANILMADI.
 */
export interface Review {
  name: string;
  when: string;
  text: string;
  path: PathKey | 'both';
}

export const reviews: Review[] = [
  {
    name: 'Erdem C.',
    when: 'bir ay önce',
    text: 'Gittiğimizde güler yüzle karşılandık, ürün çeşitlerini ve özelliklerini deneyerek göstererek anlatarak seçmemize yardımcı oldular.',
    path: 'both',
  },
  {
    name: 'Taha Yağız O.',
    when: 'bir yıl önce',
    text: 'Aracımın farlarına PPF kaplama ve ön kapı camlarına Amerikan menşeli film yaptırdım. Kısa sürede titiz bir işçilikle hemen teslim ettiler.',
    path: 'arac',
  },
  {
    name: 'Furkan K.',
    when: '10 ay önce',
    text: 'Chery aracımıza mat kaplama ve cam filmi uygulaması yaptırdık. Çok yakıştı, tüm süreç boyunca çok ilgilendiler.',
    path: 'arac',
  },
  {
    name: 'Cevdet K.',
    when: '2 yıl önce',
    text: 'PPF yaptırmak istiyordum, çok yer gezdim. Beni çalışma alanına alıp nasıl yaptıklarını gösterdiler, işte o zaman içim rahatladı.',
    path: 'arac',
  },
  {
    name: 'Tural K.',
    when: '4 ay önce',
    text: 'Aracıma cam film uygulaması yaptırdım, aldığım hizmetten oldukça memnun kaldım. Tavsiye ederim.',
    path: 'arac',
  },
  {
    name: 'Burak İhsan Ç.',
    when: '5 yıl önce',
    text: 'İşini acele etmeden, detaylı şekilde yapıyor ve tam müşteri memnuniyeti sağlamadan dükkândan yollamıyor.',
    path: 'both',
  },
];

export const reviewsNote =
  'Yorumlar Google İşletme Profilinden alınmıştır, kısaltılmıştır ve anlamı değiştirilmemiştir. Tek tek yıldız puanları kaynakta görünmediği için gösterilmiyor.';

/* ══════════════════════════════════════════════════════════════════════════ */
/*  NEDEN SHELLSON — yalnızca doğrulanmış maddeler                            */
/* ══════════════════════════════════════════════════════════════════════════ */

export interface TrustPoint {
  id: string;
  stat?: string;
  title: string;
  desc: string;
  footnote?: string;
}

export const trustPoints: TrustPoint[] = [
  {
    id: 'rating',
    stat: '4,8',
    title: `Google puanı, ${reputation.reviewCount.value} değerlendirme`,
    desc: 'Kağıthane’deki dükkâna gelen müşterilerin bıraktığı açık değerlendirmeler.',
    footnote: `${RESEARCH_DATE_TR} itibarıyla`,
  },
  {
    id: 'location',
    title: 'Kağıthane’de fiziki dükkân',
    desc: 'Harmantepe, Okul Caddesi. Aracınızı bırakabileceğiniz, uygulamayı görebileceğiniz gerçek bir adres.',
  },
  {
    id: 'dual',
    title: 'Hem araç hem bina',
    desc: 'Oto cam filmi, PPF ve kaplamanın yanında bina cam filmi de aynı ekipten.',
  },
  {
    id: 'explains',
    title: 'Seçenekleri göstererek anlatıyor',
    desc: 'Yorumlarda tekrar eden bir davranış: ürün çeşitleri denetilerek, çalışma alanı gösterilerek anlatılıyor.',
    footnote: 'Google yorumlarından',
  },
  {
    id: 'replies',
    title: 'Yorumlara işletme sahibi yanıt veriyor',
    desc: 'Olumsuz geri bildirimlerde dahi telafi teklifiyle dönüş yapılıyor.',
    footnote: 'Google yorumlarından',
  },
];

/* ══════════════════════════════════════════════════════════════════════════ */
/*  SSS                                                                       */
/* ══════════════════════════════════════════════════════════════════════════ */

export interface FaqItem {
  q: string;
  a: string;
}

export const faq: Record<PathKey, FaqItem[]> = {
  arac: [
    {
      q: 'Cam filmi fiyatı neye göre değişir?',
      a: 'Aracın cam sayısı ve ölçüsü, seçilen filmin türü ve kaç camda uygulama yapılacağı fiyatı belirler. Bu sayfada fiyat yazmıyoruz; aracınızın bilgilerini gönderdiğinizde Shellson güncel fiyatı doğrudan iletir.',
    },
    {
      q: 'Film tonunu nasıl seçerim?',
      a: 'Ton, ne kadar ışık geçirdiğiyle ölçülür. Karar vermeden önce farklı tonları araç üzerinde görmek en sağlıklısı; yorumlarda müşteriler seçenekleri dükkânda deneyerek seçtiklerini anlatıyor. Ön camlar için mevzuat gereklilikleri olduğundan uygulamadan önce mutlaka Shellson’a danışın.',
    },
    {
      q: 'PPF ile cam filmi aynı şey mi?',
      a: 'Hayır. Cam filmi cama uygulanır ve ışığı kontrol eder. PPF ise boyalı yüzeye uygulanan şeffaf koruma filmidir; amacı boyayı çizik ve çarpmalardan örtmektir. Shellson ikisini de yapıyor.',
    },
    {
      q: 'Uygulama ne kadar sürer?',
      a: 'Süre; kapsamın, araç modelinin ve seçilen filmin türüne göre değişir. Kesin süreyi araç bilgilerinizi gönderdiğinizde Shellson yazacaktır.',
    },
    {
      q: 'Kaplama boyaya zarar verir mi?',
      a: 'Araç kaplama filmi sökülebilir olacak şekilde uygulanır. Ancak sonucu boyanın mevcut durumu da etkiler; bu yüzden uygulamadan önce aracın yüzeyi yerinde değerlendirilir.',
    },
  ],
  yapi: [
    {
      q: 'Bina cam filmi ne işe yarar?',
      a: 'Cama uygulanan film, içeri giren güneş ışığının bir kısmını dışarıda tutar. Böylece ısı, parlama ve dışarıdan görünürlük camı değiştirmeden kontrol altına alınabilir.',
    },
    {
      q: 'Ev veya ofis daha karanlık olur mu?',
      a: 'Ne kadar ışık geçireceği seçilen filmin tonuna bağlıdır. Isıyı kesip aydınlığı büyük ölçüde koruyan seçenekler de, tamamen mahremiyet için tercih edilen koyu seçenekler de vardır. Bu yüzden karar keşifte, mekânı görerek veriliyor.',
    },
    {
      q: 'Keşif için hangi bilgiler gerekiyor?',
      a: 'Mekân türü, konum, kabaca cam sayısı veya alan, ve çözmek istediğiniz sorun. Camların fotoğrafını WhatsApp’tan göndermeniz süreci belirgin şekilde hızlandırır.',
    },
    {
      q: 'Fiyat neye göre değişir?',
      a: 'Toplam cam alanı, camların ulaşılabilirliği (kaçıncı kat, sabit cephe mi) ve seçilen film türü belirleyicidir. Bu sayfada fiyat yazmıyoruz; keşif talebinizin ardından Shellson doğrudan bilgi verir.',
    },
    {
      q: 'Uygulama sırasında mekânı boşaltmam gerekir mi?',
      a: 'Genellikle camların önündeki alanın açılması yeterlidir. Kesin gereklilik camların konumuna ve mekânın kullanımına göre değişir; keşif sırasında birlikte planlanır.',
    },
  ],
};

/* ══════════════════════════════════════════════════════════════════════════ */
/*  GALERİ — tamamı özgün, kod ile üretilmiş konsept görseller                */
/* ══════════════════════════════════════════════════════════════════════════ */

/**
 * Shellson’ın gerçek uygulama fotoğrafları izin alınmadan kullanılamaz.
 * Stok fotoğraf da başka bir işletmenin işini Shellson’ın işi gibi
 * gösterme riskini taşır. Bu yüzden galerideki her görsel bu proje için
 * sıfırdan çizilmiş özgün SVG’dir ve arayüzde "konsept görsel" olarak
 * işaretlenir.
 */
export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  path: PathKey;
  art: string;
  ratio: 'wide' | 'tall' | 'square';
}

export const gallery: GalleryItem[] = [
  { id: 'g1', title: 'Yan cam filmi', caption: 'Ön kapı camına uygulanmış film — camın arkası gölgede kalır.', path: 'arac', art: 'sedan', ratio: 'wide' },
  { id: 'g2', title: 'Kaput PPF', caption: 'Şeffaf koruma filminin kaput üzerindeki kenar çizgisi.', path: 'arac', art: 'hood', ratio: 'square' },
  { id: 'g3', title: 'Far koruma', caption: 'Far yüzeyine uygulanan şeffaf film.', path: 'arac', art: 'headlight', ratio: 'square' },
  { id: 'g4', title: 'Mat kaplama', caption: 'Parlak boyadan mat yüzeye geçiş.', path: 'arac', art: 'matte', ratio: 'wide' },
  { id: 'g5', title: 'Ofis cephesi', caption: 'Cam cepheye uygulanmış ısı kontrol filmi.', path: 'yapi', art: 'office', ratio: 'tall' },
  { id: 'g6', title: 'Ev salonu', caption: 'Öğleden sonra güneşi alan salon camı.', path: 'yapi', art: 'living', ratio: 'wide' },
  { id: 'g7', title: 'Mağaza vitrini', caption: 'Vitrin camında parlama ve solma kontrolü.', path: 'yapi', art: 'store', ratio: 'square' },
  { id: 'g8', title: 'Zemin kat mahremiyet', caption: 'Cadde cephesindeki camda dışarıdan görünürlüğün azaltılması.', path: 'yapi', art: 'privacy', ratio: 'wide' },
];

export const galleryNote =
  'Galerideki tüm görseller bu konsept çalışma için çizilmiş özgün illüstrasyonlardır. Shellson’ın gerçek uygulama fotoğrafları değildir.';

/* ══════════════════════════════════════════════════════════════════════════ */
/*  BİLİNÇLİ OLARAK SİTEYE EKLENMEYENLER                                      */
/* ══════════════════════════════════════════════════════════════════════════ */

/** Sadece belgeleme amaçlı — hiçbiri arayüzde gösterilmez. Bkz. RESEARCH.md */
export const excludedClaims = [
  'Garanti süresi (Instagram biyografisinde "10 Yıl Garanti" yazıyor; işletmeden yazılı teyit alınmadan yayınlanmaz)',
  'Kaç yıldır çalıştığı ("13 yıl deneyim" ifadesi yalnızca artık işletmenin elinde olmayan eski sitenin arşiv içeriğinde geçiyor)',
  'Film markası / bayilik (yorumlarda 3M geçiyor, ancak bu müşteri beyanı; bayilik doğrulanmadı)',
  'Isı veya UV engelleme yüzdeleri (hiçbir ölçüm doğrulanmadı)',
  'Fiyat ve fiyat aralıkları',
  'İkinci şube (arşiv içerikte Acıbadem şubesi geçiyor, güncelliği doğrulanamadı)',
  'Haftalık çalışma programı (yalnızca kapanış saati doğrulandı)',
];
