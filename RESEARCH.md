# RESEARCH.md — Shellson Landing Page Konsept Çalışması

**Araştırma tarihi:** 31 Temmuz 2026
**Araştırmayı yapan:** Claude (Anthropic) — bağımsız konsept çalışması
**Durum:** Bu belge, `shellson-landing` konsept sitesinde kullanılan **her** işletme bilgisinin kaynağını, doğrulanma seviyesini ve bilinçli olarak dışarıda bırakılan iddiaları kayıt altına alır.

> Bu çalışma Shellson'ın resmî web sitesi değildir ve Shellson ile herhangi bir iş ilişkisi kurulmadan, kamuya açık kaynaklar üzerinden hazırlanmıştır. Sitenin yayına alınmadan önce işletmeden yazılı teyit alınması gerekir (bkz. §11).

---

## 1. Doğrulama seviyeleri

Bu belgede her bilgi bir seviyeyle işaretlenir:

| Seviye | Anlamı | Sitede kullanım |
|---|---|---|
| **A — Doğrulandı** | İşletmenin kendi kontrolündeki güncel bir kanalda (Google İşletme Profili, Instagram) görüldü | Serbestçe kullanılır |
| **B — Destekli** | Birden fazla bağımsız üçüncü taraf kaynakta tutarlı biçimde görüldü | Temkinli, atıflı kullanılır |
| **C — Zayıf** | Tek kaynak, eski kayıt veya yalnızca arama motoru dizininde kalmış içerik | Sitede **gösterilmez**, yalnızca burada not edilir |
| **D — Çelişkili** | Kaynaklar birbirini tutmuyor | Sitede **gösterilmez**, çelişki burada belgelenir |

---

## 2. Temel işletme bilgileri

| Alan | Değer | Seviye | Kaynak |
|---|---|---|---|
| İşletme adı | Shellson Profesyonel Araç Kaplama ve Cam Filmi \| PPF Kaplama ve Koruma \| Kağıthane \| Bina Cam Filmi | **A** | Google İşletme Profili (Maps), 31.07.2026 |
| Kısa ad (sitede kullanılan) | Shellson | **A** | Aynı profil + Instagram görünen adı |
| Adres | Harmantepe, Okul Cd. No:95, 34410 Kağıthane / İstanbul | **A** | Google İşletme Profili, 31.07.2026 |
| Plus Code | 3XHQ+G5 Kağıthane, İstanbul | **A** | Google İşletme Profili, 31.07.2026 |
| Telefon | 0555 044 10 82 | **A** | Google İşletme Profili, 31.07.2026 |
| Google puanı | 4,8 | **A** | Google İşletme Profili, 31.07.2026 |
| Google değerlendirme sayısı | 242 | **A** | Google İşletme Profili, 31.07.2026 |
| Google kategorisi | Pencere Film Kaplama Hizmeti | **A** | Google İşletme Profili, 31.07.2026 |
| Kapanış saati | 19:00 | **A** | Google İşletme Profili, 31.07.2026 |
| Maps bağlantısı | https://maps.app.goo.gl/d1fhVjgrctqvfthP6 | **A** | Kullanıcı tarafından sağlanan canlı profil bağlantısı |
| Instagram | [@shellsonwindowfilm](https://www.instagram.com/shellsonwindowfilm/) — "Shellson Window Film's", ~1.820 takipçi | **A** | Doğrudan profil erişimi, 31.07.2026 |

### 2.1 WhatsApp numarası — önemli uyarı

Google profilinde **0555 044 10 82** numarası telefon olarak listelenmiştir. Bu numaranın **WhatsApp'a kayıtlı olduğu doğrulanamamıştır**; profilde WhatsApp'a dair ayrı bir işaret yoktur.

Konsept site, tüm form akışlarını bu numaraya (`905550441082`) WhatsApp mesajı olarak yönlendirir. Bu, **test edilmemiş bir varsayımdır** ve yayına almadan önce mutlaka işletmeye sorulmalıdır. Numara WhatsApp'a kayıtlı değilse `src/data/business.ts` içindeki `whatsapp` alanı değiştirilmeli veya form akışı SMS/arama yönlendirmesine çevrilmelidir.

### 2.2 Çalışma saatleri — kısmen doğrulanamadı

Google profilinde 31.07.2026 itibarıyla yalnızca **"Açık · Kapanış saati: 19:00"** görülmüştür. Haftanın günlerine göre tam açılış–kapanış tablosu okunamamıştır.

**Sitedeki davranış:** Günlük saat tablosu **gösterilmez**. Bunun yerine yalnızca doğrulanan bilgi ("Kapanış 19:00") ve saatlerin teyide açık olduğunu belirten bir ifade kullanılır. `business.ts` içindeki `hours.detail` alanı `null` bırakılmıştır; işletmeden tam tablo alındığında doldurulabilir ve site otomatik olarak tabloyu gösterir.

---

## 3. İki domainin durumu — doğrulandı

Google İşletme Profilinde iki web sitesi bağlantısı listelenmektedir. **31.07.2026 tarihinde her ikisi de çalışmaz durumdadır.**

### 3.1 `shellsonwindowfilm.com` — domain yakalanmış (parked)

```
$ curl -I https://shellsonwindowfilm.com/
HTTP/1.1 302 Found
Server: nginx/1.24.0 (Ubuntu)
Date: Fri, 31 Jul 2026 11:36:18 GMT
Location: https://catched.com/redirect?domain=shellsonwindowfilm.com
```

- DNS **çözülüyor**: `78.47.211.208`
- TLS sertifikası **süresi dolmuş** (tarayıcı uyarısı verir)
- Kök adres, `catched.com` adlı bir **domain yakalama / satış servisine** 302 ile yönlendiriyor
- Kullanıcının ilk incelemede gördüğü "Domain Catched" ekranı **bu davranıştır ve doğrulanmıştır**

**Sonuç:** Domain artık Shellson'ın kontrolünde görünmemektedir. Süresi dolmuş ve üçüncü tarafça yakalanmış olma ihtimali yüksektir.

### 3.2 `otocamfilmcisi.com` — tamamen ölü

```
$ Resolve-DnsName otocamfilmcisi.com
DNS FAIL: otocamfilmcisi.com : DNS server failure
$ Resolve-DnsName www.otocamfilmcisi.com
DNS FAIL: www.otocamfilmcisi.com : DNS server failure
```

- DNS **hiç çözülmüyor** (SERVFAIL). HTTP isteği kurulamıyor.
- Arama motoru dizininde sayfa başlıkları hâlâ görünüyor ("Shellson Cam Filmi - Oto Cam Filmi Uygulama Merkezi") ancak **canlı içerik yok**.

### 3.3 Bunun işletmeye maliyeti

Bu, konsept çalışmanın en somut bulgusudur:

1. Google İşletme Profilindeki **her iki web sitesi bağlantısı da müşteriyi hataya götürüyor.** Profilinden siteye tıklayan her ziyaretçi kayboluyor.
2. **Instagram biyografisindeki bağlantı da** (`www.shellsonwindowfilm.com`) aynı ölü/park edilmiş domaine gidiyor.
3. `shellsonwindowfilm.com` üçüncü tarafta olduğu için, marka adını taşıyan bir adres Shellson'ın kontrolü dışındadır.

Konsept site bu iki domaine **hiçbir bağlantı vermez.**

### 3.4 Eski site içeriğine erişim denemesi

`web.archive.org` bu ortamdan erişime kapalı olduğu için eski site içeriği **arşivden doğrulanamamıştır.** Elde kalan tek iz, arama motoru dizinindeki sayfa başlıkları ve parçacıklardır (§5'te "C" seviyesi olarak işaretli).

---

## 4. Çelişkili kayıtlar

| Alan | Google İşletme Profili (31.07.2026) | Çelişen eski kayıt | Karar |
|---|---|---|---|
| **Adres** | Harmantepe, Okul Cd. No:95, 34410 Kağıthane | Çağlayan, Taşocağı Cd. 47/B, 34403 Kağıthane — `shellsonwindowfilm.com` dizin parçacığı | Google profili esas alındı. Eski adres sitede **kullanılmadı**. |
| **Telefon** | 0555 044 10 82 | 0533 770 60 65 — aynı eski site parçacığı | Google profili esas alındı. Eski numara sitede **kullanılmadı**. |
| **Şube** | Tek konum (Kağıthane) | "Kağıthane ve Acıbadem şubeleri" — eski site dizin parçacığı | **D — Çelişkili.** Acıbadem şubesi bugün doğrulanamadı; sitede **hiç şubeden söz edilmiyor**. |

Her iki eski kayıt da artık çalışmayan bir domainden geldiği için güncel kabul edilmemiştir.

---

## 5. Hizmetler ve doğrulanma seviyeleri

### 5.1 Otomotiv — sitede gösterilenler

| Hizmet | Seviye | Dayanak |
|---|---|---|
| Oto cam filmi | **A** | Google işletme adı + kategorisi; Instagram biyografisi; çok sayıda Google yorumu |
| Ön cam filmi / film sökümü ve yenileme | **A** | Google yorumları: "ön camda filim vardı o sökülecekti"; "arka camdaki kabarcıklar… Sefer Usta… söktü" |
| PPF (boya koruma filmi) | **A** | Google işletme adında "PPF Kaplama ve Koruma"; Instagram biyografisi; birden çok yorum |
| Far PPF / şeffaf koruma | **A** | Google yorumu: "Aracımın farlarına ppf kaplama…"; "ön kaputa ppf kaplama işlemi" |
| Komple araç kaplama | **A** | Google işletme adında "Profesyonel Araç Kaplama"; yorum: "Şirket arabamızı komple kaplama yaptırdık" |
| Renk değişimi | **A** | Yorum: "komple kaplama yaptırdık **farklı renkte**" |
| Mat kaplama | **A** | Yorum: "Chery aracımıza **mat kaplama** ve cam filmi uygulaması yaptırdık" |

### 5.2 Mimari / bina — sitede gösterilenler

| Hizmet | Seviye | Dayanak |
|---|---|---|
| Bina cam filmi | **A** | Google işletme adının kendisi "… \| **Bina Cam Filmi**" ile bitiyor |
| Ev / ofis / mağaza cam filmi | **B** | "Bina cam filmi" üst başlığının doğal kapsamı; eski sitede ayrı bir `hizmetlerimiz/bina-cam-filmi.html` sayfası dizinde görünüyor |

**İhtiyaç kategorileri** (ısı/güneş kontrolü, UV, mahremiyet, güvenlik): Bunlar sitede **ayrı ayrı doğrulanmış ürün hattı olarak sunulmaz.** Yalnızca keşif formunda müşterinin ihtiyacını tarif etmesi için **seçenek** olarak yer alır ve form metni bunu açıkça "ihtiyacınız" diye çerçeveler. Gerekçe: bu alt başlıkların Shellson tarafından ayrı hizmet olarak sunulduğu, işletmenin güncel kanallarında doğrulanamadı.

### 5.3 Sitede gösterilmeyen, yalnızca kayda geçen hizmet iddiaları (C)

Aşağıdakiler yalnızca artık çalışmayan `shellsonwindowfilm.com` / `otocamfilmcisi.com` domainlerinin arama motoru parçacıklarında geçmektedir. Canlı doğrulama yapılamadığı için **sitede yer almazlar**:

- Karbon fiber kaplama
- Krom kaplama
- Özel desenli kaplama
- Toptan cam filmi satışı

### 5.4 "Ön cam filmi" bilinçli olarak hizmet listesinden çıkarıldı

SSS'de tek bir mevzuat ifadesi geçtiği için bu konu ayrıca araştırıldı (31.07.2026). Birden çok bağımsız Türkçe kaynak aynı genel çerçevede birleşiyor:

- Cam filmi Karayolları Trafik Yönetmeliği kapsamında düzenleniyor.
- **Ön cama film uygulaması kabul edilmiyor.**
- Yan ve arka camlarda, sürücünün görüşünü engellemeyen uygulamalara izin veriliyor.

Kaynaklar arasında ceza tutarı gibi ayrıntılarda farklılıklar var; bu yüzden sitede **hiçbir ceza tutarı, ışık geçirgenliği yüzdesi veya numara (1/2 numara film) belirtilmedi.** SSS cevabı yalnızca genel çerçeveyi aktarıyor, "kurallar değişebiliyor, uygulama öncesi Shellson ile netleştirin" uyarısı içeriyor ve açıkça "hukuki görüş değildir" diyor.

**Bunun hizmet listesine etkisi:** İlk taslakta "Ön cam filmi ve yenileme" adında bir hizmet vardı. Araştırma sonrası bu **kaldırıldı**, yerine "Film sökümü ve yenileme" kondu. İki gerekçe:

1. Ön cama film uygulaması mevzuat çerçevesinde kabul edilmiyor; Shellson'ı yapmadığı ve yapmaması gereken bir işi yapıyor gibi göstermek doğru olmaz.
2. Google yorumlarında ön camla ilgili geçen işlemler zaten **mevcut filmin sökülmesi** yönünde ("ön camda filim vardı o sökülecekti"). Yorumlarda film uygulaması geçen camlar **ön kapı camları** ("ön kapı camlarına amerikan menşeli film") ve arka cam.

---

## 6. Marka / ürün adları

- Google yorumlarında müşteriler **3M** ("3M cam filmi", "3m 2 numara film") ve **amerikan menşeli film** ifadelerini kullanmıştır.
- Shellson'ın Facebook video paylaşımlarından birinde `#llumarwindowfilm` etiketi görünmektedir.

**Karar:** Site hiçbir yerde **bayilik, yetkili uygulayıcı veya distribütörlük iddiasında bulunmaz.** 3M adı yalnızca *bir müşteri yorumunun içinde*, o müşterinin kendi ifadesi olarak geçer. Ürün markası seçimi konusu, SSS'de "hangi markayı istediğinizi uygulama öncesi konuşun" biçiminde nötr olarak ele alınır.

---

## 7. Garanti ve kıdem iddiaları — bilinçli olarak sınırlandırıldı

| İddia | Nerede geçiyor | Sitedeki karar |
|---|---|---|
| **10 yıl garanti** | Shellson'ın kendi Instagram biyografisi (**canlı, A seviyesi**): "🔒 10 Yıl Garanti ile Cam Filmi & PPF Kaplama"; ayrıca eski site parçacıkları ve bir Google yorumu ("10 yıl da garanti verdi") | Ana vaat / rozet olarak **kullanılmadı**. Yalnızca SSS'de, **kaynağı açıkça belirtilerek** ve "kapsam ve koşulları uygulama öncesi işletmeden teyit edin" uyarısıyla aktarıldı. Gerekçe: garantinin kapsamı, hangi ürünlerde geçerli olduğu ve koşulları doğrulanamadı. |
| **2008'den beri / 16 yıl deneyim** | Yalnızca Armut firma profili (üçüncü taraf, işletmenin kendi beyanı olabilir) | Sitede **hiç kullanılmadı.** Tek kaynak ve doğrulanamıyor. |
| **13 yıl sektör deneyimi** | Arama motoru parçacığı, kaynağı belirsiz | Sitede **hiç kullanılmadı.** |
| **Isı / UV engelleme yüzdeleri** | Hiçbir kaynakta Shellson'a ait ölçülmüş değer bulunamadı | Sitede **hiçbir yüzde gösterilmiyor.** Etkileşimli ton demosu açıkça "görsel benzetim, ölçüm değildir" diye etiketlendi. |
| **Fiyatlar** | Hiçbir kaynakta yok | Sitede **hiç fiyat yok.** Tüm akış "fiyat talebi" üzerine kurulu. |

---

## 8. Müşteri yorumları

**Kaynak:** Google Haritalar işletme profili (https://maps.app.goo.gl/d1fhVjgrctqvfthP6), 31.07.2026 tarihinde görüntülenen yorumlar.

### 8.1 Sitede kullanılan yorumlar

Tamamı gerçektir, anlamları değiştirilmemiştir, soyadları kısaltılmıştır ve kaynak "Google" olarak belirtilmiştir. Uzun yorumlarda yalnızca ilgili cümle alınmış, kesme `…` ile gösterilmiştir.

| Yazar | Tarih (profilde göründüğü şekliyle) | Konu |
|---|---|---|
| Erdem C. | bir ay önce | Ürün seçeneklerinin gösterilerek anlatılması |
| Hakan I. | 4 hafta önce | İlgi ve titizlik |
| mehdi k. | 2 ay önce | Oto cam filmi (müşteri 3M diyor) |
| Tural K. | 4 ay önce | Uygulama süresi (~1 saat) |
| Filiz T. Ş. | 9 ay önce | PPF, 2 günde teslim |
| Furkan K. | 10 ay önce | Mat kaplama + cam filmi |
| Taha Y. O. | bir yıl önce | Far PPF + kapı camı filmi |
| mahsun p. | bir yıl önce | Komple kaplama, renk değişimi |

### 8.2 Yorum başına yıldız gösterilmiyor — bilinçli karar

Profil görüntüsünde **tekil yorumların kaç yıldız verdiği okunamamıştır.** Bu yüzden site, yorum kartlarında **yıldız göstermez**; yalnızca yorum metni, yazar ve tarih gösterilir. Genel 4,8 puanı ise ayrı bir yerde, 242 değerlendirmenin ortalaması olarak ve tarih damgasıyla sunulur.

Bu kural özellikle önemlidir: 5 yıldız olmayan bir yorumu 5 yıldızmış gibi göstermemek için yıldızlar tamamen kaldırılmıştır.

### 8.3 Olumsuz yorum — nasıl ele alındı

**Kubilay T. (bir ay önce)** bir BMW aracına yapılan 3M film uygulamasından memnun kalmadığını yazmıştır. İşletme sahibi yoruma yanıt vererek filmi yenileme ve telafi teklifinde bulunmuştur.

**Kurallar gereği:**
- Bu yorum sitede **referans/övgü olarak kullanılmamıştır.**
- Olumluya çevrilmemiş, gizlenmemiş, yeniden yazılmamıştır.
- Bu belgede olduğu gibi kayda geçmiştir.

Sitede yalnızca **doğrulanabilir davranışsal bir gözlem** kullanılmıştır: *işletme sahibinin Google yorumlarına düzenli yanıt vermesi ve memnuniyetsizlikte telafi teklif etmesi.* Bu gözlem, olumsuz yorum dahil çok sayıda yoruma verilen işletme yanıtlarıyla desteklenmektedir ve bir puan iddiası içermez.

### 8.4 Bina cam filmi yorumu bulunamadı

İncelenen Google yorumlarının **tamamı otomotiv** hizmetleriyle ilgilidir. **Bina / ev / ofis cam filmi hizmetine ait tek bir müşteri yorumu bulunamamıştır.**

**Sitedeki davranış:** Yorum bölümü, seçilen yola göre filtrelenir; kullanıcı "Binam için" yolunu seçtiğinde sahte bir bina yorumu üretilmez — bunun yerine mevcut yorumların otomotiv tarafına ait olduğu açıkça belirtilir.

---

## 9. Görseller — lisans ve kaynak

### 9.1 Shellson'ın kendi fotoğrafları kullanılmadı

Shellson'ın Google profilinde ve Instagram hesabında kamuya açık uygulama fotoğrafları bulunmaktadır. **Hiçbiri indirilmemiş, depoya eklenmemiş veya hotlink edilmemiştir.** Gerekçe: kamuya açık olması kullanım izni anlamına gelmez; telif işletmeye ve/veya fotoğrafı çeken müşterilere aittir.

### 9.2 Kullanılan görsellerin tamamı stok / konsept görseldir

- **Kaynak:** Pexels (https://www.pexels.com)
- **Lisans:** [Pexels License](https://www.pexels.com/license/) — ticari ve ticari olmayan kullanım ücretsiz, atıf zorunlu değil. Değiştirilmemiş kopyaların satışı ve görseldeki kişi/markaların onay verdiği izlenimi yasaktır.
- **Barındırma:** Tüm dosyalar indirilip depoya `public/media/` altına eklenmiştir. **Hiçbir dış görsel hotlink edilmemiştir.**
- **İşleme:** `tools/build-images.mjs` ile 480/960/1600 px WebP + 1200 px JPEG yedeği ve LQIP ön izleme üretilir. Kaynak URL'ler `src/data/media.json` içinde saklanır.

### 9.3 Görsellerin işaretlenmesi

Sitedeki **her** fotoğraf, galeri kartında ve lightbox'ta **"Konsept görsel"** etiketi taşır. Galeri bölümünün başında ayrıca şu açıklama bulunur: bu görseller Shellson'ın kendi uygulamaları değildir, hizmet türünü anlatmak için kullanılan stok görsellerdir.

Gerçek ve konsept görseller **karıştırılmamıştır** — sitede gerçek Shellson görseli hiç yoktur, dolayısıyla karışma riski de yoktur.

### 9.4 Elenen görseller

İnceleme sırasında şu adaylar **bilinçli olarak elenmiştir**:
- Üzerinde **başka işletmelerin markası/logosu** görünen araç kaplama fotoğrafları (ör. reklam giydirmeli araç, markalı iş kıyafeti) — Shellson'ın işi sanılma ve üçüncü taraf markasını çağrıştırma riski.
- **Tanınabilir yüz** içeren fotoğraflar — Pexels lisansı, görseldeki kişilerin ürünü/hizmeti onayladığı izlenimini yasaklar; müşteri sanılma riski vardır.

### 9.5 Fotoğrafçı adları

`tools/build-images.mjs` fotoğrafçı adlarını otomatik çekmeye çalışır; bu ortamda Pexels sayfaları bot korumasına takıldığı için adlar alınamamıştır (`photographer: null`). Bunun yerine **her görselin doğrulanabilir Pexels sayfa URL'si** `src/data/media.json` içinde saklanmaktadır. Pexels lisansı atıf zorunlu kılmaz; yine de resmî yayın öncesi adların doldurulması önerilir.

---

## 10. Doğrulanamayan bilgiler (siteye alınmadı)

- **Facebook:** `facebook.com/SHELLSONN` ("Shellson Window Film's | Istanbul") ve `facebook.com/61572629432429` adlı iki sayfa arama sonuçlarında görünüyor. Sayfa içerikleri bot koruması nedeniyle doğrulanamadı; **hangisinin güncel/resmî olduğu belirlenemedi.** Sitede Facebook bağlantısı **verilmedi.**
- **YouTube:** `youtube.com/@ShellsonWindowFilm` kanalı arama sonuçlarında ve video bağlantılarında görünüyor; kanal sayfası doğrulanamadı. Sitede **verilmedi.**
- **Logo / marka kimliği:** Shellson'a ait bir logo dosyası veya marka rehberi bulunamadı. Site, marka adının **tipografik** bir kurgusunu kullanır; uydurma bir logo çizilmemiştir.
- **Kurumsal renkler:** Doğrulanabilir bir marka paleti bulunamadı. Palet bu proje için sıfırdan geliştirilmiştir (bkz. README).
- **E-posta adresi:** Hiçbir kaynakta bulunamadı. Sitede **yok.**
- **Tam çalışma saatleri tablosu:** §2.2.
- **WhatsApp doğrulaması:** §2.1.
- **Ekip / usta adları:** Yorumlarda "Sefer Usta", "Sefer Bey", "Muhterem Bey", "Barış Bey" adları sık geçiyor. Bunlar müşteri yorumlarından gelen adlardır; **işletmenin resmî ekip tanıtımı değildir.** Site, yorum alıntılarının dışında ekip adı kullanmaz ve "Sefer Usta" gibi adları başlık/vaat olarak öne çıkarmaz.

---

## 11. Resmî yayın öncesi teyit listesi

Shellson bu çalışmayı kabul ederse, yayına almadan önce işletmeden **yazılı** olarak teyit alınması gereken maddeler:

1. `0555 044 10 82` numarası WhatsApp'a kayıtlı mı? Değilse hangi numara kullanılacak?
2. Haftalık tam çalışma saatleri (gün gün açılış–kapanış, hafta sonu durumu).
3. Bina/ev/ofis cam filmi hizmeti aktif olarak veriliyor mu? Hangi ihtiyaç başlıkları gerçekten sunuluyor (ısı, UV, mahremiyet, güvenlik)?
4. Garanti: süresi, kapsamı, hangi ürünlerde geçerli olduğu ve koşulları.
5. Kullanılan film markaları ve varsa resmî bayilik/yetkili uygulayıcı belgesi.
6. Kuruluş yılı / kaç yıldır faaliyette olduğu.
7. Acıbadem veya başka bir şube var mı?
8. Shellson'ın kendi uygulama fotoğraflarının kullanım izni (ve müşteri araçlarının görünmesi için gerekli izinler).
9. Google yorumlarının sitede alıntılanmasına onay.
10. Logo ve varsa marka kimliği dosyaları.
11. Domain sahipliği: `shellsonwindowfilm.com` geri alınabilir mi, yoksa yeni bir alan adı mı kurulacak?
12. Google İşletme Profilindeki iki bozuk web sitesi bağlantısının güncellenmesi/kaldırılması.
13. Instagram biyografisindeki ölü bağlantının güncellenmesi.
14. KVKK aydınlatma metni ve gizlilik politikası içeriği.

---

## 12. Konsept siteye bilinçli olarak **eklenmeyen** iddialar — özet

Aşağıdakilerin hiçbiri sitede yoktur ve bu bir eksiklik değil, bilinçli bir karardır:

- ❌ Fiyat, fiyat aralığı veya "en uygun fiyat" iddiası
- ❌ Isı, UV veya güneş enerjisi engelleme yüzdesi
- ❌ Garanti süresi vaadi (yalnızca SSS'de atıflı ve teyide açık biçimde aktarıldı)
- ❌ "X yıldır hizmetteyiz" / kuruluş yılı
- ❌ Marka bayiliği, yetkili uygulayıcı veya distribütörlük
- ❌ Şube bilgisi
- ❌ Uydurma müşteri yorumu, uydurma isim veya yorum başına yıldız
- ❌ Sertifika, ödül, ISO veya kalite belgesi
- ❌ Müşteri/araç sayısı istatistiği ("5.000+ araç" vb.)
- ❌ Shellson'ın kendi fotoğrafları
- ❌ Sahte before/after karşılaştırması (ton demosu, aynı kareye uygulanan görsel benzetimdir ve öyle etiketlenmiştir)
- ❌ LocalBusiness veya başka bir işletme JSON-LD schema'sı (demo modu gereği)
- ❌ Çalışmayan iki domaine bağlantı
- ❌ Eski telefon numarası veya eski adres

---

## 13. Kaynak listesi

| # | Kaynak | Erişim | Not |
|---|---|---|---|
| 1 | Google İşletme Profili — https://maps.app.goo.gl/d1fhVjgrctqvfthP6 | 31.07.2026 | Birincil kaynak: ad, adres, telefon, puan, yorum sayısı, kategori, kapanış saati, yorumlar |
| 2 | Instagram — https://www.instagram.com/shellsonwindowfilm/ | 31.07.2026 | Biyografi, takipçi sayısı, biyografideki ölü bağlantı |
| 3 | `curl -I https://shellsonwindowfilm.com/` | 31.07.2026 | 302 → catched.com; sertifika süresi dolmuş |
| 4 | `Resolve-DnsName otocamfilmcisi.com` | 31.07.2026 | SERVFAIL — domain çözülmüyor |
| 5 | Armut firma profili — https://armut.com/hizmetveren/shellson-istanbul-kagithane-oto-cam-filmi_19200 | 31.07.2026 | Kuruluş yılı iddiası (kullanılmadı) |
| 6 | Arama motoru dizini — `shellsonwindowfilm.com`, `otocamfilmcisi.com` parçacıkları | 31.07.2026 | Eski adres/telefon çelişkisi, eski hizmet listesi (C seviyesi) |
| 7 | Pexels — https://www.pexels.com/license/ | 31.07.2026 | Görsel lisansı |
| 8 | Cam filmi mevzuatı — birden çok Türkçe kaynak (otopratik.com.tr, mapfre.com.tr/blog, carshine.com.tr, surucukurslari.com) | 31.07.2026 | SSS'deki tek mevzuat ifadesi; ayrıntılarda kaynaklar ayrıştığı için sitede yalnızca genel çerçeve aktarıldı (§5.4) |

---

*Bu belge, sitedeki içerikle birlikte güncellenmelidir. `src/data/business.ts` içinde bir bilgi değiştiğinde buradaki kaynak ve seviye kaydı da güncellenmelidir.*
