import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import partytown from '@astrojs/partytown';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },
  compressHTML: true,
  site: 'https://www.mattsteele.dev',
  integrations: [partytown({ config: { forward: ['dataLayer.push'] } })],
});