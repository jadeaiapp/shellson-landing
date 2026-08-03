import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * GitHub Pages alt dizininde yayınlanır:
 *   https://jadeaiapp.github.io/shellson-landing/
 *
 * base bu yüzden '/shellson-landing/'. Yerel geliştirmede ve önizlemede de
 * aynı yol kullanılır ki canlıdan farklı davranmasın.
 * Farklı bir yola kurulum için: BASE_PATH=/baska-yol/ npm run build
 */
const base = process.env.BASE_PATH ?? '/shellson-landing/';

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    assetsInlineLimit: 2048,
    reportCompressedSize: true,
  },
});
