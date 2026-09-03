// índice de guias + uma página por guia (conteúdo em src/content/<lang>/guias/*.mjs, pareado por `id`)
import { page, breadcrumb, adUnit } from '../layout.mjs';
import { esc } from '../lib.mjs';
import { cta } from '../ui.mjs';

export function render(ctx) {
  const { guias, i } = ctx, R = i.routes;
  const out = [];
  const bc = breadcrumb(i, [[R.home, i.t('nav_home')], [null, i.t('nav_guides')]]);
  out.push({ path: R.guides.slice(1) + 'index.html', sitemap: { priority: 0.7, changefreq: 'weekly' }, html: page({
    i, path: R.guides, alt: ctx.altRoute('guides'), active: 'guides', updatedAt: ctx.updatedAt, jsonld: [bc.ld],
    title: i.t('guides_title'), description: i.t('guides_desc'),
    body: `
${bc.html}
<h1>${i.t('guides_h1')}</h1>
<p class="lead">${i.t('guides_lead')}</p>
<div class="grid c2">${guias.map(g => `<a class="card" href="${R.guides}${g.slug}/"><h3>${esc(g.title)}</h3><p>${esc(g.summary)}</p></a>`).join('')}</div>
<h2>${i.t('h_guide_data')}</h2>
<p>${i.t('guide_data_p', R.market, R.items, R.bulletin)}</p>
${cta(ctx)}` }) });

  for (const g of guias) {
    const url = `${R.guides}${g.slug}/`;
    const bcG = breadcrumb(i, [[R.home, i.t('nav_home')], [R.guides, i.t('nav_guides')], [null, g.short]]);
    const others = guias.filter(x => x !== g);
    const ld = { '@context': 'https://schema.org', '@type': 'Article', headline: g.title, description: g.description, datePublished: g.date, dateModified: g.date, inLanguage: i.lang,
      author: { '@type': 'Person', name: 'edelrich' }, publisher: { '@type': 'Organization', name: 'tbhbau' }, mainEntityOfPage: 'https://tbhbau.com.br' + url };
    out.push({ path: url.slice(1) + 'index.html', sitemap: { priority: 0.7, changefreq: 'monthly' }, html: page({
      i, path: url, alt: ctx.guideAltUrl(g.id), active: 'guides', updatedAt: ctx.updatedAt, jsonld: [bcG.ld, ld], ogType: 'article',
      title: `${g.title} · tbhbau`, description: g.description,
      body: `
${bcG.html}
<article class="prose">
<h1>${esc(g.title)}</h1>
<p class="muted" style="font-size:13px">${i.t('by', 'edelrich', new Date(g.date).toLocaleDateString(i.L === 'pt' ? 'pt-BR' : 'en-US', { timeZone: 'UTC' }))}</p>
${g.body.replace('{{AD}}', adUnit(i)).replace(/\{\{([\w-]+)\}\}/g, (_, k) => R[k] || ctx.guideUrl(k) || '#')}
</article>
<h2>${i.t('h_read_also')}</h2>
<div class="grid c2">${others.map(o => `<a class="card" href="${R.guides}${o.slug}/"><h3>${esc(o.title)}</h3><p>${esc(o.summary)}</p></a>`).join('')}</div>
${cta(ctx)}` }) });
  }
  return out;
}
