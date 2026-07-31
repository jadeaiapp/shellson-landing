# Shellson — konsept landing page

> **Bu, Shellson’ın resmî web sitesi değildir.** Kamuya açık kaynaklardan derlenen bilgilerle hazırlanmış, işletmeye sunulmak üzere yapılmış bağımsız bir konsept çalışmadır.

**Canlı demo:** https://jadeaiapp.github.io/shellson-landing/

Shellson (Kağıthane, İstanbul) hem araç cam filmi / PPF / kaplama hem de bina cam filmi hizmeti veriyor. Bu sayfanın tek işi, Google Haritalar veya Instagram’dan gelen ziyaretçiyi **iki müşteri yoluna ayırmak** ve eksiksiz bir talebi WhatsApp’a taşımak.

```
Trafik → yol seçimi (araç / bina) → ilgili hizmetler ve güven unsurları → uygun form → hazır WhatsApp mesajı
```

---

## Neden bu proje işletme için değerli

Araştırma sırasında çıkan en somut bulgu: **Google İşletme Profilindeki iki web sitesi bağlantısının ikisi de çalışmıyor.**

| Domain | Durum (31.07.2026) |
|---|---|
| `shellsonwindowfilm.com` | 302 → `catched.com` (domain yakalama servisi), TLS sertifikası süresi dolmuş |
| `otocamfilmcisi.com` | DNS çözülmüyor (SERVFAIL) — tamamen ölü |

Instagram biyografisindeki bağlantı da aynı ölü domaine gidiyor. Yani profilden siteye tıklayan her ziyaretçi kayboluyor. Ayrıntılar: [RESEARCH.md §3](RESEARCH.md).

---

## Tasarım yönü

Renk ekseni cama bakmaktan geliyor: **float cam kenardan bakıldığında yeşildir.** Bu yüzden koyu tonlar nötr antrasit değil yeşil-siyah (`#06201B`), marka rengi de bir yeşil (`#0F6B58`). Kategoride yaygın olan kırmızı/mavi/siyah kurgusundan bilinçli olarak uzak durulmuştur.

Tek bir “cesur” öge var: **spektrum kenarı.** Filmin kenarındaki ışık kırılmasını temsil eden 2px’lik gradyan çizgi (cyan → mor → magenta) yalnızca üç yerde kullanılır — film panelinin kesim çizgisi, eyebrow kuralı ve seçili yol kartının üst kenarı. Dolgu olarak asla kullanılmaz.

İki müşteri yolu **renk değil yüzey sıcaklığı** ile ayrışır: araç tarafı koyu cam yeşili, bina tarafı ılık kum tonu. Böylece iki dünya aynı marka altında birbirine karışmadan durur.

**Tipografi:** Archivo (başlık, 700/800) + Karla (metin, 400/600). Veri/etiketler için sistem monospace. Üçüncü bir font indirilmez.

**İmza bileşen — film paneli:** Aynı fotoğraf karesi üzerinde filmin yüzeye serilmesini gösteren sürüklenebilir panel. Hero’da tek etkileşim (filmi ser), ton laboratuvarında tam kontrol (ton + sahne değişimi). Bu bir **görsel benzetimdir** ve sayfada öyle etiketlenmiştir — hiçbir ısı/UV yüzdesi gösterilmez.

---

## Teknoloji

Vite + TypeScript + elle yazılmış CSS. Çerçeve yok, UI kütüphanesi yok, çalışma zamanı bağımlılığı yok.

| Karar | Gerekçe |
|---|---|
| Framework yok | JS bundle 48 KB (gzip 18 KB). Mobilde hızlı açılıyor. |
| Fontlar depoda | Google Fonts’a istek gitmiyor. Vite değişken font dosyalarını tekilleştiriyor: 4 ağırlık, 4 dosya, ~104 KB. |
| Görseller depoda | Hiçbir görsel dış siteden hotlink edilmiyor. 480/960/1600 WebP + JPEG yedeği + LQIP ön izleme. |
| `<dialog>` lightbox | Odak tuzağı ve Esc davranışı tarayıcıdan geliyor. |
| Tek içerik kaynağı | `src/data/business.ts` — bkz. aşağısı. |

### Kurulum

```bash
npm install
npm run dev          # geliştirme
npm run verify       # tip kontrolü + build + tarayıcı testleri
```

### Komutlar

| Komut | Ne yapar |
|---|---|
| `npm run dev` | Geliştirme sunucusu (http://localhost:5173) |
| `npm run build` | Üretim build’i → `dist/` |
| `npm run typecheck` | TypeScript kontrolü |
| `npm run check` | Chromium’da 86 kontrol + ekran görüntüleri |
| `npm run verify` | Üçünü sırayla |
| `npm run images` | Görselleri yeniden indirip optimize eder |
| `npm run fonts` | Font dosyalarını yeniler |

---

## İçerik nasıl güncellenir

**Her şey `src/data/business.ts` içinde.** Sayfada görünen tek bir işletme bilgisi bile başka yerde tanımlı değil.

```ts
business.phone.display     // telefon
business.whatsapp.number   // WhatsApp (ülke kodlu, işaretsiz)
business.rating.count      // yorum sayısı
VERIFIED_ON                // bilgilerin doğrulandığı tarih
business.hours.detail      // null → arayüz saat tablosunu gizler
autoServices[]             // otomotiv hizmetleri
buildingSpaces[]           // mimari mekân türleri
reviews[]                  // müşteri yorumları
faqs[]                     // SSS
vehicleMessage() / buildingMessage()  // WhatsApp metinleri
```

**Kural:** Doğrulanmamış bir alan `null` bırakılır ve arayüz o bölümü **otomatik gizler.** Örneğin `hours.detail` bugün `null`; işletmeden tam çalışma saatleri alındığında doldurulduğu an tablo görünür hâle gelir.

Görselleri değiştirmek için `tools/build-images.mjs` içindeki `SOURCES` listesini düzenleyip `npm run images` çalıştırın.

---

## Demo modu

Bu depo **demo modunda** yayınlanmıştır:

- `noindex, nofollow, noarchive, nosnippet, noimageindex` meta etiketleri
- `robots.txt` → `Disallow: /`
- **LocalBusiness / Organization JSON-LD schema yok** — işletme adına yapılandırılmış veri yayınlanmıyor
- Sayfanın en üstünde her ekranda görünen konsept şeridi: *“Bağımsız konsept çalışma — Shellson’ın resmî web sitesi değildir.”*
- Footer’da aynı açıklama, ayrıca alt bilgide resmî bağ olmadığı notu
- `<title>` ve `og:title` “Konsept çalışma” ile başlar
- Google profilindeki iki bozuk domaine **hiçbir bağlantı verilmez**

### Stok görsel notu

Sitedeki **tüm** fotoğraflar [Pexels](https://www.pexels.com/license/) lisanslı stok görsellerdir; Shellson’ın kendi uygulamaları **değildir**. Her görsel kartında ve lightbox’ta **“Konsept görsel”** etiketi taşır ve galeri başlığında bu açıkça yazılıdır.

Shellson’ın Google/Instagram’daki fotoğrafları kamuya açık olsa da **indirilmemiş, depoya eklenmemiş, hotlink edilmemiştir** — kamuya açık olmak kullanım izni anlamına gelmez.

Kaynak URL’ler ve lisans bilgileri `src/data/media.json` içinde her görsel için saklanır.

### Yorumlar

Sayfadaki 8 yorum Google İşletme Profilindeki **gerçek** yorumlardan kısaltılmış alıntılardır. Anlamları değiştirilmemiş, soyadları kısaltılmış, kaynak “Google” olarak belirtilmiştir.

**Yorum kartlarında yıldız gösterilmez** — tekil yorumların kaç yıldız verdiği profil görüntüsünden okunamadı, okunamayan bir puanı göstermektense hiç göstermemeyi tercih ettik. 4,8 puanı yalnızca 242 değerlendirmenin ortalaması olarak, tarih damgasıyla gösterilir.

---

## Resmî yayın modu

Shellson projeyi kabul ederse, sırayla:

1. **İşletmeden güncel bilgileri yazılı olarak doğrula** — özellikle `0555 044 10 82` numarasının WhatsApp’a kayıtlı olup olmadığı ([RESEARCH.md §2.1](RESEARCH.md)) ve haftalık tam çalışma saatleri (§2.2).
2. **Logo ve marka kimliğini al.** Bugün doğrulanabilir bir logo bulunamadı; sayfa markayı tipografik olarak kuruyor, uydurma logo çizilmedi.
3. **Gerçek fotoğrafların kullanım iznini al** (uygulama fotoğrafları + müşteri araçlarının görünmesi için gereken izinler). Sonra `tools/build-images.mjs` içindeki stok kaynakları değiştir ve “Konsept görsel” etiketlerini kaldır.
4. **Müşteri yorumlarının kullanımını onaylat.** Tekil yıldız puanları teyit edilirse `reviews[]` içine eklenip kartlarda gösterilebilir.
5. **Domain sahipliğini Shellson adına kur.** `shellsonwindowfilm.com` üçüncü tarafta; geri alınabilirliği araştırılmalı, alınamıyorsa yeni alan adı.
6. **Google profilindeki bozuk web sitesi bağlantılarını güncelle.**
7. **Eski/yanlış domainleri profilden kaldır** (ayrıca Instagram biyografisindeki ölü bağlantıyı düzelt).
8. **Eski telefon kayıtlarını düzelt** — dizinlerde hâlâ `0533 770 60 65` görünüyor (§4).
9. **Konsept şeridini kaldır** — `src/data/business.ts` içindeki `concept` bloğu ve `index.html`’deki `.concept-strip`.
10. **`index, follow` aç** — `index.html`’deki robots meta etiketlerini değiştir, `public/robots.txt`’i `Allow: /` yap.
11. **Güncel LocalBusiness schema oluştur** — yalnızca teyit edilmiş bilgilerle (ad, adres, telefon, açılış saatleri, `aggregateRating`).
12. **Özel alan adı bağla** — `public/CNAME` ekle, `BASE_PATH=/` ile build al.
13. **Analytics ve dönüşüm olaylarını kur** — WhatsApp tıklamaları, form gönderimleri, telefon tıklamaları.
14. **Search Console bağlantısını kur.**
15. **KVKK aydınlatma metni ve gizlilik politikası ekle** — form telefon numarası topluyor.
16. **Son mobil ve performans testlerini yap** — `npm run check` + gerçek cihazda Lighthouse.

---

## Testler

`npm run check` üretim build’ini gerçek Chromium’da açar ve **86 kontrol** çalıştırır:

| Grup | Kapsam |
|---|---|
| Demo modu | robots meta (5 direktif), JSON-LD yokluğu, robots.txt, konsept başlıkları |
| Responsive | 360 / 390 / 430 / 768 / 1024 / 1440 / 1920 px — yatay taşma ve konsol hatası |
| Mobil CTA | 360/390/430 × 640’ta ana CTA kaydırmadan görünüyor mu |
| Dokunma hedefi | Tüm etkileşimli ögeler ≥ 44 px |
| Akışlar | Yol seçimi, hizmet kartı → form önayarı, sekme geçişi |
| WhatsApp | Numara, mesaj içeriği, form doğrulama, geçersiz telefon |
| Galeri | Filtre, lightbox, ok tuşları, Esc, odak dönüşü |
| Bağlantılar | Ölü domain yok, doğru tel/wa numarası, eski numara/adres yok, boş bağlantı yok |
| Reduced motion | Gizli içerik kalmıyor, animasyon süresi sıfır |
| Kontrast | 20 metin/zemin çifti, WCAG AA eşiği |

Ekran görüntüleri `screenshots/` altına yazılır.

> **Not:** Kaydırma animasyonları yalnızca `.js` sınıfı eklendikten sonra devreye girer. JavaScript çalışmazsa veya `IntersectionObserver` yoksa içerik gizlenmez — sayfa tam okunur kalır.

---

## Dosya düzeni

```
index.html                    sayfa iskeleti
src/
  main.ts                     bootstrap
  data/business.ts            ← TEK İÇERİK KAYNAĞI
  data/media.json             görsel meta + lisans (üretilir)
  lib/{dom,media,motion,state}.ts
  components/{filmpane,forms,gallery,sections}.ts
  styles/{index,tokens,base,components,fonts}.css
  assets/fonts/               woff2 (üretilir)
public/
  media/                      optimize görseller (üretilir)
  robots.txt, favicon.svg
tools/
  build-images.mjs            görsel hattı
  fetch-fonts.mjs             font gömme
  check.mjs                   tarayıcı test paketi
.github/workflows/deploy.yml  main’e push → GitHub Pages
RESEARCH.md                   kaynaklar, doğrulama seviyeleri, çelişkiler
```

---

## Lisans ve sorumluluk

Kod bu konsept sunum için yazılmıştır. **Shellson markası, adı ve işletme bilgileri Shellson’a aittir.** Bu depo işletmenin talebi üzerine hazırlanmamıştır; işletme talep ederse kaldırılır veya devredilir.

Fotoğraflar: Pexels License. Fontlar: SIL Open Font License 1.1.
