import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  prefetch: true,
  vite: {
    plugins: [tailwindcss()]
  },
  compressHTML: true,
  site: 'https://www.mattsteele.dev',
  integrations: [sitemap({
    filter: (page) => !page.includes('/work') && !page.includes('/resume'),
  })],
});