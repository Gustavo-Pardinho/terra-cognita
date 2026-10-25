// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  /*
   * O endereço canônico governa o sitemap e o robots.txt. Fica em variável de
   * ambiente porque o domínio próprio ainda não existe: enquanto não existir, o
   * valor certo é o endereço da própria plataforma. Declarar um domínio que não
   * resolve serve aos buscadores um sitemap quebrado, pior que não ter sitemap.
   */
  site: process.env.SITE_URL ?? 'https://terra-cognita.gustavo-pardinho.workers.dev',
  integrations: [mdx(), sitemap()],

  /*
   * Sem barra final, de ponta a ponta. Com o padrão (pasta por página) a
   * plataforma devolvia 307 em /atlas para levar a /atlas/, e como todo link
   * interno é escrito sem barra, cada navegação pagava um redirecionamento.
   * `file` emite atlas.html, servido direto em /atlas, e o sitemap passa a
   * declarar a mesma forma que os links usam.
   */
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'auto' },
  markdown: { shikiConfig: { theme: 'github-dark' } },
  vite: {
    // maplibre-gl traz o próprio worker; deixa o Vite pré-empacotar
    optimizeDeps: { include: ['maplibre-gl'] },
  },
});
