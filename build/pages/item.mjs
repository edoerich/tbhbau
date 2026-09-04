// Uma página estática por item (PT/EN): preço, texto gerado, histórico (SVG), order book ao vivo (JS), relacionados.
import { page, breadcrumb, adUnit } from '../layout.mjs';
import { esc, moneyBrl, money, fmtQty, netCents, RARITY_PT, steamUrl, chartSvg } from '../lib.mjs';
import { itemLink, rarityDot, deltaSpan, priceSpan, slot } from '../ui.mjs';

export function render(ctx) {
  const { items, byFamily, types, i } = ctx, R = i.routes;
  const out = [];
  for (const it of items) {
    const tipoPl = i.typeName(it.typeBase, true), tipo = i.typeName(it.typeBase), f = i.typeFem(it.typeBase);
    const bc = breadcrumb(i, [[R.home, i.t('nav_home')], [R.items, i.t('nav_items')], [ctx.typeUrl(it.typeBase), tipoPl], [null, it.name]]);
    const h = it.h;
    const hasBuy = !!(it.buyCount && it.buyCents != null);
    const spreadN = (it.spread != null && it.minSellCents) ? it.spread / ((it.minSellCents + it.buyCents) / 2) * 100 : null;
    const o = {
      name: esc(it.name), type: tipo, rarity: i.rarity(it.rarity), f,
      brl: it.lowestBrl != null ? moneyBrl(it.lowestBrl) : null, usd: it.usdCents ? money(it.usdCents, 'usd') : null,
      median: it.medianCents != null ? moneyBrl(it.medianCents) : null,
      hasBuy, buyCount: i.fmtInt(it.buyCount || 0), buy: hasBuy ? moneyBrl(it.buyCents) : null, net: hasBuy ? moneyBrl(netCents(it.buyCents)) : null, liq: i.liq(it.liquidez),
      spread: it.spread != null ? moneyBrl(it.spread) : null, spreadN, spreadPct: spreadN != null ? (i.L === 'pt' ? spreadN.toFixed(1).replace('.', ',') : spreadN.toFixed(1)) : null,
      vol: i.fmtInt(it.vol), evalUrl: R.evaluator,
      h: h && h.n >= 2, first: h && i.fmtDate(h.first), n: h && i.fmtInt(h.n),
      d7: (h && h.s7) ? it.d7 : null, d7abs: it.d7 != null ? i.fmtPct(Math.abs(it.d7)).replace('+', '') : null, ask7: h && h.s7 && moneyBrl(h.s7.ask0), min7: h && h.s7 && moneyBrl(h.s7.min), max7: h && h.s7 && moneyBrl(h.s7.max),
      d30: (h && h.s30 && it.d30 != null && h.s30.n > (h.s7?.n || 0)) ? it.d30 : null, d30s: it.d30 != null ? i.fmtPct(it.d30) : null, min30: h && h.s30 && moneyBrl(h.s30.min), max30: h && h.s30 && moneyBrl(h.s30.max), volAvg: h && h.s30 && h.s30.volAvg ? i.fmtInt(h.s30.volAvg) : null,
    };
    const family = (byFamily.get(it.family) || []).filter(x => x !== it).sort((a, b) => (a.lvl || 0) - (b.lvl || 0) || (a.lowestBrl ?? 0) - (b.lowestBrl ?? 0));
    const sameType = (types.get(it.typeBase) || []).filter(x => x !== it && !family.includes(x));
    const sameLvl = sameType.filter(x => x.lvl === it.lvl && x.rarity === it.rarity).slice(0, 6);
    const typeTop = sameType.filter(x => !sameLvl.includes(x)).sort((a, b) => (b[ctx.vk] ?? -1) - (a[ctx.vk] ?? -1)).slice(0, 6);
    const relList = (title, list, val) => list.length ? `<div class="card"><h3>${title}</h3><ul class="list">${list.map(x => `<li>${itemLink(ctx, x, { icon: false })}<span class="v">${val(x)}</span></li>`).join('')}</ul></div>` : '';
    const subt = x => x.isMaterial ? priceSpan(ctx, x) : `${x.rarity ? i.rarity(x.rarity) : ''} ${i.t('lvl', x.lvl)} · ${priceSpan(ctx, x)}`;

    const stats = `<div class="stats">
      <div class="stat"><div class="k">${i.t('k_lowest')}</div><div class="v">${priceSpan(ctx, it)}</div><div class="s">${i.t('s_lowest')}${it.usdCents && it.lowestBrl != null ? ` · ${i.L === 'en' ? moneyBrl(it.lowestBrl) : money(it.usdCents, 'usd')}` : ''}</div></div>
      <div class="stat"><div class="k">${i.t('k_median')}</div><div class="v">${o.median || '—'}</div><div class="s">${i.t('s_median')}</div></div>
      <div class="stat green"><div class="k">${i.t('k_buy')}</div><div class="v big" data-live="bid">${o.buy || '—'}</div><div class="s">${i.t('s_buy')} <span class="ok hidden" data-live-badge>${i.t('live')}</span></div></div>
      <div class="stat"><div class="k">${i.t('k_net')}</div><div class="v" data-live="net">${o.net || '—'}</div><div class="s">${i.t('s_net')}</div></div>
      <div class="stat"><div class="k">${i.t('k_liq')}</div><div class="v"><span data-live="buyCount">${it.buyCount ? i.fmtInt(it.buyCount) : '0'}</span></div><div class="s">${i.t('s_liq', o.liq)}</div></div>
      <div class="stat"><div class="k">${i.t('k_vol')}</div><div class="v">${it.vol ? i.fmtInt(it.vol) : '0'}</div><div class="s">${i.t('s_vol')}</div></div>
      <div class="stat"><div class="k">${i.t('k_spread')}</div><div class="v" data-live="spread" style="font-size:17px">${o.spread || '—'}</div><div class="s">${i.t('s_spread')}</div></div>
      <div class="stat"><div class="k">${i.t('k_d7')}</div><div class="v">${deltaSpan(i, it.d7)}</div><div class="s">${it.d30 != null ? i.t('s_d30', i.fmtPct(it.d30)) : i.t('s_d7')}</div></div>
    </div>`;

    const chart = h && h.series && h.series.length >= 2
      ? `<div class="chart-title"><span>${i.t('chart_title')}</span><span class="muted">${i.t('chart_meta', h.series.length, i.fmtDate(h.first))}</span></div>${chartSvg(h.series, { fmtDate: i.fmtDate, alt: i.t('chart_alt') })}<div id="liveChart"></div>`
      : `<div class="chart-empty">${i.t('chart_empty')}</div><div id="liveChart"></div>`;

    const body = `
${bc.html}
<div class="item-head">
  ${slot(it, 'lg')}
  <div>
    <h1>${esc(it.name)}</h1>
    <div class="item-meta">${rarityDot(i, it)}<span>${it.isMaterial ? esc(tipo) : i.t('item_meta_eq', o.rarity, `<a href="${ctx.typeUrl(it.typeBase)}">${esc(tipo)}</a>`, it.lvl)}</span><span>·</span><a href="${steamUrl(it.hash)}" target="_blank" rel="noopener">${i.t('modal_steam')}</a></div>
  </div>
</div>
${stats}
<p class="updated">${i.t('item_updated', i.fmtDateTime(ctx.updatedAt))}</p>

<div class="item-grid">
  <div>
    <h2>${i.t('h_price')}</h2>
    <div class="prose">${i.t('prose', it, o).map(x => `<p>${x}</p>`).join('\n')}</div>
    <h2>${i.t('h_history')}</h2>
    ${chart}
    <h2>${i.t('h_ob')}</h2>
    <p class="muted" style="font-size:13px;margin:0 0 8px">${i.t('ob_note')}</p>
    <div id="liveOb" data-hash="${encodeURIComponent(it.hash)}"><div class="muted" style="padding:18px;text-align:center">${i.t('ob_loading')}</div></div>
    ${it.ad ? adUnit(i) : ''}
    <h2>${i.t('h_how_sell', f)}</h2>
    <div class="prose"><ul>${i.t('tips', it, o).map(x => `<li>${x}</li>`).join('')}</ul></div>
    <p class="muted" style="font-size:13.5px">${i.t('read_also', ctx.guideUrl('como-vender'), ctx.guideUrl('anuncio-vs-venda-imediata'), ctx.guideUrl('grades-raridades'))}</p>
  </div>
  <aside class="aside">
    ${relList(i.t('rel_family', esc(it.family)), family, subt)}
    ${relList(i.t('rel_same', esc(tipoPl), it.rarity ? i.rarity(it.rarity) : '', it.lvl || ''), sameLvl, x => priceSpan(ctx, x))}
    ${relList(i.t('rel_top', esc(tipoPl)), typeTop, subt)}
    <div class="card"><h3>${i.t('tools')}</h3><ul class="list"><li><a href="${R.evaluator}">${i.t('tool_eval')}</a></li><li><a href="${R.market}">${i.t('tool_market')}</a></li><li><a href="${ctx.typeUrl(it.typeBase)}">${i.t('tool_all', esc(tipoPl))}</a></li><li><a href="${R.bulletin}">${i.t('tool_bulletin')}</a></li></ul></div>
  </aside>
</div>`;

    const dso = { name: it.name, type: tipo, rarity: o.rarity, lvl: it.lvl, price: i.price(it), buy: o.buy, vol: it.vol ? i.fmtInt(it.vol) : null };
    out.push({ path: ctx.itemUrl(it).slice(1) + 'index.html', sitemap: it.indexable ? { priority: it.ad ? 0.6 : 0.4, changefreq: 'daily' } : null, html: page({
      i, path: ctx.itemUrl(it), alt: ctx.itemAltUrl(it), active: 'items', updatedAt: ctx.updatedAt, noindex: !it.indexable, jsonld: [bc.ld], ogType: 'article',
      title: i.t('item_title', it.name), description: it.isMaterial ? i.t('item_desc_mat', dso) : i.t('item_desc_eq', dso), body }) });
  }
  return out;
}
