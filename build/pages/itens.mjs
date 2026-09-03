// /itens/ (índice por tipo e grade) + /tipo/<slug>/ (uma página por tipo de item)
import { page, breadcrumb, adUnit } from '../layout.mjs';
import { esc, moneyBrl, fmtQty, fmtInt, RARITIES, RARITY_PT, RARITY_COLOR, typePt, typeGender } from '../lib.mjs';
import { itemsTable, itemLink, cta, hlBlock, priceOf } from '../ui.mjs';

const median = arr => { if (!arr.length) return null; const s = [...arr].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };

export function render(ctx) {
  const { items, types } = ctx;
  const out = [];

  // ── índice ──
  const bc = breadcrumb([['/', 'Início'], [null, 'Itens']]);
  const typeCards = [...types.entries()].sort((a, b) => b[1].length - a[1].length).map(([t, list]) => {
    const priced = list.filter(i => i.lowestBrl > 0).map(i => i.lowestBrl);
    const lo = priced.length ? Math.min(...priced) : null, hi = priced.length ? Math.max(...priced) : null;
    return `<a class="card" href="${ctx.typeUrl(t)}"><h3>${esc(typePt(t, true))}</h3><p>${list.length} itens${lo != null ? ` · de ${moneyBrl(lo)} a ${moneyBrl(hi)}` : ''}</p></a>`;
  }).join('');
  const gradeRows = RARITIES.map(r => {
    const list = items.filter(i => i.rarity === r);
    if (!list.length) return '';
    const med = median(list.filter(i => i.lowestBrl > 0).map(i => i.lowestBrl));
    const top = [...list].sort((a, b) => (b.lowestBrl ?? -1) - (a.lowestBrl ?? -1))[0];
    const lvls = [...new Set(list.map(i => i.lvl).filter(Boolean))].sort((a, b) => a - b);
    return `<tr><td><span class="dot" style="background:#${RARITY_COLOR[r]}"></span>${RARITY_PT[r]} <span class="muted">(${r})</span></td><td class="num">${list.length}</td><td class="num">${med != null ? moneyBrl(med) : '—'}</td><td>${lvls.length ? lvls.join(', ') : '—'}</td><td>${top ? `${itemLink(ctx, top, { icon: false })} <span class="muted">${moneyBrl(top.lowestBrl)}</span>` : '—'}</td></tr>`;
  }).join('');
  const materials = items.filter(i => i.isMaterial);
  const allList = [...items].sort((a, b) => a.name.localeCompare(b.name)).map(i => `<li class="hidden"><a href="${ctx.itemUrl(i)}">${esc(i.name)}</a> <span class="v">${esc(typePt(i.typeBase))}${i.lvl ? ` Lv. ${i.lvl}` : ''}</span></li>`).join('');

  out.push({ path: 'itens/index.html', sitemap: { priority: 0.8, changefreq: 'daily' }, html: page({
    path: '/itens/', active: '/itens/', updatedAt: ctx.updatedAt, jsonld: [bc.ld],
    title: 'Todos os itens do TBH negociáveis na Steam, por tipo e grade · tbhbau',
    description: `Índice dos ${items.length} itens do TBH: Task Bar Hero com mercado na Steam, organizados por tipo (elmos, espadas, materiais...) e por grade, com preço mediano de cada grade.`,
    body: `
${bc.html}
<h1>Itens do TBH negociáveis na Steam</h1>
<p class="lead">${fmtInt(items.length)} itens com mercado, organizados por tipo e por grade. Cada item tem uma página com preço atual, histórico, order book ao vivo e itens relacionados.</p>
<div class="controls"><input type="search" placeholder="buscar item pelo nome…" data-filter-list="#allItems" style="min-width:280px"><span class="muted" style="font-size:13px">digite para ver os resultados</span></div>
<ul class="list hidden" id="allItems" style="max-width:640px">${allList}</ul>

<h2>Por tipo</h2>
<div class="grid c4">${typeCards}</div>

<h2>Por grade</h2>
<p>A grade aparece entre parênteses no nome do item, por exemplo <code>(Divine)</code>. A tabela abaixo mostra quantos itens de cada grade têm mercado, o preço mediano atual e os níveis em que a grade existe. Entenda o que valoriza cada item no guia de <a href="/guias/grades-raridades/">grades e raridades</a>.</p>
<div class="tablewrap"><table><thead><tr><th>Grade</th><th class="num">Itens</th><th class="num">Preço mediano</th><th>Níveis</th><th>Mais caro</th></tr></thead><tbody>${gradeRows}</tbody></table></div>

<h2>Materiais</h2>
<p>${fmtInt(materials.length)} materiais (decoração, criação, gravação, inscrição, oferenda e pedras da alma) não têm grade nem nível. Costumam ser baratos por unidade, mas giram muito volume e vendem na hora. Veja os mais negociados:</p>
<div class="grid c3">${hlBlock(ctx, '🔥 Materiais mais negociados (24h)', materials.filter(i => i.vol > 0).sort((a, b) => b.vol - a.vol).slice(0, 8), i => fmtQty(i.vol))}
${hlBlock(ctx, '💎 Materiais mais caros', materials.filter(i => i.lowestBrl > 0).sort((a, b) => b.lowestBrl - a.lowestBrl).slice(0, 8), i => moneyBrl(i.lowestBrl))}</div>
${cta()}` }) });

  // ── uma página por tipo ──
  for (const [t, list] of types) {
    const plural = typePt(t, true), g = typeGender(t);
    const bcT = breadcrumb([['/', 'Início'], ['/itens/', 'Itens'], [null, plural]]);
    const priced = list.filter(i => i.lowestBrl > 0);
    const sorted = [...list].sort((a, b) => (b.lowestBrl ?? -1) - (a.lowestBrl ?? -1));
    const top = sorted[0], cheapest = [...priced].sort((a, b) => a.lowestBrl - b.lowestBrl)[0];
    const traded = list.filter(i => i.vol > 0).sort((a, b) => b.vol - a.vol);
    const isMat = list.every(i => i.isMaterial);
    const grades = RARITIES.filter(r => list.some(i => i.rarity === r));
    const lvls = [...new Set(list.map(i => i.lvl).filter(Boolean))].sort((a, b) => a - b);
    const med = median(priced.map(i => i.lowestBrl));
    const volTotal = list.reduce((a, i) => a + i.vol, 0);
    const intro = isMat
      ? `Há ${list.length} ${plural.toLowerCase()} do TBH: Task Bar Hero negociáveis no Mercado Steam. São recursos sem grade nem nível, usados dentro do jogo, e costumam vender rápido: nas últimas 24 horas foram ${fmtInt(volTotal)} unidades negociadas neste grupo.`
      : `Há ${list.length} ${plural.toLowerCase()} do TBH: Task Bar Hero negociáveis no Mercado Steam, em ${grades.length} grades (${grades.map(r => RARITY_PT[r]).join(', ')}) e níveis de ${lvls[0]} a ${lvls[lvls.length - 1]}. ${g === 'f' ? 'A' : 'O'} mesm${g === 'f' ? 'a' : 'o'} ${typePt(t).toLowerCase()} em grade e nível mais altos costuma valer bem mais, mas com menos compradores.`;
    const priceLine = priced.length ? `O preço mediano do grupo é ${moneyBrl(med)}. ${top ? `${g === 'f' ? 'A' : 'O'} mais car${g === 'f' ? 'a' : 'o'} é <a href="${ctx.itemUrl(top)}">${esc(top.name)}</a>, a partir de ${moneyBrl(top.lowestBrl)}` : ''}${cheapest && cheapest !== top ? `, e ${g === 'f' ? 'a' : 'o'} mais barat${g === 'f' ? 'a' : 'o'} é <a href="${ctx.itemUrl(cheapest)}">${esc(cheapest.name)}</a>, por ${moneyBrl(cheapest.lowestBrl)}` : ''}. ${traded[0] ? `${g === 'f' ? 'A' : 'O'} mais negociad${g === 'f' ? 'a' : 'o'} nas últimas 24 horas foi <a href="${ctx.itemUrl(traded[0])}">${esc(traded[0].name)}</a>, com ${fmtInt(traded[0].vol)} unidades.` : ''}` : '';
    const byGrade = isMat ? '' : `<h2>Por grade</h2><div class="grid c3">${grades.map(r => hlBlock(ctx, `<span class="dot" style="background:#${RARITY_COLOR[r]}"></span>${RARITY_PT[r]}`, list.filter(i => i.rarity === r).sort((a, b) => (b.lowestBrl ?? -1) - (a.lowestBrl ?? -1)).slice(0, 6), priceOf)).join('')}</div>`;
    out.push({ path: `tipo/${ctx.typeSlug(t)}/index.html`, sitemap: { priority: 0.7, changefreq: 'daily' }, html: page({
      path: ctx.typeUrl(t), active: '/itens/', updatedAt: ctx.updatedAt, jsonld: [bcT.ld],
      title: `${plural} do TBH no Mercado Steam: preços e liquidez · tbhbau`,
      description: `${list.length} ${plural.toLowerCase()} do TBH: Task Bar Hero com mercado na Steam: menor venda, mediana, venda imediata, volume e liquidez${med != null ? `, preço mediano ${moneyBrl(med)}` : ''}.`,
      body: `
${bcT.html}
<h1>${esc(plural)} do TBH no Mercado Steam</h1>
<p class="lead">${intro}</p>
<p>${priceLine}</p>
${byGrade}
<h2>Todos os itens (${list.length})</h2>
<div class="controls"><input id="tSearch" type="search" placeholder="filtrar…"><span class="muted" id="tCount"></span></div>
${itemsTable(ctx, sorted, { cols: isMat ? ['name', 'lowest', 'median', 'buy', 'vol', 'liq', 'd7'] : ['name', 'grade', 'lvl', 'lowest', 'median', 'buy', 'vol', 'liq', 'd7'], sort: 'lowest', filter: '#tSearch', count: '#tCount' })}
${adUnit()}
<h2>Outros tipos</h2>
<p>${[...types.keys()].filter(x => x !== t).map(x => `<a href="${ctx.typeUrl(x)}">${esc(typePt(x, true))}</a>`).join(' · ')}</p>
${cta()}` }) });
  }
  return out;
}
