import type { APIRoute } from 'astro';

/**
 * Gerado em vez de estático para seguir o endereço canônico de `site`
 * (astro.config.mjs). Um Sitemap apontando para domínio que não resolve é pior
 * que nenhum: os buscadores tratam como configuração quebrada.
 */
export const GET: APIRoute = ({ site }) => {
  const corpo = [
    '# Terra Cognita — atlas de estudo do mundo',
    'User-agent: *',
    'Allow: /',
    '',
    site ? `Sitemap: ${new URL('sitemap-index.xml', site).href}` : '',
  ].join('\n');

  return new Response(corpo, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
