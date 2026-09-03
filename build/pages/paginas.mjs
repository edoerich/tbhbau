// Páginas institucionais (PT/EN): about, contact, terms, privacy (conteúdo em src/content/<lang>/paginas/index.mjs, pareado por `key`)
import { page, breadcrumb } from '../layout.mjs';
import { esc } from '../lib.mjs';

export function render(ctx) {
  const { i } = ctx, R = i.routes;
  return ctx.paginas.map(p => {
    const url = R[p.key];
    const bc = breadcrumb(i, [[R.home, i.t('nav_home')], [null, p.nav]]);
    return { path: url.slice(1) + 'index.html', sitemap: { priority: 0.4, changefreq: 'monthly' }, html: page({
      i, path: url, alt: ctx.altRoute(p.key), updatedAt: ctx.updatedAt, jsonld: [bc.ld],
      title: `${p.title} · tbhbau`, description: p.description,
      body: `${bc.html}<article class="prose"><h1>${esc(p.title)}</h1>${p.body.replace(/\{\{([\w-]+)\}\}/g, (_, k) => R[k] || ctx.guideUrl(k) || '#')}</article>` }) };
  });
}
