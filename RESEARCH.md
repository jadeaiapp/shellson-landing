# RESEARCH.md — Shellson konsept çalışması

**Araştırma tarihi:** 3 Ağustos 2026
**Amaç:** Konsept landing page'de kullanılan her işletme bilgisinin kaynağını, doğrulama
durumunu ve bilinçli olarak dışarıda bırakılan iddiaları belgelemek.

> **Bu sayfa Shellson'ın resmî web sitesi değildir.** İşletmeyle iletişime geçilmemiş,
> hiçbir bilgi işletmeden yazılı olarak teyit ettirilmemiştir. Tüm veriler kamuya açık
> kaynaklardan derlenmiştir.

---

## 1. Doğrulama yöntemi

| Yöntem | Ne için |
|---|---|
| Kullanıcı tarafından iletilen Google İşletme Profili dökümü (3 Ağustos 2026) | Ad, puan, yorum sayısı, adres, telefon, kategori, kapanış saati, yorum metinleri |
| DNS sorgusu (`Resolve-DnsName`) | İki web sitesi bağlantısının çalışıp çalışmadığı |
| Ham TLS el sıkışması + sertifika incelemesi | `shellsonwindowfilm.com`'un kimin elinde olduğu |
| HTTP isteği (tarayıcı başlıklarıyla) | Sitelerin gerçekten içerik döndürüp döndürmediği |
| Web araması + sayfa çekme | Sosyal medya hesapları, hizmet kapsamı, arşiv içerik |

Kodda her alanın bir `v` (verification) etiketi var: `verified`, `unverified`, `claim`.
Bileşenler yalnızca `verified` olanları gösterir — bkz. `src/content/business.ts`.

---

## 2. Doğrulanmış bilgiler (sitede kullanıldı)

| Bilgi | Değer | Kaynak |
|---|---|---|
| İşletme adı | Shellson Profesyonel Araç Kaplama ve Cam Filmi \| PPF Kaplama ve Koruma \| Kağıthane \| Bina Cam Filmi | Google İşletme Profili |
| Kategori | Pencere Film Kaplama Hizmeti | Google İşletme Profili |
| Google puanı | 4,8 | Google İşletme Profili, 3 Ağustos 2026 |
| Değerlendirme sayısı | 243 | Google İşletme Profili, 3 Ağustos 2026 |
| Adres | Harmantepe, Okul Cd. No:95, 34410 Kağıthane / İstanbul | Google İşletme Profili |
| Plus Code | 3XHQ+G5 Kağıthane, İstanbul | Google İşletme Profili |
| Telefon / WhatsApp | 0555 044 10 82 | Google İşletme Profili |
| Kapanış saati | 19:00 | Google İşletme Profili |
| Instagram | [@shellsonwindowfilm](https://www.instagram.com/shellsonwindowfilm/) — 1.818 takipçi, en son paylaşımlar Aralık 2025 / Ocak 2026 | Instagram profili |
| Facebook | [Shellson Window Film's \| Istanbul](https://www.facebook.com/SHELLSONN/) | Facebook sayfası |
| YouTube | [@ShellsonWindowFilm](https://www.youtube.com/@ShellsonWindowFilm) | Arama sonucu + kanal bağlantısı |
| İşletme sahibinin yorumlara yanıt vermesi | Evet, olumsuz yorumlar dahil | Google yorumları |

### Doğrulanmış hizmetler

| Hizmet | Nasıl doğrulandı |
|---|---|
| Oto cam filmi | İşletme adında geçiyor + çok sayıda müşteri yorumu |
| PPF boya koruma | İşletme adında geçiyor + yorumlar (far PPF, TPU PPF uygulamaları) |
| Araç kaplama | İşletme adında geçiyor + yorum (mat kaplama uygulaması) |
| Mat kaplama / renk değişimi | Yorum: Chery aracına mat kaplama + cam filmi |
| **Bina cam filmi** | İşletme adında açıkça geçiyor |

---

## 3. ⚠️ İki web sitesi bağlantısının durumu — ikisi de çalışmıyor

Google İşletme Profilinde iki web sitesi bağlantısı görünüyor. **Her ikisi de
Shellson'ın çalışan bir sitesine gitmiyor.** Bu, kullanıcının ilk gözlemini
("Domain Catched benzeri bir ekran") doğrular.

### 3.1 `otocamfilmcisi.com` — ölü

```
Resolve-DnsName otocamfilmcisi.com      → DNS sunucusu hatası
Resolve-DnsName www.otocamfilmcisi.com  → DNS sunucusu hatası
HTTP isteği                             → "Bilinen böyle bir ana bilgisayar yok"
```

Alan adı **hiç çözümlenmiyor**. Arama motorlarında hâlâ eski önbellek kayıtları
("Shellson Cam Filmi - Oto Cam Filmi Uygulama Merkezi") görünüyor, ancak alan adının
kendisi yanıt vermiyor.

### 3.2 `shellsonwindowfilm.com` — domain yakalama servisinde

```
Resolve-DnsName shellsonwindowfilm.com  → A kaydı 78.47.211.208
TLS sertifikası:
  Subject : CN=*.catched.com
  Issuer  : CN=Don Dominio / MrDomain RSA DV CA, O="Soluciones Corporativas IP, SL", ES
  Geçerli : 31.01.2022 – 03.03.2023   ← 3 yıldan uzun süredir SÜRESİ DOLMUŞ
HTTP GET (tarayıcı başlıklarıyla) → 403 Forbidden (Cloudflare hata sayfası)
```

Sertifika `*.catched.com` adına düzenlenmiş. **catched.com bir domain yakalama /
park servisidir.** Yani alan adı artık işletmenin kontrolünde değil; süresi dolmuş
bir sertifikayla park sayfası sunuyor ve normal tarayıcı isteklerine 403 dönüyor.

**Sonuç:** Bu alan adı ziyaretçiye çalışan bir Shellson sitesi sunmuyor.

### 3.3 Bunun sonuçları

* Konsept sitede **iki alan adı da bağlantı olarak kullanılmadı.** Otomatik test bunu
  her çalıştırmada doğruluyor (`otocamfilmcisi.com bağlantı olarak kullanılmıyor`,
  `shellsonwindowfilm.com bağlantı olarak kullanılmıyor`).
* Instagram biyografisi hâlâ `www.shellsonwindowfilm.com` adresine yönlendiriyor —
  yani işletme her gün sosyal medyadan çalışmayan bir bağlantıya trafik gönderiyor.
  Bu, resmî yayına geçilirse çözülmesi gereken ilk konulardan biri.
* Arama sonuçlarında `shellsonwindowfilm.com` adına görünen içerik (13 yıl deneyim,
  10 yıl garanti, Acıbadem şubesi, Taşocağı Caddesi adresi, 0533'lü telefon) artık
  **işletmenin kontrolündeki bir sitede değil.** Bu yüzden hiçbiri güncel bilgi
  olarak kabul edilmedi.

---

## 4. Çelişkili kayıtlar

Aşağıdaki bilgiler eski/arşiv kaynaklarda Google İşletme Profilinden farklı çıktı.
Kullanıcının talimatı gereği **Google İşletme Profilindeki güncel bilgiye öncelik
verildi.**

| Alan | Google İşletme Profili (kullanıldı) | Eski / arşiv kayıt (kullanılmadı) |
|---|---|---|
| Telefon | **0555 044 10 82** | 0533 770 60 65 |
| Adres | **Harmantepe, Okul Cd. No:95, 34410 Kağıthane** | Çağlayan, Taşocağı Cd. 47/B, 34403 Kağıthane |
| Şube | Tek adres görünüyor | "Kağıthane ve Acıbadem şubeleri" |
| Değerlendirme sayısı | **243** (3 Ağustos 2026) | 242 (31 Temmuz 2026 — normal artış) |

Eski telefon ve adres, artık işletmenin elinde olmayan `shellsonwindowfilm.com`
alan adının arama motoru önbelleğinden geliyor. Sitede gösterilmedi.

---

## 5. Bilinçli olarak siteye eklenmeyen iddialar

Bunların hiçbiri arayüzde geçmiyor. Kod içinde `excludedClaims` listesinde de
belgelendi.

| İddia | Neden eklenmedi |
|---|---|
| **"10 yıl garanti"** | İşletmenin kendi Instagram biyografisinde ve bir Google yorumunda geçiyor. Kaynak var ama **garanti bir hukuki taahhüttür**; işletmeden yazılı teyit almadan üçüncü bir tarafın yayınlaması doğru değil. Resmî yayın kontrol listesine alındı. |
| **"13 yıl deneyim"** | Yalnızca artık işletmenin kontrolünde olmayan eski sitenin arşiv içeriğinde geçiyor. Güncelliği doğrulanamaz. |
| **3M / LLumar bayiliği** | 3M birden fazla gerçek Google yorumunda müşteriler tarafından anılıyor; LLumar bir Facebook video etiketinde geçiyor. Bunlar **müşteri beyanı ve etiket**, bayilik kanıtı değil. Doğrulanmamış marka bayiliği yazılmadı. |
| **Isı / UV engelleme yüzdeleri** | Hiçbir ölçüm doğrulanamadı. Simülatörde de bilinçli olarak hiçbir sayı gösterilmiyor. |
| **Fiyat ve fiyat aralıkları** | Hiçbir fiyat doğrulanamadı. SSS'de "bu sayfada fiyat yazmıyoruz" açıkça belirtildi. |
| **Haftalık çalışma programı** | Yalnızca kapanış saati (19:00) doğrulandı. Hangi günler açık olduğu bilinmiyor; sitede "gelmeden önce arayın" notu var. |
| **Acıbadem şubesi** | Arşiv içerikte geçiyor, güncelliği doğrulanamadı. |
| **Ev / ofis / mağaza filmlerinin ayrı ayrı sunulduğu** | Aşağıya bakınız (§6). |
| **Güvenlik filmi** | Shellson'ın bu ürünü sunduğuna dair hiçbir doğrulama bulunamadı. Ne hizmet kartı ne de form seçeneği olarak eklenmedi. |
| **İşletme sahibinin adı ("Sefer")** | Yorumlarda sıkça geçiyor ama site metni olarak kullanılmadı; yalnızca alıntılanan yorumların içinde kalıyor. Bu çalışmada hiçbir yoruma Sefer adı geçen bölüm dahil edilmedi. |

---

## 6. Mimari (bina) hizmetlerinde alınan özel karar

Brief, bina tarafı için ısı kontrol / UV / mahremiyet / güvenlik filmlerini ayrı
hizmet kartları olarak istiyordu. Ancak:

* **Doğrulanan:** Shellson bina cam filmi yapıyor (işletme adında yazıyor).
* **Doğrulanamayan:** Bu alt ürün kategorilerinin her birini ayrı ayrı sunduğu.

Kural gereği ("yalnızca araştırmada doğrulanan hizmetleri kesin biçimde göster"),
sitede:

* **Bir doğrulanmış hizmet kartı** var: *Bina cam filmi*.
* Isı / parlama / mahremiyet / UV başlıkları **hizmet olarak değil, kullanıcının
  çözmek istediği sorun olarak** sunuluyor ("İçerisi çok ısınıyor", "Ekranda parlama
  var" …).
* Arayüzde açık not: *"Hangi filmin uygun olduğuna camları görmeden karar verilmiyor.
  Bu yüzden burada ürün değil, çözülecek sorun seçiyorsunuz — gerisi keşifte
  netleşiyor."*

Bu, hem dürüst hem de gerçek satış sürecine daha yakın: keşif olmadan film tipi
zaten belirlenemiyor.

---

## 7. Kullanılan müşteri yorumları

**Kaynak:** Google İşletme Profili, kullanıcı tarafından 3 Ağustos 2026'da iletilen döküm.

Uygulanan kurallar:

* Metinler kısaltıldı, **anlamı değiştirilmedi**.
* Soyadları kısaltıldı (örn. "Erdem Cavga" → "Erdem C.").
* Tarihler Google'da göründüğü göreli biçimde bırakıldı.
* **Yıldız puanları gösterilmiyor.** Kaynak dökümde tek tek yorum puanları yer
  almıyordu; tahmin etmek yerine hiç göstermemek tercih edildi. Yalnızca işletmenin
  genel puanı (4,8) gösteriliyor.

| Gösterilen ad | Tarih | Konu |
|---|---|---|
| Erdem C. | bir ay önce | Ürün seçeneklerinin gösterilerek anlatılması |
| Taha Yağız O. | bir yıl önce | Far PPF + ön kapı camlarına film |
| Furkan K. | 10 ay önce | Mat kaplama + cam filmi |
| Cevdet K. | 2 yıl önce | PPF, çalışma alanının gösterilmesi |
| Tural K. | 4 ay önce | Cam filmi uygulaması |
| Burak İhsan Ç. | 5 yıl önce | Acele etmeden, detaylı çalışma |

### Kullanılmayan yorumlar ve nedenleri

* **Kubilay T. (bir ay önce)** — BMW'ye yapılan 3M film uygulamasından memnun
  kalmadığını yazmış; işletme sahibi telafi teklif etmiş. Kural gereği bu yorum
  **olumlu referans olarak kullanılmadı.** Ancak işletmenin yorumlara aktif ve telafi
  teklifiyle yanıt verdiği bilgisi, "Neden Shellson" bölümündeki
  *"Yorumlara işletme sahibi yanıt veriyor"* maddesinin dayanağıdır.
* **Fırat Y. (2 yıl önce)** — "10 yıl da garanti verdi" ifadesi geçtiği için
  kullanılmadı (bkz. §5, garanti maddesi).
* Diğer olumlu yorumlar yer darlığından seçilmedi; hiçbiri olumsuz oldukları için
  elenmedi.

---

## 8. Görseller — lisans ve kaynak

**Sitede tek bir fotoğraf yoktur.**

| Görsel | Kaynak | Lisans |
|---|---|---|
| Galerideki 8 sahne | Bu proje için sıfırdan çizilen SVG (`src/components/art/Scenes.tsx`) | Proje ile birlikte; üçüncü taraf hakkı yok |
| Simülatör sahneleri (araç kabini, ofis) | Bu proje için sıfırdan çizilen SVG (`src/components/FilmSimulator.tsx`) | Aynı |
| Hero arka planı, ikonlar, favicon, marka işareti | Bu proje için sıfırdan çizilen SVG | Aynı |

### Neden stok fotoğraf değil?

Brief, gerçek fotoğraf kullanılamıyorsa lisansı uygun stok görsellere izin veriyordu.
Buna rağmen tamamen özgün illüstrasyon tercih edildi, çünkü:

1. Bir stok araç fotoğrafı, ne kadar "konsept görsel" diye etiketlense de **başka bir
   işletmenin işini Shellson'ın işiymiş gibi gösterme riski** taşır. Bu risk sıfıra
   indirildi.
2. Sahte "önce/sonra" kurgusu tamamen imkânsız hale geldi: simülatörde iki taraf
   **aynı çizimin** filmli ve filmsiz halidir, farklı ortamlardan iki fotoğraf değil.
3. Lisans belirsizliği kalmadı.

Her görsel arayüzde **"Konsept görsel"** rozetiyle işaretli; lightbox'ta ayrıca
*"Shellson'ın gerçek uygulama fotoğrafı değildir"* yazıyor.

**Shellson'ın kendi fotoğrafları indirilmedi, depoya eklenmedi, hotlink edilmedi.**

---

## 9. Doğrulanamayan / bilinmeyenler

* Logo ve kurumsal renk paleti bulunamadı → renk paleti sıfırdan üretildi (§10).
* Haftalık çalışma günleri ve saatleri.
* İşletmenin kaç yıldır faaliyette olduğu.
* Hangi film markalarıyla resmî ilişkisi olduğu.
* Bina cam filmi tarafında hangi alt ürünlerin sunulduğu.
* Vergi/ticaret unvanı, KVKK metinleri, gizlilik politikası.
* E-posta adresi.

---

## 10. Tasarım kararlarının kaydı

### Otomatik tasarım önerisi reddedildi

`ui-ux-pro-max` skill'i çalıştırıldı. Ürettiği öneri **kullanılmadı**:

* Stil olarak *"Vintage Analog / Retro Film"* önerdi — sorgudaki "film" kelimesini
  fotoğraf filmi sanmış; konu cam filmi.
* Tipografi olarak *Inter / Inter*, renk olarak slate-navy önerdi — brief'in açıkça
  reddettiği "şablon görünümü".
* Sayfa deseni olarak *"AI Personalization Landing"* önerdi; analitik entegrasyonu
  gerektiriyor, statik bir demo için anlamsız.

Skill'den **alınanlar**: erişilebilirlik ve dokunma hedefi kural setleri, ve yerel
işletme sayfaları için "harita gizleme, yorum gizleme" anti-pattern uyarısı — ikisi de
uygulandı (harita var, yorumlar var).

### Palet (sıfırdan üretildi, kontrast hesaplanarak)

Marka kimliği bulunamadığı için palet brief'in konusundan türetildi: camın kenarından
bakınca göründüğü renk, gün ışığı yüzeyi, filmin serildiği an.

| Token | Değer | Rol | Kontrast |
|---|---|---|---|
| `--ink` | `#0B2830` | Koyu bölümler, gövde metni | 13,59:1 (açık zemin üzerinde) |
| `--daylight` | `#EFF1EE` | Sayfa zemini | — |
| `--tint-deep` | `#065F5B` | Araç yolu vurgusu, buton | 6,61:1 |
| `--azure-deep` | `#2E3D9E` | Bina yolu vurgusu, buton | 8,12:1 |
| `--tint-light` | `#3ED3C9` | Koyu zeminde araç vurgusu | 8,35:1 |
| `--azure-light` | `#93A3F5` | Koyu zeminde bina vurgusu | 6,47:1 |
| `--slate` | `#4A6168` | Yardımcı metin | 5,78:1 |

Tüm metin çiftleri WCAG AA'yı (4,5:1) geçiyor; hesaplama uygulamadan önce yapıldı.
GKM projesindeki antrasit + amber dili kullanılmadı.

### Tipografi

| Rol | Yüz | Neden |
|---|---|---|
| Başlık | Bricolage Grotesque | Karakterli, çağdaş grotesk; Inter/Poppins gibi varsayılan değil |
| Gövde | Instrument Sans | 16–18px'te yüksek okunabilirlik |
| Teknik etiket | DM Mono | "Ölçülmüş" hissi; eyebrow, spec ve tarih notları |

Üçü de SIL Open Font License. **Yerel olarak barındırılıyor** — Google Fonts'a hiçbir
dış istek yok. Türkçe glif kapsamı (ı İ ş Ş ğ Ğ ç Ç ö Ö ü Ü) programatik olarak
doğrulandı; alt küme çıkarılıp woff2'ye çevrildi (5 dosya, toplam 82 KB).

---

## 11. Şu anda geçerli olan demo güvenlik önlemleri

| Önlem | Durum |
|---|---|
| `noindex, nofollow, noarchive, nosnippet, noimageindex` | ✅ meta etiketinde |
| `robots.txt` ile `Disallow: /` | ✅ |
| LocalBusiness / JSON-LD yapısal veri | ✅ **hiç yayınlanmıyor** |
| Sayfa üstünde görünür konsept şeridi | ✅ her ekran boyutunda |
| Footer'da konsept açıklaması | ✅ |
| Başlık ve Open Graph'ta konsept ibaresi | ✅ |
| Bozuk domainlere bağlantı | ✅ hiç yok |
| Formların sunucuya veri göndermemesi | ✅ kullanıcıya açıkça belirtiliyor |

Bunların hepsi `npm run check` ile her çalıştırmada otomatik doğrulanıyor.

---

## 12. Kaynak listesi

* Google İşletme Profili — Shellson Profesyonel Araç Kaplama ve Cam Filmi (3 Ağustos 2026)
* [instagram.com/shellsonwindowfilm](https://www.instagram.com/shellsonwindowfilm/)
* [facebook.com/SHELLSONN](https://www.facebook.com/SHELLSONN/)
* [youtube.com/@ShellsonWindowFilm](https://www.youtube.com/@ShellsonWindowFilm)
* DNS ve TLS sorguları: `otocamfilmcisi.com`, `shellsonwindowfilm.com` (3 Ağustos 2026)
* Erişilemeyen dizin kayıtları (bilgi çıkarılamadı): otovasita.com.tr, kastamonulular.com
