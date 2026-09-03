import { page } from '../layout.mjs';
import { esc, fmtQty } from '../lib.mjs';
import { hlBlock, faq, itemLink, priceSpan } from '../ui.mjs';

export function render(ctx) {
  const { items, guias, i } = ctx;
  const R = i.routes;
  // EN mostra US$ por padrão, então ranqueia pelo preço em dólar; PT pelo preço em reais
  const vk = i.L === 'en' ? 'usdCents' : 'lowestBrl';
  const priced = items.filter(x => x[vk] > 0);
  const valuable = [...priced].sort((a, b) => b[vk] - a[vk]).slice(0, 6);
  const traded = items.filter(x => x.vol > 0).sort((a, b) => b.vol - a.vol).slice(0, 6);
  const toSell = items.filter(x => x.buyCents && x.buyCount).sort((a, b) => b.buyCents - a.buyCents).slice(0, 6);
  const movers = items.filter(x => x.d7 != null && x.vol >= 3 && x.lowestBrl >= 20);
  const ups = [...movers].sort((a, b) => b.d7 - a.d7).slice(0, 6).filter(x => x.d7 > 0);
  const downs = [...movers].sort((a, b) => a.d7 - b.d7).slice(0, 6).filter(x => x.d7 < 0);
  const volTotal = items.reduce((a, x) => a + x.vol, 0);
  const row = (label, v) => `<div class="row"><span>${label}</span><span class="v">${v}</span></div>`;

  const side = `<div class="side">
    <div class="k">${i.t('side_title', i.fmtDateLong(ctx.now))}</div>
    ${row(i.t('side_items'), i.fmtInt(items.length))}
    ${row(i.t('side_units'), i.fmtInt(volTotal))}
    ${valuable[0] ? row(i.t('side_top', itemLink(ctx, valuable[0], { icon: false })), priceSpan(ctx, valuable[0])) : ''}
    ${traded[0] ? row(i.t('side_traded', itemLink(ctx, traded[0], { icon: false })), fmtQty(traded[0].vol) + '/24h') : ''}
    ${ups[0] ? row(i.t('side_up', itemLink(ctx, ups[0], { icon: false })), i.fmtPct(ups[0].d7)) : ''}
    ${downs[0] ? `<div class="row"><span>${i.t('side_down', itemLink(ctx, downs[0], { icon: false }))}</span><span class="v down">${i.fmtPct(downs[0].d7)}</span></div>` : ''}
    <div style="margin-top:10px;font-size:13px"><a href="${R.bulletin}">${i.t('side_bulletin')}</a></div>
  </div>`;

  const f = faq(i.t('faq'));
  const body = `
<section class="hero">
  <div>
    <h1>${i.t('home_h1')}</h1>
    <p class="lead">${i.t('home_lead', i.fmtInt(items.length))}</p>
    <div class="ctas"><a class="btn" href="${R.evaluator}">${i.t('home_cta_eval')}</a><a class="btn ghost" href="${R.market}">${i.t('home_cta_market')}</a></div>
  </div>
  ${side}
</section>

<h2>${i.t('h_highlights')}</h2>
<div class="grid c3">
  ${hlBlock(ctx, i.t('hl_valuable'), valuable, x => priceSpan(ctx, x))}
  ${hlBlock(ctx, i.t('hl_traded'), traded, x => fmtQty(x.vol))}
  ${hlBlock(ctx, i.t('hl_sell'), toSell, x => i.moneySpan(x.buyCents, null))}
  ${hlBlock(ctx, i.t('hl_ups'), ups, x => i.fmtPct(x.d7))}
  ${hlBlock(ctx, i.t('hl_downs'), downs, x => i.fmtPct(x.d7), { cls: 'down' })}
</div>
<p class="muted" style="font-size:13px;margin-top:8px">${i.t('hl_note', R.market, R.items)}</p>

<h2>${i.t('h_guides')}</h2>
<div class="grid c3">
  ${guias.map(g => `<a class="card" href="${R.guides}${g.slug}/"><h3>${esc(g.short)}</h3><p>${esc(g.summary)}</p></a>`).join('')}
</div>

<h2>${i.t('h_how')}</h2>
<div class="grid c3 steps">
  ${i.t('steps').map(([h, p]) => `<div class="card"><h3>${h}</h3><p>${p}</p></div>`).join('')}
</div>
<p style="margin-top:12px"><a class="btn" href="${R.evaluator}">${i.t('go_eval')}</a></p>

<h2>${i.t('h_faq')}</h2>
${f.html}
<p class="muted" style="margin-top:20px;font-size:14px">${i.t('about_note', R.about)}</p>`;

  const ld = [{ '@context': 'https://schema.org', '@type': 'WebSite', name: 'tbhbau', url: 'https://tbhbau.com.br' + R.home, description: i.t('site_desc'), inLanguage: i.lang }, f.ld];
  return [{ path: R.home.slice(1) + 'index.html', sitemap: { priority: 1.0, changefreq: 'daily' }, html: page({
    i, path: R.home, alt: ctx.altRoute('home'), active: 'home', updatedAt: ctx.updatedAt, jsonld: ld,
    title: i.t('home_title'), description: i.t('home_desc', items.length), body }) }];
}
