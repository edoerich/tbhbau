// índice de itens (por tipo e grade) + uma página por tipo
import { page, breadcrumb, adUnit } from '../layout.mjs';
import { esc, fmtQty, RARITIES, RARITY_COLOR } from '../lib.mjs';
import { itemsTable, itemLink, cta, hlBlock, priceSpan } from '../ui.mjs';

const median = arr => { if (!arr.length) return null; const s = [...arr].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
const medSpan = (i, list) => { const p = list.filter(x => x.lowestBrl > 0); const mb = median(p.map(x => x.lowestBrl)); const mu = median(list.filter(x => x.usdCents > 0).map(x => x.usdCents)); return mb != null ? i.moneySpan(mb, mu) : null; };

export function render(ctx) {
  const { items, types, i } = ctx, R = i.routes;
  const out = [];
  const bc = breadcrumb(i, [[R.home, i.t('nav_home')], [null, i.t('nav_items')]]);
  const typeCards = [...types.entries()].sort((a, b) => b[1].length - a[1].length).map(([t, list]) => {
    const priced = list.filter(x => x[ctx.vk] > 0);
    const lo = priced.length ? priced.reduce((a, x) => x[ctx.vk] < a[ctx.vk] ? x : a) : null;
    const hi = priced.length ? priced.reduce((a, x) => x[ctx.vk] > a[ctx.vk] ? x : a) : null;
    return `<a class="card" href="${ctx.typeUrl(t)}"><h3>${esc(i.typeName(t, true))}</h3><p>${i.t('type_card', list.length, lo && priceSpan(ctx, lo), hi && priceSpan(ctx, hi))}</p></a>`;
  }).join('');
  const gradeRows = RARITIES.map(r => {
    const list = items.filter(x => x.rarity === r);
    if (!list.length) return '';
    const top = [...list].sort((a, b) => (b.lowestBrl ?? -1) - (a.lowestBrl ?? -1))[0];
    const lvls = [...new Set(list.map(x => x.lvl).filter(Boolean))].sort((a, b) => a - b);
    return `<tr><td><span class="dot" style="background:#${RARITY_COLOR[r]}"></span>${i.rarity(r)} ${i.L === 'pt' ? `<span class="muted">(${r})</span>` : ''}</td><td class="num">${list.length}</td><td class="num">${medSpan(i, list) || '—'}</td><td>${lvls.join(', ') || '—'}</td><td>${top ? `${itemLink(ctx, top, { icon: false })} <span class="muted">${priceSpan(ctx, top)}</span>` : '—'}</td></tr>`;
  }).join('');
  const materials = items.filter(x => x.isMaterial);
  const allList = [...items].sort((a, b) => a.name.localeCompare(b.name)).map(x => `<li class="hidden"><a href="${ctx.itemUrl(x)}">${esc(x.name)}</a> <span class="v">${esc(i.typeName(x.typeBase))}${x.lvl ? ` ${i.t('lvl', x.lvl)}` : ''}</span></li>`).join('');

  out.push({ path: R.items.slice(1) + 'index.html', sitemap: { priority: 0.8, changefreq: 'daily' }, html: page({
    i, path: R.items, alt: ctx.altRoute('items'), active: 'items', updatedAt: ctx.updatedAt, jsonld: [bc.ld],
    title: i.t('items_title'), description: i.t('items_desc', items.length),
    body: `
${bc.html}
<h1>${i.t('items_h1')}</h1>
<p class="lead">${i.t('items_lead', i.fmtInt(items.length))}</p>
<div class="controls"><input type="search" placeholder="${i.t('items_search_ph')}" data-filter-list="#allItems" style="min-width:280px"><span class="muted" style="font-size:13px">${i.t('items_search_hint')}</span></div>
<ul class="list hidden" id="allItems" style="max-width:640px">${allList}</ul>

<h2>${i.t('h_by_type')}</h2>
<div class="grid c4">${typeCards}</div>

<h2>${i.t('h_by_grade')}</h2>
<p>${i.t('grade_intro', ctx.guideUrl('grades-raridades'))}</p>
<div class="tablewrap"><table><thead><tr><th>${i.t('th_grade')}</th><th class="num">${i.t('th_items')}</th><th class="num">${i.t('th_median_price')}</th><th>${i.t('th_levels')}</th><th>${i.t('th_top')}</th></tr></thead><tbody>${gradeRows}</tbody></table></div>

<h2>${i.t('h_materials')}</h2>
<p>${i.t('materials_p', i.fmtInt(materials.length))}</p>
<div class="grid c3">${hlBlock(ctx, i.t('hl_mat_traded'), materials.filter(x => x.vol > 0).sort((a, b) => b.vol - a.vol).slice(0, 8), x => fmtQty(x.vol))}
${hlBlock(ctx, i.t('hl_mat_expensive'), materials.filter(x => x.lowestBrl > 0).sort((a, b) => b.lowestBrl - a.lowestBrl).slice(0, 8), x => priceSpan(ctx, x))}</div>
${cta(ctx)}` }) });

  for (const [t, list] of types) {
    const pl = i.typeName(t, true), sg = i.typeName(t), f = i.typeFem(t);
    const bcT = breadcrumb(i, [[R.home, i.t('nav_home')], [R.items, i.t('nav_items')], [null, pl]]);
    const vk = ctx.vk;
    const priced = list.filter(x => x[vk] > 0);
    const sorted = [...list].sort((a, b) => (b[vk] ?? -1) - (a[vk] ?? -1));
    const top = sorted[0], cheapest = [...priced].sort((a, b) => a[vk] - b[vk])[0];
    const traded = list.filter(x => x.vol > 0).sort((a, b) => b.vol - a.vol);
    const isMat = list.every(x => x.isMaterial);
    const grades = RARITIES.filter(r => list.some(x => x.rarity === r));
    const lvls = [...new Set(list.map(x => x.lvl).filter(Boolean))].sort((a, b) => a - b);
    const med = medSpan(i, list);
    const intro = isMat ? i.t('type_intro_mat', list.length, pl, i.fmtInt(list.reduce((a, x) => a + x.vol, 0)))
      : i.t('type_intro_eq', { n: list.length, pl, sg, f, ng: grades.length, grades: grades.map(r => i.rarity(r)).join(', '), lo: lvls[0], hi: lvls[lvls.length - 1] });
    const priceLine = priced.length ? i.t('type_price_line', { med, f, top: top && itemLink(ctx, top, { icon: false }), topPrice: top && priceSpan(ctx, top), cheap: cheapest && cheapest !== top ? itemLink(ctx, cheapest, { icon: false }) : null, cheapPrice: cheapest && priceSpan(ctx, cheapest), traded: traded[0] && itemLink(ctx, traded[0], { icon: false }), tradedVol: traded[0] && i.fmtInt(traded[0].vol) }) : '';
    const byGrade = isMat ? '' : `<h2>${i.t('h_by_grade')}</h2><div class="grid c3">${grades.map(r => hlBlock(ctx, `<span class="dot" style="background:#${RARITY_COLOR[r]}"></span>${i.rarity(r)}`, list.filter(x => x.rarity === r).sort((a, b) => (b[vk] ?? -1) - (a[vk] ?? -1)).slice(0, 6), x => priceSpan(ctx, x))).join('')}</div>`;
    out.push({ path: ctx.typeUrl(t).slice(1) + 'index.html', sitemap: { priority: 0.7, changefreq: 'daily' }, html: page({
      i, path: ctx.typeUrl(t), alt: ctx.typeAltUrl(t), active: 'items', updatedAt: ctx.updatedAt, jsonld: [bcT.ld],
      title: i.t('type_title', pl), description: i.t('type_desc', list.length, pl, med ? med.replace(/<[^>]+>/g, '') : null),
      body: `
${bcT.html}
<h1>${esc(i.t('type_h1', pl))}</h1>
<p class="lead">${intro}</p>
<p>${priceLine}</p>
${byGrade}
<h2>${i.t('type_h_all', list.length)}</h2>
<div class="controls"><input id="tSearch" type="search" placeholder="${i.t('filter_ph')}"><span class="muted" id="tCount"></span></div>
${itemsTable(ctx, sorted, { cols: isMat ? ['name', 'lowest', 'median', 'buy', 'vol', 'liq', 'd7'] : ['name', 'grade', 'lvl', 'lowest', 'median', 'buy', 'vol', 'liq', 'd7'], sort: 'lowest', filter: '#tSearch', count: '#tCount' })}
${adUnit(i)}
<h2>${i.t('h_other_types')}</h2>
<p>${[...types.keys()].filter(x => x !== t).map(x => `<a href="${ctx.typeUrl(x)}">${esc(i.typeName(x, true))}</a>`).join(' · ')}</p>
${cta(ctx)}` }) });
  }
  return out;
}
