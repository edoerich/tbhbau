// /guias/ (índice) + /guias/<slug>/ (cada guia; conteúdo em src/content/guias/*.mjs)
import { page, breadcrumb, adUnit } from '../layout.mjs';
import { esc } from '../lib.mjs';
import { cta } from '../ui.mjs';

export function render(ctx) {
  const { guias } = ctx;
  const out = [];
  const bc = breadcrumb([['/', 'Início'], [null, 'Guias']]);
  out.push({ path: 'guias/index.html', sitemap: { priority: 0.7, changefreq: 'weekly' }, html: page({
    path: '/guias/', active: '/guias/', updatedAt: ctx.updatedAt, jsonld: [bc.ld],
    title: 'Guias do TBH: vender no Mercado Steam, estratégias e raridades · tbhbau',
    description: 'Guias práticos sobre o TBH: Task Bar Hero e o Mercado da Steam: como vender itens, anúncio vs venda imediata, grades e raridades, taxa da Steam e a janela de 4 itens a cada 8 horas.',
    body: `
${bc.html}
<h1>Guias do TBH e do Mercado Steam</h1>
<p class="lead">Tudo o que você precisa para entender e aproveitar ao máximo o valor do seu baú no <b>TBH: Task Bar Hero</b>.</p>
<div class="grid c2">${guias.map(g => `<a class="card" href="/guias/${g.slug}/"><h3>${esc(g.title)}</h3><p>${esc(g.summary)}</p></a>`).join('')}</div>
<h2>Dados que acompanham os guias</h2>
<p>Os guias usam os mesmos números do resto do site: o <a href="/mercado/">mercado completo</a>, as <a href="/itens/">páginas de cada item</a> com histórico e order book, e o <a href="/boletim/">boletim semanal</a> com altas, quedas e melhores vendas.</p>
${cta()}` }) });

  for (const g of guias) {
    const bcG = breadcrumb([['/', 'Início'], ['/guias/', 'Guias'], [null, g.short]]);
    const others = guias.filter(x => x !== g);
    const ld = { '@context': 'https://schema.org', '@type': 'Article', headline: g.title, description: g.description, datePublished: g.date, dateModified: g.date, inLanguage: 'pt-BR',
      author: { '@type': 'Person', name: 'edelrich' }, publisher: { '@type': 'Organization', name: 'tbhbau' }, mainEntityOfPage: `https://tbhbau.com.br/guias/${g.slug}/` };
    out.push({ path: `guias/${g.slug}/index.html`, sitemap: { priority: 0.7, changefreq: 'monthly' }, html: page({
      path: `/guias/${g.slug}/`, active: '/guias/', updatedAt: ctx.updatedAt, jsonld: [bcG.ld, ld], ogType: 'article',
      title: `${g.title} · tbhbau`, description: g.description,
      body: `
${bcG.html}
<article class="prose">
<h1>${esc(g.title)}</h1>
<p class="muted" style="font-size:13px">Por edelrich · ${new Date(g.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
${g.body.replace('{{AD}}', adUnit())}
</article>
<h2>Leia também</h2>
<div class="grid c2">${others.map(o => `<a class="card" href="/guias/${o.slug}/"><h3>${esc(o.title)}</h3><p>${esc(o.summary)}</p></a>`).join('')}</div>
${cta()}` }) });
  }
  return out;
}
