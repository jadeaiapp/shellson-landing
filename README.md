# Shellson — konsept landing page

> **Bu depo Shellson'ın resmî web sitesi değildir.**
> Shellson Profesyonel Araç Kaplama ve Cam Filmi için hazırlanmış bağımsız bir
> konsept çalışmadır. İşletmeyle iletişime geçilmemiş, hiçbir bilgi yazılı olarak
> teyit ettirilmemiştir.

**Canlı demo:** https://jadeaiapp.github.io/shellson-landing/

---

## Ne yapıyor?

Google Haritalar, Instagram ve reklamlardan gelen ziyaretçiyi **iki müşteri yoluna**
ayırıp, her yol için WhatsApp'a gidecek hazır bir talep mesajı üretiyor.

```
trafik → yol seçimi → ilgili hizmetler & güven → uygun form → hazır WhatsApp mesajı
         ├─ Aracım            oto cam filmi, PPF, kaplama    → fiyat & süre talebi
         └─ Evim / iş yerim   bina cam filmi                 → keşif talebi
```

Yol seçimi dekoratif değil. Seçim şunları değiştiriyor: vurgu rengi, hizmet bölümünün
tamamı, galeri filtresi, SSS grubu, form alanları, CTA metni ve WhatsApp mesajının
gövdesi. Seçim URL'de taşınıyor (`?yol=arac` / `?yol=yapi`), bu yüzden bağlantı
paylaşılabiliyor ve yenilemede korunuyor.

### İmza öğesi

**Film simülatörü** — aynı sahnenin filmli ve filmsiz hali. Kullanıcı aradaki kenarı
sürükledikçe film yüzeye seriliyor (çekpasın camda ilerlemesi). Sürüklenebilir,
dokunmatik ve klavye ile kullanılabilir. Hiçbir ısı/UV oranı gösterilmiyor —
doğrulanmış ölçüm bulunmadığı için sayı vermek yanıltıcı olurdu.

---

## Teknoloji

| | |
|---|---|
| Yapı | Vite 8 + React 19 + TypeScript |
| Stil | El yazımı CSS + custom property tabanlı token sistemi (UI kütüphanesi yok) |
| Hareket | CSS `clip-path` + IntersectionObserver (animasyon kütüphanesi yok) |
| Font | Bricolage Grotesque · Instrument Sans · DM Mono — **yerel barındırma**, alt küme woff2 (5 dosya / 82 KB) |
| Görsel | Tamamı bu proje için çizilmiş SVG — fotoğraf yok |
| Dış istek | Yalnızca Google Haritalar gömme çerçevesi. Font, script veya CDN bağımlılığı yok |

Üretim çıktısı: **~80 KB gzip JS + 7,5 KB gzip CSS + 82 KB font.**

---

## Komutlar

```bash
npm install
npm run dev        # geliştirme sunucusu
npm run build      # tip kontrolü + üretim derlemesi
npm run check      # gerçek tarayıcıda 92 kontrol (dist/ üzerinde)
npm run verify     # build + check
npm run check -- --url https://jadeaiapp.github.io/shellson-landing/   # canlıyı test et
```

`npm run check` Playwright ile gerçek Chromium açar ve şunları doğrular:

* Demo güvenliği: noindex etiketleri, robots.txt, JSON-LD'nin **bulunmadığı**,
  konsept şeridi, bozuk domainlere bağlantı verilmediği
* 360 / 390 / 430 / 768 / 1024 / 1440 / 1920 px'te yatay taşma olmadığı
* Mobilde ana CTA'nın kaydırmadan görünürlüğü
* Tüm dokunma hedeflerinin ≥ 44×44 px olduğu
* İki yollu akış, derin bağlantı, yenilemede seçimin korunması
* Hizmet kartından forma aktarım
* Form doğrulama, hatalı alana odaklanma, `role="alert"`
* WhatsApp mesajının içeriği ve **doğru numaraya** gittiği
* Galeri, lightbox, klavye gezinme, odak tuzağı ve odağın geri dönmesi
* Mobil menü, alt eylem çubuğu
* Başlık hiyerarşisi, form etiketleri, `alt` nitelikleri, iframe başlığı
* `prefers-reduced-motion` desteği
* Konsol hatası ve ölü bağlantı olmadığı

Ekran görüntüleri `screenshots/` klasörüne yazılır.

---

## Dosya düzeni

```
src/
  content/business.ts     ← TÜM işletme bilgisi burada, doğrulama etiketleriyle
  components/             ← bölümler
    art/Icons.tsx         ← ikon seti (SVG, emoji yok)
    art/Scenes.tsx        ← galeri illüstrasyonları
    FilmSimulator.tsx     ← imza öğesi
  hooks/                  ← usePath (yol + URL), useReveal (giriş animasyonu)
  styles/
    tokens.css            ← palet, tipografi, ritim, hareket eğrileri
    base.css              ← reset, tipografi, buton, hareket
    sections.css          ← bölüm stilleri + duyarlılık
scripts/check.mjs         ← tarayıcı kontrol takımı
RESEARCH.md               ← kaynaklar, çelişkiler, dışarıda bırakılan iddialar
```

### İçeriği güncellemek

Telefon, adres, puan, yorum sayısı, saatler, hizmetler, yorumlar, form seçenekleri ve
WhatsApp mesaj şablonlarının tamamı `src/content/business.ts` içindedir. Bileşenlerde
sabit yazılmış hiçbir işletme bilgisi yoktur.

Her alanın bir doğrulama etiketi vardır:

```ts
phoneDisplay: fact('0555 044 10 82', 'verified', 'Google İşletme Profili'),
weeklyHours:  fact(null, 'unverified'),   // ← doğrulanmadığı için sitede GÖSTERİLMEZ
```

---

# Demo modu

Depo şu anda bu moddadır.

| | |
|---|---|
| Arama motorları | `noindex, nofollow, noarchive, nosnippet, noimageindex` + `robots.txt` ile tamamen kapalı |
| Yapısal veri | LocalBusiness / JSON-LD **yayınlanmıyor** — işletmenin gerçek arama sonuçlarıyla karışmasın diye |
| Konsept uyarısı | Sayfa üstünde görünür şerit + footer açıklaması + `<title>` ve Open Graph başlığında |
| Görseller | Tamamı özgün illüstrasyon, arayüzde "Konsept görsel" rozetiyle işaretli. Shellson'ın gerçek fotoğrafı kullanılmadı |
| Formlar | Hiçbir sunucuya veri göndermez; yalnızca WhatsApp mesajı üretir. Bu, kullanıcıya arayüzde yazılı olarak belirtilir |
| Bozuk domainler | Google profilindeki iki çalışmayan alan adına bağlantı verilmez |
| İddialar | Fiyat, garanti süresi, deneyim yılı ve marka bayiliği iddiası içermez (gerekçeler: `RESEARCH.md` §5) |

Demo modu tek yerden kapatılır: `src/content/business.ts` → `demoMode.enabled`.
Ancak aşağıdaki adımlar tamamlanmadan kapatılmamalıdır.

---

# Resmî yayın modu

Shellson projeyi kabul ederse sırasıyla yapılacaklar.

### A. İşletmeden alınacaklar

1. **Güncel bilgileri yazılı olarak doğrula** — telefon, adres, çalışma günleri ve
   saatleri, hizmet kapsamı.
2. **Logo ve marka kimliğini al.** Bu çalışmadaki palet ve tipografi, marka kimliği
   bulunamadığı için sıfırdan üretildi; gerçek kimlik gelince `tokens.css` güncellenir.
3. **Gerçek uygulama fotoğraflarının kullanım iznini al** ve `Scenes.tsx`
   illüstrasyonlarının yerine koy.
4. **Müşteri yorumlarının kullanımını onaylat.**
5. **Garanti, deneyim yılı ve marka ilişkilerini teyit ettir** — teyit gelirse
   `excludedClaims` listesinden çıkarılıp siteye eklenebilir.

### B. Alan adı ve arama görünürlüğü

6. **Domain sahipliğini Shellson adına kur.** `shellsonwindowfilm.com` şu anda bir
   domain yakalama servisinde (`*.catched.com`), `otocamfilmcisi.com` hiç
   çözümlenmiyor. Ayrıntı: `RESEARCH.md` §3.
7. **Google profilindeki bozuk web sitesi bağlantılarını güncelle.**
8. **Eski/yanlış alan adlarını profilden kaldır.**
9. **Instagram biyografisindeki bağlantıyı düzelt** — şu anda çalışmayan
   `shellsonwindowfilm.com` adresine trafik gönderiyor.
10. **Eski telefon kayıtlarını düzelt** (rehberlerde hâlâ 0533'lü numara görünüyor).

### C. Teknik geçiş

11. `demoMode.enabled = false` yap → konsept şeridi ve footer uyarısı kalkar.
12. `index.html` içindeki robots meta etiketini `index, follow` yap.
13. `public/robots.txt` dosyasını indekslemeye izin verecek şekilde değiştir ve
    sitemap ekle.
14. **Güncel LocalBusiness schema (JSON-LD) oluştur** — yalnızca yazılı olarak
    doğrulanmış bilgilerle.
15. Özel alan adını bağla (`public/CNAME`) ve `vite.config.ts` içindeki `base`
    değerini `/` yap.
16. Analytics ve dönüşüm olaylarını kur (WhatsApp tıklamaları, form gönderimleri).
17. Google Search Console bağlantısını kur.
18. **KVKK aydınlatma metni ve gizlilik politikası ekle** — özellikle formlar bir
    sunucuya veri göndermeye başlarsa zorunludur.
19. `npm run verify` çalıştır, ardından canlı adres üzerinde
    `npm run check -- --url <adres>` ile son mobil ve performans testlerini yap.

---

## Lisans ve haklar

Kod ve illüstrasyonlar bu konsept çalışmaya aittir. "Shellson" adı ve işletmeye ait
tüm haklar işletmenin kendisine aittir; bu depo işletme adına bir temsil veya
yetkilendirme içermez.

Fontlar SIL Open Font License altındadır (Bricolage Grotesque, Instrument Sans,
DM Mono).
