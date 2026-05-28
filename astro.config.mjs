// @ts-check
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const astroPrerenderEntrypoint = fileURLToPath(
  new URL('./node_modules/astro/dist/entrypoints/prerender.js', import.meta.url)
);

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [
      {
        name: 'resolve-astro-prerender-entrypoint',
        resolveId(id) {
          if (id === 'astro/entrypoints/prerender') {
            return astroPrerenderEntrypoint;
          }
        }
      },
      tailwindcss()
    ]
  }
});
