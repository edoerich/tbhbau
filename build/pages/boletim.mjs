// /boletim/ — resumo automático da semana no mercado (regerado a cada build)
import { page, breadcrumb, adUnit } from '../layout.mjs';
import { esc, moneyBrl, fmtQty, fmtInt, fmtPct, fmtDateLong, fmtDateTime, netCents, RARITY_PT, typePt } from '../lib.mjs';
import { itemLink, deltaSpan, liqSpan, cta } from '../ui.mjs';

export function render(ctx) {
  const { items, histCount } = ctx;
  const bc = breadcrumb([['/', 'Início'], [null, 'Boletim do mercado']]);
  const week = fmtDateLong(ctx.now);
  const movers = items.filter(i => i.d7 != null && i.vol >= 3 && i.lowestBrl >= 20);
  const ups = [...movers].sort((a, b) => b.d7 - a.d7).slice(0, 10).filter(i => i.d7 > 0);
  const downs = [...movers].sort((a, b) => a.d7 - b.d7).slice(0, 10).filter(i => i.d7 < 0);
  const traded = items.filter(i => i.vol > 0).sort((a, b) => b.vol - a.vol).slice(0, 10);
  const toSell = items.filter(i => i.buyCents && i.buyCount >= 10).sort((a, b) => b.buyCents - a.buyCents).slice(0, 10);
  const valuable = items.filter(i => i.lowestBrl > 0).sort((a, b) => b.lowestBrl - a.lowestBrl).slice(0, 10);
  const volTotal = items.reduce((a, i) => a + i.vol, 0);
  const withVol = items.filter(i => i.vol > 0).length;
  const withBuy = items.filter(i => i.buyCount > 0).length;
  const byType = new Map();
  for (const i of items) byType.set(i.typeBase, (byType.get(i.typeBase) || 0) + i.vol);
  const topTypes = [...byType.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const upsN = movers.filter(i => i.d7 > 0).length, downsN = movers.filter(i => i.d7 < 0).length;

  const table = (list, cols) => list.length ? `<div class="tablewrap"><table><thead><tr><th class="num">#</th>${cols.map(c => `<th class="${c.num ? 'num' : ''}">${c.th}</th>`).join('')}</tr></thead><tbody>${list.map((i, n) => `<tr><td class="num muted">${n + 1}</td>${cols.map(c => `<td class="${c.num ? 'num' : ''}">${c.td(i)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : '<p class="muted">Ainda não há dados suficientes para esta lista.</p>';
  const cName = { th: 'Item', td: i => `${itemLink(ctx, i)} <span class="muted" style="font-size:12px">${i.isMaterial ? typePt(i.typeBase) : `${RARITY_PT[i.rarity]} Lv. ${i.lvl}`}</span>` };
  const cPrice = { th: 'Menor venda', num: true, td: i => moneyBrl(i.lowestBrl) };
  const cD7 = { th: '7 dias', num: true, td: i => deltaSpan(i.d7) };
  const cVol = { th: 'Volume 24h', num: true, td: i => fmtQty(i.vol) };
  const cBuy = { th: 'Venda imediata', num: true, td: i => moneyBrl(i.buyCents) };
  const cNet = { th: 'Líquido', num: true, td: i => moneyBrl(netCents(i.buyCents)) };
  const cLiq = { th: 'Liquidez', td: i => liqSpan(i) };

  const body = `
${bc.html}
<h1>Boletim do mercado do TBH</h1>
<p class="lead">Semana de ${week}. O que subiu, o que caiu, o que mais girou e o que vale mais a pena vender agora no Mercado Steam do TBH: Task Bar Hero, a partir dos dados que coletamos continuamente.</p>
<p class="updated">Gerado automaticamente com dados de ${fmtDateTime(ctx.updatedAt)}${histCount ? ` e histórico de ${fmtInt(histCount)} itens` : ''}. Regerado diariamente.</p>

<h2>Resumo</h2>
<div class="prose">
<p>Dos ${fmtInt(items.length)} itens acompanhados, ${fmtInt(withVol)} registraram vendas nas últimas 24 horas, num total de ${fmtInt(volTotal)} unidades, e ${fmtInt(withBuy)} têm pelo menos uma ordem de compra ativa. ${topTypes.length ? `Os tipos que mais giraram foram ${topTypes.map(([t, v]) => `${typePt(t, true).toLowerCase()} (${fmtInt(v)})`).join(', ')}.` : ''}</p>
${movers.length ? `<p>Entre os ${fmtInt(movers.length)} itens com preço acima de R$ 0,20 e vendas recentes, ${fmtInt(upsN)} subiram e ${fmtInt(downsN)} caíram em relação a 7 dias atrás. ${ups[0] ? `A maior alta foi de <a href="${ctx.itemUrl(ups[0])}">${esc(ups[0].name)}</a> (${fmtPct(ups[0].d7)}, agora a ${moneyBrl(ups[0].lowestBrl)})` : ''}${downs[0] ? `${ups[0] ? ' e a maior queda, de' : 'A maior queda foi de'} <a href="${ctx.itemUrl(downs[0])}">${esc(downs[0].name)}</a> (${fmtPct(downs[0].d7)}, a ${moneyBrl(downs[0].lowestBrl)})` : ''}.</p>` : '<p>As variações de 7 dias aparecem assim que o histórico acumular uma semana de leituras.</p>'}
${toSell[0] ? `<p>Para quem quer vender na hora, a melhor venda imediata com liquidez razoável é <a href="${ctx.itemUrl(toSell[0])}">${esc(toSell[0].name)}</a>, pagando ${moneyBrl(toSell[0].buyCents)} (cerca de ${moneyBrl(netCents(toSell[0].buyCents))} líquidos após a taxa). Lembre que o TBH libera apenas 4 itens a cada 8 horas para a Steam: use o <a href="/avaliador/">avaliador</a> para ranquear os do seu baú.</p>` : ''}
</div>

<h2>📈 Maiores altas em 7 dias</h2>
<p class="muted" style="font-size:13px">Itens com menor venda a partir de R$ 0,20 e pelo menos 3 vendas em 24h, para tirar ruído de itens sem mercado.</p>
${table(ups, [cName, cPrice, cD7, cVol])}
<h2>📉 Maiores quedas em 7 dias</h2>
${table(downs, [cName, cPrice, cD7, cVol])}
${adUnit()}
<h2>🔥 Mais negociados nas últimas 24 horas</h2>
${table(traded, [cName, cVol, cPrice, cLiq])}
<h2>⚡ Melhores para vender agora</h2>
<p class="muted" style="font-size:13px">Maior ordem de compra ativa, entre itens com pelo menos 10 ordens.</p>
${table(toSell, [cName, cBuy, cNet, cLiq])}
<h2>💎 Mais valiosos</h2>
${table(valuable, [cName, cPrice, cD7, cLiq])}
<p class="muted" style="font-size:13.5px;margin-top:20px">Como ler estes números: <a href="/guias/anuncio-vs-venda-imediata/">anúncio vs venda imediata</a> · <a href="/guias/grades-raridades/">grades e raridades</a>. Todos os itens no <a href="/mercado/">mercado</a>.</p>
${cta()}`;

  return [{ path: 'boletim/index.html', sitemap: { priority: 0.8, changefreq: 'daily' }, html: page({
    path: '/boletim/', active: '/boletim/', updatedAt: ctx.updatedAt, jsonld: [bc.ld], ogType: 'article',
    title: `Boletim do mercado do TBH: altas, quedas e melhores vendas (${week}) · tbhbau`,
    description: `Resumo da semana no Mercado Steam do TBH: Task Bar Hero: maiores altas e quedas em 7 dias, itens mais negociados, melhores vendas imediatas e mais valiosos, com dados atualizados.`,
    body }) }];
}
