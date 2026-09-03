// Páginas institucionais: /sobre/, /contato/, /termos/, /privacidade/ (conteúdo em src/content/paginas/index.mjs)
import { page, breadcrumb } from '../layout.mjs';
import { esc } from '../lib.mjs';

export function render(ctx) {
  return ctx.paginas.map(p => {
    const bc = breadcrumb([['/', 'Início'], [null, p.nav]]);
    return { path: `${p.slug}/index.html`, sitemap: { priority: 0.4, changefreq: 'monthly' }, html: page({
      path: `/${p.slug}/`, updatedAt: ctx.updatedAt, jsonld: [bc.ld],
      title: `${p.title} · tbhbau`, description: p.description,
      body: `${bc.html}<article class="prose"><h1>${esc(p.title)}</h1>${p.body}</article>` }) };
  });
}
