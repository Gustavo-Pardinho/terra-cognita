// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://terracognita.org',
  integrations: [mdx()],
  markdown: { shikiConfig: { theme: 'github-dark' } },
  build: { inlineStylesheets: 'auto' },
  vite: {
    // maplibre-gl traz o próprio worker; deixa o Vite pré-empacotar
    optimizeDeps: { include: ['maplibre-gl'] },
  },
});
