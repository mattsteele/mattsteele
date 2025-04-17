// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import partytown from '@astrojs/partytown';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  site: 'https://www.mattsteele.dev',
  integrations: [partytown({ config: { forward: ['dataLayer.push'] } })],
});