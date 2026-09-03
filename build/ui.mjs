// Componentes HTML reutilizados pelos geradores (PT/EN via ctx.i).
import { esc, RARITY_COLOR, moneyBrl, fmtQty } from './lib.mjs';

export const rarityDot = (i, it) => it.rarity ? `<span class="dot" style="background:#${RARITY_COLOR[it.rarity]}" title="${i.t('grade_of', i.rarity(it.rarity))}"></span>` : '';
export const gradeLabel = (i, it) => it.rarity ? i.rarity(it.rarity) : i.t('grade_material');
export const itemLink = (ctx, it, { icon = true } = {}) =>
  `<a href="${ctx.itemUrl(it)}">${icon && it.icon ? `<img class="ico" src="${esc(it.icon)}" alt="" loading="lazy" width="28" height="28">` : ''}${esc(it.name)}</a>`;
// preço de anúncio com as duas moedas (o seletor da barra troca)
export const priceSpan = (ctx, it, cls = '') => ctx.i.moneySpan(it.lowestBrl, it.usdCents || null, cls);
export const deltaSpan = (i, p) => p == null ? '<span class="muted">—</span>' : `<span class="${p >= 0 ? 'up' : 'down'}">${i.fmtPct(p)}</span>`;
export const liqSpan = (i, it) => it.liquidez ? `<span class="liq ${it.liquidez}">${i.liq(it.liquidez)}${it.buyCount ? ` (${it.buyCount})` : ''}</span>` : '<span class="muted">—</span>';

// Bloco de destaque: lista curta de itens com um valor à direita
export function hlBlock(ctx, title, items, valFn, { cls = '' } = {}) {
  if (!items.length) return '';
  return `<div class="hl"><h3>${title}</h3>${items.map(x =>
    `<a class="row" href="${ctx.itemUrl(x)}">${x.icon ? `<img src="${esc(x.icon)}" alt="" loading="lazy" width="22" height="22">` : ''}<span class="nm">${esc(x.name)}</span><span class="vl ${cls}">${valFn(x)}</span></a>`).join('')}</div>`;
}

const COLS = {
  name: { th: 'th_item', k: 'name', str: true, td: (ctx, x) => `<td data-q>${itemLink(ctx, x)}</td>`, v: x => x.name },
  type: { th: 'th_type', k: 'type', str: true, td: (ctx, x) => `<td><a href="${ctx.typeUrl(x.typeBase)}" class="muted">${esc(ctx.i.typeName(x.typeBase))}</a>${x.lvl ? ` <span class="muted">${ctx.i.t('lvl', x.lvl)}</span>` : ''}</td>`, v: (x, ctx) => `${ctx.i.typeName(x.typeBase)} ${String(x.lvl || 0).padStart(3, '0')}` },
  grade: { th: 'th_grade', k: 'grade', str: true, td: (ctx, x) => `<td style="white-space:nowrap">${rarityDot(ctx.i, x)}${gradeLabel(ctx.i, x)}</td>`, v: (x, ctx) => gradeLabel(ctx.i, x) },
  lvl: { th: 'th_lvl', k: 'lvl', num: true, td: (ctx, x) => `<td class="num">${x.lvl ?? '—'}</td>`, v: x => x.lvl ?? '' },
  lowest: { th: 'th_lowest', k: 'lowest', num: true, td: (ctx, x) => `<td class="num">${priceSpan(ctx, x)}</td>`, v: (x, ctx) => x[ctx.vk] ?? '' },
  median: { th: 'th_median', k: 'median', num: true, td: (ctx, x) => `<td class="num">${x.medianCents != null ? ctx.i.moneySpan(x.medianCents, null) : '<span class="muted">—</span>'}</td>`, v: x => x.medianCents ?? '' },
  buy: { th: 'th_buy', k: 'buy', num: true, td: (ctx, x) => `<td class="num">${x.buyCount && x.buyCents != null ? ctx.i.moneySpan(x.buyCents, null) : `<span class="muted">${ctx.i.t('no_order')}</span>`}</td>`, v: x => (x.buyCount && x.buyCents != null) ? x.buyCents : '' },
  vol: { th: 'th_vol', k: 'vol', num: true, td: (ctx, x) => `<td class="num">${x.vol ? fmtQty(x.vol) : '<span class="muted">—</span>'}</td>`, v: x => x.vol || '' },
  spread: { th: 'th_spread', k: 'spread', num: true, td: (ctx, x) => `<td class="num">${x.spread != null ? moneyBrl(x.spread) : '<span class="muted">—</span>'}</td>`, v: x => x.spread ?? '' },
  liq: { th: 'th_liq', k: 'liq', num: true, td: (ctx, x) => `<td>${liqSpan(ctx.i, x)}</td>`, v: x => x.buyCount || 0 },
  d7: { th: 'th_d7', k: 'd7', num: true, td: (ctx, x) => `<td class="num">${deltaSpan(ctx.i, x.d7)}</td>`, v: x => x.d7 ?? '' },
};

// Tabela estática ordenável (common.js cuida do clique/filtro via data-*)
export function itemsTable(ctx, items, { cols = ['name', 'type', 'grade', 'lowest', 'median', 'buy', 'vol', 'liq', 'd7'], sort = 'lowest', filter = null, count = null, id = '' } = {}) {
  const cs = cols.map(c => COLS[c]);
  const attrs = [`class="sortable"`, `data-sort="${sort}"`, filter ? `data-filter="${filter}"` : '', count ? `data-count="${count}"` : '', id ? `id="${id}"` : ''].filter(Boolean).join(' ');
  const head = cs.map(c => `<th data-k="${c.k}" class="${c.num ? 'num' : ''}${c.str ? ' str' : ''}${c.k === sort ? ' sorted' : ''}">${ctx.i.t(c.th)}</th>`).join('');
  const rows = items.map(x => {
    const data = cs.map(c => `data-${c.k}="${esc(c.v(x, ctx))}"`).join(' ');
    return `<tr ${data} data-q="${esc(x.name.toLowerCase())}">${cs.map(c => c.td(ctx, x)).join('')}</tr>`;
  }).join('\n');
  return `<div class="tablewrap"><table ${attrs}><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

// FAQ com JSON-LD
export function faq(qas) {
  const html = qas.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${a}</p></details>`).join('');
  const ld = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: qas.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })) };
  return { html, ld };
}

export const cta = ctx => `<div class="card" style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-top:28px">
  <div style="flex:1;min-width:240px"><b>${ctx.i.t('cta_title')}</b><div class="muted" style="font-size:14px">${ctx.i.t('cta_desc')}</div></div>
  <a class="btn" href="${ctx.i.route('evaluator')}">${ctx.i.t('cta_btn')}</a></div>`;
