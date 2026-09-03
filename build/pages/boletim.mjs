// boletim semanal automático (PT/EN), regerado a cada build
import { page, breadcrumb, adUnit } from '../layout.mjs';
import { fmtQty, netCents } from '../lib.mjs';
import { itemLink, deltaSpan, liqSpan, cta, priceSpan } from '../ui.mjs';

export function render(ctx) {
  const { items, histCount, i } = ctx, R = i.routes;
  const bc = breadcrumb(i, [[R.home, i.t('nav_home')], [null, i.t('bul_crumb')]]);
  const week = i.fmtDateLong(ctx.now);
  const movers = items.filter(x => x.d7 != null && x.vol >= 3 && x.lowestBrl >= 20);
  const ups = [...movers].sort((a, b) => b.d7 - a.d7).slice(0, 10).filter(x => x.d7 > 0);
  const downs = [...movers].sort((a, b) => a.d7 - b.d7).slice(0, 10).filter(x => x.d7 < 0);
  const traded = items.filter(x => x.vol > 0).sort((a, b) => b.vol - a.vol).slice(0, 10);
  const toSell = items.filter(x => x.buyCents && x.buyCount >= 10).sort((a, b) => b.buyCents - a.buyCents).slice(0, 10);
  const valuable = items.filter(x => x.lowestBrl > 0).sort((a, b) => b.lowestBrl - a.lowestBrl).slice(0, 10);
  const byType = new Map();
  for (const x of items) byType.set(x.typeBase, (byType.get(x.typeBase) || 0) + x.vol);
  const topTypes = [...byType.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const table = (list, cols) => list.length ? `<div class="tablewrap"><table><thead><tr><th class="num">#</th>${cols.map(c => `<th class="${c.num ? 'num' : ''}">${c.th}</th>`).join('')}</tr></thead><tbody>${list.map((x, n) => `<tr><td class="num muted">${n + 1}</td>${cols.map(c => `<td class="${c.num ? 'num' : ''}">${c.td(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : `<p class="muted">${i.t('empty_list')}</p>`;
  const cName = { th: i.t('th_item'), td: x => `${itemLink(ctx, x)} <span class="muted" style="font-size:12px">${x.isMaterial ? i.typeName(x.typeBase) : `${i.rarity(x.rarity)} ${i.t('lvl', x.lvl)}`}</span>` };
  const cPrice = { th: i.t('th_lowest'), num: true, td: x => priceSpan(ctx, x) };
  const cD7 = { th: i.t('th_d7'), num: true, td: x => deltaSpan(i, x.d7) };
  const cVol = { th: i.t('th_vol'), num: true, td: x => fmtQty(x.vol) };
  const cBuy = { th: i.t('th_buy'), num: true, td: x => i.moneySpan(x.buyCents, null) };
  const cNet = { th: i.t('th_net'), num: true, td: x => i.moneySpan(netCents(x.buyCents), null) };
  const cLiq = { th: i.t('th_liq'), td: x => liqSpan(i, x) };
  const upsN = movers.filter(x => x.d7 > 0).length, downsN = movers.filter(x => x.d7 < 0).length;

  const body = `
${bc.html}
<h1>${i.t('bul_h1')}</h1>
<p class="lead">${i.t('bul_lead', week)}</p>
<p class="updated">${i.t('bul_generated', i.fmtDateTime(ctx.updatedAt), histCount ? i.fmtInt(histCount) : null)}</p>

<h2>${i.t('h_summary')}</h2>
<div class="prose">
<p>${i.t('bul_s1', { n: i.fmtInt(items.length), withVol: i.fmtInt(items.filter(x => x.vol > 0).length), volTotal: i.fmtInt(items.reduce((a, x) => a + x.vol, 0)), withBuy: i.fmtInt(items.filter(x => x.buyCount > 0).length), topTypes: topTypes.length ? topTypes.map(([t, v]) => `${i.typeName(t, true).toLowerCase()} (${i.fmtInt(v)})`).join(', ') : null })}</p>
<p>${movers.length ? i.t('bul_s2', { movers: i.fmtInt(movers.length), upsN: i.fmtInt(upsN), downsN: i.fmtInt(downsN), up: ups[0] && itemLink(ctx, ups[0], { icon: false }), upPct: ups[0] && i.fmtPct(ups[0].d7), upPrice: ups[0] && priceSpan(ctx, ups[0]), down: downs[0] && itemLink(ctx, downs[0], { icon: false }), downPct: downs[0] && i.fmtPct(downs[0].d7), downPrice: downs[0] && priceSpan(ctx, downs[0]) }) : i.t('bul_s2_none')}</p>
${toSell[0] ? `<p>${i.t('bul_s3', { link: itemLink(ctx, toSell[0], { icon: false }), buy: i.moneySpan(toSell[0].buyCents, null), net: i.moneySpan(netCents(toSell[0].buyCents), null), evalUrl: R.evaluator })}</p>` : ''}
</div>

<h2>${i.t('h_ups')}</h2>
<p class="muted" style="font-size:13px">${i.t('ups_note')}</p>
${table(ups, [cName, cPrice, cD7, cVol])}
<h2>${i.t('h_downs')}</h2>
${table(downs, [cName, cPrice, cD7, cVol])}
${adUnit(i)}
<h2>${i.t('h_traded')}</h2>
${table(traded, [cName, cVol, cPrice, cLiq])}
<h2>${i.t('h_sell')}</h2>
<p class="muted" style="font-size:13px">${i.t('sell_note')}</p>
${table(toSell, [cName, cBuy, cNet, cLiq])}
<h2>${i.t('h_valuable')}</h2>
${table(valuable, [cName, cPrice, cD7, cLiq])}
<p class="muted" style="font-size:13.5px;margin-top:20px">${i.t('bul_read', ctx.guideUrl('anuncio-vs-venda-imediata'), ctx.guideUrl('grades-raridades'), R.market)}</p>
${cta(ctx)}`;

  return [{ path: R.bulletin.slice(1) + 'index.html', sitemap: { priority: 0.8, changefreq: 'daily' }, html: page({
    i, path: R.bulletin, alt: ctx.altRoute('bulletin'), active: 'bulletin', updatedAt: ctx.updatedAt, jsonld: [bc.ld], ogType: 'article',
    title: i.t('bul_title', week), description: i.t('bul_desc'), body }) }];
}
