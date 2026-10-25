// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  /*
   * O endereço canônico governa o sitemap e o robots.txt. Fica em variável de
   * ambiente porque o domínio próprio ainda não existe: enquanto não existir, o
   * valor certo é o do Cloudflare Pages. Declarar um domínio que não resolve
   * serve aos buscadores um sitemap quebrado, o que é pior que não ter sitemap.
   */
  site: process.env.SITE_URL ?? 'https://terra-cognita.pages.dev',
  integrations: [mdx(), sitemap()],
  markdown: { shikiConfig: { theme: 'github-dark' } },
  build: { inlineStylesheets: 'auto' },
  vite: {
    // maplibre-gl traz o próprio worker; deixa o Vite pré-empacotar
    optimizeDeps: { include: ['maplibre-gl'] },
  },
});
