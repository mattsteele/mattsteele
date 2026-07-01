import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  prefetch: true,
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: 'lightningcss'
    }
  },
  compressHTML: true,
  site: 'https://mattsteele.dev',
  build: {
    inlineStylesheets: 'auto'
  },
  integrations: [sitemap({
    filter: (page) => !page.includes('/work') && !page.includes('/resume'),
  })],
});