import { page, breadcrumb } from '../layout.mjs';
import { fmtQty } from '../lib.mjs';
import { hlBlock, itemsTable, cta, itemLink, priceSpan } from '../ui.mjs';

export function render(ctx) {
  const { items, i } = ctx, R = i.routes;
  const bc = breadcrumb(i, [[R.home, i.t('nav_home')], [null, i.t('nav_market')]]);
  const vk = i.L === 'en' ? 'usdCents' : 'lowestBrl';
  const priced = items.filter(x => x.lowestBrl > 0);
  const valuable = items.filter(x => x[vk] > 0).sort((a, b) => b[vk] - a[vk]).slice(0, 6);
  const traded = items.filter(x => x.vol > 0).sort((a, b) => b.vol - a.vol).slice(0, 6);
  const toSell = items.filter(x => x.buyCents && x.buyCount).sort((a, b) => b.buyCents - a.buyCents).slice(0, 6);
  const liquid = items.filter(x => x.buyCount > 0).sort((a, b) => b.buyCount - a.buyCount).slice(0, 6);
  const movers = items.filter(x => x.d7 != null && x.vol >= 3 && x.lowestBrl >= 20);
  const ups = [...movers].sort((a, b) => b.d7 - a.d7).slice(0, 6).filter(x => x.d7 > 0);
  const downs = [...movers].sort((a, b) => a.d7 - b.d7).slice(0, 6).filter(x => x.d7 < 0);
  const rows = [...items].sort((a, b) => (b.lowestBrl ?? -1) - (a.lowestBrl ?? -1));

  const body = `
${bc.html}
<h1>${i.t('mkt_h1')}</h1>
<p class="lead">${i.t('mkt_lead', i.fmtInt(items.length))}</p>
<p class="updated">${i.t('mkt_updated', i.fmtDateTime(ctx.updatedAt))}</p>

<div class="grid c3" style="margin-top:18px">
  ${hlBlock(ctx, i.t('hl_valuable'), valuable, x => priceSpan(ctx, x))}
  ${hlBlock(ctx, i.t('hl_traded'), traded, x => fmtQty(x.vol))}
  ${hlBlock(ctx, i.t('hl_sell'), toSell, x => i.moneySpan(x.buyCents, null))}
  ${hlBlock(ctx, i.t('hl_liquid'), liquid, x => i.fmtInt(x.buyCount))}
  ${hlBlock(ctx, i.t('hl_ups'), ups, x => i.fmtPct(x.d7))}
  ${hlBlock(ctx, i.t('hl_downs'), downs, x => i.fmtPct(x.d7), { cls: 'down' })}
</div>

<h2>${i.t('h_panorama')}</h2>
<p>${i.t('panorama', { n: i.fmtInt(items.length), withVol: i.fmtInt(items.filter(x => x.vol > 0).length), volTotal: i.fmtInt(items.reduce((a, x) => a + x.vol, 0)), cheap: i.fmtInt(priced.filter(x => x.lowestBrl < 100).length), top: valuable[0] ? itemLink(ctx, valuable[0], { icon: false }) : null, topPrice: valuable[0] ? priceSpan(ctx, valuable[0]) : '' })}</p>
<p>${i.t('columns_note', ctx.guideUrl('anuncio-vs-venda-imediata'))}</p>

<h2>${i.t('h_all_items')}</h2>
<div class="controls">
  <input id="mktSearch" type="search" placeholder="${i.t('mkt_search_ph')}">
  <span class="muted" id="mktCount">${i.t('items_n', items.length)}</span>
  <span class="muted" style="font-size:12.5px">${i.t('sort_hint')}</span>
</div>
${itemsTable(ctx, rows, { sort: 'lowest', filter: '#mktSearch', count: '#mktCount', id: 'mktTbl' })}
${cta(ctx)}`;

  return [{ path: R.market.slice(1) + 'index.html', sitemap: { priority: 0.9, changefreq: 'daily' }, html: page({
    i, path: R.market, alt: ctx.altRoute('market'), active: 'market', updatedAt: ctx.updatedAt, jsonld: [bc.ld],
    title: i.t('mkt_title', items.length), description: i.t('mkt_desc', items.length), body }) }];
}
