// Componentes HTML reutilizados pelos geradores de página.
import { esc, RARITY_PT, RARITY_COLOR, moneySpan, moneyBrl, money, fmtQty, fmtPct, liqLabel, typePt } from './lib.mjs';

export const rarityDot = it => it.rarity ? `<span class="dot" style="background:#${RARITY_COLOR[it.rarity]}" title="Grade ${RARITY_PT[it.rarity]}"></span>` : '';
export const gradeLabel = it => it.rarity ? RARITY_PT[it.rarity] : 'Material';
export const itemLink = (ctx, it, { icon = true } = {}) =>
  `<a href="${ctx.itemUrl(it)}">${icon && it.icon ? `<img class="ico" src="${esc(it.icon)}" alt="" loading="lazy" width="28" height="28">` : ''}${esc(it.name)}</a>`;
export const priceOf = x => x.lowestBrl != null ? moneyBrl(x.lowestBrl) : (x.usdCents ? money(x.usdCents, 'usd') : '—');
export const deltaSpan = p => p == null ? '<span class="muted">—</span>' : `<span class="${p >= 0 ? 'up' : 'down'}">${fmtPct(p)}</span>`;
export const liqSpan = it => it.liquidez ? `<span class="liq ${it.liquidez}">${liqLabel[it.liquidez]}${it.buyCount ? ` (${it.buyCount})` : ''}</span>` : '<span class="muted">—</span>';

// Bloco de destaque: lista curta de itens com um valor à direita
export function hlBlock(ctx, title, items, valFn, { cls = '' } = {}) {
  if (!items.length) return '';
  return `<div class="hl"><h3>${title}</h3>${items.map(i =>
    `<a class="row" href="${ctx.itemUrl(i)}">${i.icon ? `<img src="${esc(i.icon)}" alt="" loading="lazy" width="22" height="22">` : ''}<span class="nm">${esc(i.name)}</span><span class="vl ${cls}">${valFn(i)}</span></a>`).join('')}</div>`;
}

// Colunas disponíveis para a tabela de itens
const COLS = {
  name: { th: 'Item', k: 'name', str: true, td: (ctx, i) => `<td data-q>${itemLink(ctx, i)}</td>`, v: i => i.name },
  type: { th: 'Tipo', k: 'type', str: true, td: (ctx, i) => `<td><a href="${ctx.typeUrl(i.typeBase)}" class="muted">${esc(typePt(i.typeBase))}</a>${i.lvl ? ` <span class="muted">Lv. ${i.lvl}</span>` : ''}</td>`, v: i => `${typePt(i.typeBase)} ${String(i.lvl || 0).padStart(3, '0')}` },
  grade: { th: 'Grade', k: 'grade', str: true, td: (ctx, i) => `<td style="white-space:nowrap">${rarityDot(i)}${gradeLabel(i)}</td>`, v: i => gradeLabel(i) },
  lvl: { th: 'Nível', k: 'lvl', num: true, td: (ctx, i) => `<td class="num">${i.lvl ?? '—'}</td>`, v: i => i.lvl ?? '' },
  lowest: { th: 'Menor venda', k: 'lowest', num: true, td: (ctx, i) => `<td class="num">${moneySpan(i.lowestBrl, i.usdCents || null)}</td>`, v: i => i.lowestBrl ?? '' },
  median: { th: 'Mediana', k: 'median', num: true, td: (ctx, i) => `<td class="num">${i.medianCents != null ? moneySpan(i.medianCents, null) : '<span class="muted">—</span>'}</td>`, v: i => i.medianCents ?? '' },
  buy: { th: 'Venda imediata', k: 'buy', num: true, td: (ctx, i) => `<td class="num">${i.buyCount && i.buyCents != null ? moneySpan(i.buyCents, null) : '<span class="muted">sem ordem</span>'}</td>`, v: i => (i.buyCount && i.buyCents != null) ? i.buyCents : '' },
  vol: { th: 'Volume 24h', k: 'vol', num: true, td: (ctx, i) => `<td class="num">${i.vol ? fmtQty(i.vol) : '<span class="muted">—</span>'}</td>`, v: i => i.vol || '' },
  spread: { th: 'Spread', k: 'spread', num: true, td: (ctx, i) => `<td class="num">${i.spread != null ? moneyBrl(i.spread) : '<span class="muted">—</span>'}</td>`, v: i => i.spread ?? '' },
  liq: { th: 'Liquidez', k: 'liq', num: true, td: (ctx, i) => `<td>${liqSpan(i)}</td>`, v: i => i.buyCount || 0 },
  d7: { th: '7 dias', k: 'd7', num: true, td: (ctx, i) => `<td class="num">${deltaSpan(i.d7)}</td>`, v: i => i.d7 ?? '' },
};

// Tabela estática ordenável (common.js cuida do clique/filtro via data-*)
export function itemsTable(ctx, items, { cols = ['name', 'type', 'grade', 'lowest', 'median', 'buy', 'vol', 'liq', 'd7'], sort = 'lowest', filter = null, count = null, id = '' } = {}) {
  const cs = cols.map(c => COLS[c]);
  const attrs = [`class="sortable"`, `data-sort="${sort}"`, filter ? `data-filter="${filter}"` : '', count ? `data-count="${count}"` : '', id ? `id="${id}"` : ''].filter(Boolean).join(' ');
  const head = cs.map(c => `<th data-k="${c.k}" class="${c.num ? 'num' : ''}${c.str ? ' str' : ''}${c.k === sort ? ' sorted' : ''}">${c.th}</th>`).join('');
  const rows = items.map(i => {
    const data = cs.map(c => `data-${c.k}="${esc(c.v(i))}"`).join(' ');
    return `<tr ${data} data-q="${esc(i.name.toLowerCase())}">${cs.map(c => c.td(ctx, i)).join('')}</tr>`;
  }).join('\n');
  return `<div class="tablewrap"><table ${attrs}><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

// FAQ com JSON-LD
export function faq(qas) {
  const html = qas.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${a}</p></details>`).join('');
  const ld = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: qas.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })) };
  return { html, ld };
}

export const cta = () => `<div class="card" style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-top:28px">
  <div style="flex:1;min-width:240px"><b>Quanto vale o seu baú?</b><div class="muted" style="font-size:14px">Suba o save do TBH e veja o valor item a item, com os 4 melhores para lançar. O arquivo é lido só no seu navegador.</div></div>
  <a class="btn" href="/avaliador/">Avaliar meu baú</a></div>`;
