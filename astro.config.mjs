// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://terracognita.org',
  integrations: [mdx(), sitemap()],
  markdown: { shikiConfig: { theme: 'github-dark' } },
  build: { inlineStylesheets: 'auto' },
  vite: {
    // maplibre-gl traz o próprio worker; deixa o Vite pré-empacotar
    optimizeDeps: { include: ['maplibre-gl'] },
  },
});
