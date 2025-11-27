import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import partytown from '@astrojs/partytown';

export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss()]
  },
  compressHTML: true,
  site: 'https://www.mattsteele.dev',
  integrations: [partytown({ config: { forward: ['dataLayer.push'] } })],
});