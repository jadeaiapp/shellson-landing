import { defineConfig } from 'vite';

/**
 * GitHub Pages proje sayfası alt dizinde yayınlanır:
 *   https://jadeaiapp.github.io/shellson-landing/
 *
 * Bu yüzden production build'de base path ayarlanır. Yerel geliştirmede
 * kök dizin kullanılır. `BASE_PATH` ortam değişkeniyle ezilebilir
 * (ör. özel alan adına geçildiğinde `BASE_PATH=/` yeterli).
 */
const base = process.env.BASE_PATH ?? (process.env.NODE_ENV === 'production' ? '/shellson-landing/' : '/');

export default defineConfig({
  base,
  build: {
    target: 'es2020',
    cssTarget: 'chrome96',
    assetsInlineLimit: 2048,
    reportCompressedSize: true,
  },
  server: {
    port: 5173,
    host: true,
  },
});
