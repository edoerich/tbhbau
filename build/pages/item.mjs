// Uma página estática por item: preço, texto gerado a partir dos dados, histórico (SVG), order book ao vivo (JS), relacionados.
import { page, breadcrumb, adUnit } from '../layout.mjs';
import { esc, moneyBrl, money, moneySpan, fmtQty, fmtInt, fmtPct, fmtDate, fmtDateTime, netCents, RARITY_PT, RARITY_COLOR, typePt, typeGender, steamUrl, chartSvg, liqLabel } from '../lib.mjs';
import { itemLink, rarityDot, gradeLabel, deltaSpan } from '../ui.mjs';

const artigo = (g, def = true) => def ? (g === 'f' ? 'a' : 'o') : (g === 'f' ? 'uma' : 'um');

function prose(ctx, it) {
  const g = it.isMaterial ? 'm' : typeGender(it.typeBase);
  const tipo = typePt(it.typeBase).toLowerCase();
  const p = [];
  // 1. o que é + preço
  let s1 = it.isMaterial
    ? `<b>${esc(it.name)}</b> é ${artigo('m', false)} ${tipo} do TBH: Task Bar Hero, um recurso usado dentro do jogo que também pode ser enviado para o inventário Steam e vendido no Mercado da Comunidade.`
    : `<b>${esc(it.name)}</b> é ${artigo(g, false)} ${tipo} de nível ${it.lvl} e grade <b>${RARITY_PT[it.rarity]}</b> do TBH: Task Bar Hero, negociável no Mercado da Comunidade Steam.`;
  if (it.lowestBrl != null) {
    s1 += ` No momento, a menor venda (o anúncio mais barato) está em <b>${moneyBrl(it.lowestBrl)}</b>${it.usdCents ? ` (${money(it.usdCents, 'usd')} na loja em dólar)` : ''}`;
    s1 += it.medianCents != null ? `, com mediana recente de ${moneyBrl(it.medianCents)}.` : '.';
  } else if (it.usdCents) s1 += ` No momento, a menor venda está em ${money(it.usdCents, 'usd')} na loja em dólar; o preço em reais ainda não foi lido.`;
  p.push(s1);
  // 2. liquidez / venda imediata / volume
  let s2 = '';
  if (it.buyCount && it.buyCents != null) {
    s2 = `Existem <b>${fmtInt(it.buyCount)} ordens de compra</b> ativas (liquidez ${liqLabel[it.liquidez] || 'baixa'}). A maior paga <b>${moneyBrl(it.buyCents)}</b>: é a <b>venda imediata</b>, o que você recebe vendendo agora, sem esperar. Descontada a taxa da Steam de cerca de 13%, sobram aproximadamente <b>${moneyBrl(netCents(it.buyCents))}</b> líquidos por unidade.`;
    if (it.spread != null && it.minSellCents) { const sp = it.spread / ((it.minSellCents + it.buyCents) / 2) * 100; s2 += ` O spread entre anúncio e venda imediata é de ${moneyBrl(it.spread)} (${sp.toFixed(1).replace('.', ',')}%)${sp > 25 ? ', alto: se puder esperar, anunciar tende a render mais' : sp < 8 ? ', pequeno: vender na hora custa pouco' : ''}.`; }
  } else s2 = `No momento não há ordens de compra ativas, então não existe venda imediata: quem quiser vender precisa anunciar e aguardar um comprador.`;
  if (it.vol > 0) s2 += ` Nas últimas 24 horas foram negociadas <b>${fmtInt(it.vol)} unidades</b>.`;
  else s2 += ` Não houve vendas registradas nas últimas 24 horas.`;
  p.push(s2);
  // 3. histórico
  const h = it.h;
  if (h && h.n >= 2) {
    let s3 = `Acompanhamos este item desde ${fmtDate(h.first)}, com ${fmtInt(h.n)} leituras de preço.`;
    if (h.s7 && it.d7 != null) s3 += ` Nos últimos 7 dias a menor venda ${it.d7 >= 0 ? 'subiu' : 'caiu'} <b>${fmtPct(Math.abs(it.d7)).replace('+', '')}</b> (de ${moneyBrl(h.s7.ask0)} para ${moneyBrl(it.lowestBrl)}), oscilando entre ${moneyBrl(h.s7.min)} e ${moneyBrl(h.s7.max)}.`;
    if (h.s30 && it.d30 != null && h.s30.n > (h.s7?.n || 0)) s3 += ` Em 30 dias a variação foi de <b>${fmtPct(it.d30)}</b>, com mínima de ${moneyBrl(h.s30.min)} e máxima de ${moneyBrl(h.s30.max)}${h.s30.volAvg ? `, e média de ${fmtInt(h.s30.volAvg)} unidades vendidas por dia` : ''}.`;
    p.push(s3);
  } else p.push('Começamos a registrar o histórico deste item há pouco tempo; o gráfico aparece conforme as leituras se acumulam.');
  return p.map(x => `<p>${x}</p>`).join('\n');
}

function tips(it) {
  const li = [];
  if (it.buyCount && it.buyCents != null) {
    if (it.spread != null && it.minSellCents && it.spread / ((it.minSellCents + it.buyCents) / 2) < 0.1) li.push('O spread é pequeno: <b>vender na hora</b> (bater na ordem de compra) perde pouco em relação ao anúncio e resolve na hora.');
    else li.push('Se não tiver pressa, <b>anuncie perto da menor venda</b> e espere; a venda imediata paga menos. Se quiser o dinheiro agora, aceite a maior ordem de compra.');
    if (it.buyCount >= 500) li.push('Liquidez alta: há muitas ordens de compra, então vender rápido é fácil mesmo em quantidade.');
    else if (it.buyCount < 50) li.push('Liquidez baixa: poucas ordens de compra. Vendendo várias unidades de uma vez, o preço da venda imediata cai rápido.');
  } else li.push('Sem ordens de compra no momento: anuncie um pouco abaixo da menor venda e tenha paciência.');
  if (it.lowestBrl != null && it.lowestBrl >= 1000) li.push('Item de valor: confira o order book ao vivo abaixo e a taxa de ~13% antes de decidir. Em itens caros, a diferença em reais entre anunciar e vender na hora pesa.');
  li.push('Lembre da mecânica do TBH: só <b>4 itens a cada 8 horas</b> saem do jogo para a Steam. Priorize os de maior venda imediata na sua janela; o <a href="/avaliador/">avaliador</a> calcula isso pelo seu save.');
  return `<ul>${li.map(x => `<li>${x}</li>`).join('')}</ul>`;
}

export function render(ctx) {
  const { items, byFamily, types } = ctx;
  const out = [];
  for (const it of items) {
    const g = it.isMaterial ? 'm' : typeGender(it.typeBase);
    const tipoPl = typePt(it.typeBase, true);
    const bc = breadcrumb([['/', 'Início'], ['/itens/', 'Itens'], [ctx.typeUrl(it.typeBase), tipoPl], [null, it.name]]);
    const h = it.h;
    const family = (byFamily.get(it.family) || []).filter(x => x !== it).sort((a, b) => (a.lvl || 0) - (b.lvl || 0) || (a.lowestBrl ?? 0) - (b.lowestBrl ?? 0));
    const sameType = (types.get(it.typeBase) || []).filter(x => x !== it && !family.includes(x));
    const sameLvl = sameType.filter(x => x.lvl === it.lvl && x.rarity === it.rarity).slice(0, 6);
    const typeTop = sameType.filter(x => !sameLvl.includes(x)).sort((a, b) => (b.lowestBrl ?? -1) - (a.lowestBrl ?? -1)).slice(0, 6);
    const relList = (title, list, val) => list.length ? `<div class="card"><h3>${title}</h3><ul class="list">${list.map(x => `<li>${itemLink(ctx, x, { icon: false })}<span class="v">${val(x)}</span></li>`).join('')}</ul></div>` : '';
    const priceOf = x => x.lowestBrl != null ? moneyBrl(x.lowestBrl) : (x.usdCents ? money(x.usdCents, 'usd') : '—');
    const subt = x => x.isMaterial ? priceOf(x) : `${x.rarity ? RARITY_PT[x.rarity] : ''} Lv. ${x.lvl} · ${priceOf(x)}`;

    const stats = `<div class="stats">
      <div class="stat"><div class="k">Menor venda</div><div class="v">${moneySpan(it.lowestBrl, it.usdCents || null)}</div><div class="s">anúncio mais barato${it.usdCents ? ` · ${money(it.usdCents, 'usd')}` : ''}</div></div>
      <div class="stat"><div class="k">Mediana</div><div class="v">${it.medianCents != null ? moneyBrl(it.medianCents) : '—'}</div><div class="s">preço típico recente</div></div>
      <div class="stat green"><div class="k">Venda imediata</div><div class="v big" data-live="bid">${it.buyCount && it.buyCents != null ? moneyBrl(it.buyCents) : '—'}</div><div class="s">maior ordem de compra <span class="ok hidden" data-live-badge>· ao vivo</span></div></div>
      <div class="stat"><div class="k">Você recebe (líquido)</div><div class="v" data-live="net">${it.buyCount && it.buyCents != null ? moneyBrl(netCents(it.buyCents)) : '—'}</div><div class="s">após taxa ~13%</div></div>
      <div class="stat"><div class="k">Liquidez</div><div class="v"><span data-live="buyCount">${it.buyCount ? fmtInt(it.buyCount) : '0'}</span></div><div class="s">ordens de compra · ${liqLabel[it.liquidez] || 'nenhuma'}</div></div>
      <div class="stat"><div class="k">Volume 24h</div><div class="v">${it.vol ? fmtInt(it.vol) : '0'}</div><div class="s">unidades vendidas</div></div>
      <div class="stat"><div class="k">Spread</div><div class="v" data-live="spread" style="font-size:17px">${it.spread != null ? moneyBrl(it.spread) : '—'}</div><div class="s">anúncio − venda imediata</div></div>
      <div class="stat"><div class="k">7 dias</div><div class="v">${deltaSpan(it.d7)}</div><div class="s">${it.d30 != null ? `30 dias: ${fmtPct(it.d30)}` : 'variação da menor venda'}</div></div>
    </div>`;

    const chart = h && h.series && h.series.length >= 2
      ? `<div class="chart-title"><span>Histórico — menor venda (R$), últimos 30 dias</span><span class="muted">${h.series.length} pontos · desde ${fmtDate(h.first)}</span></div>${chartSvg(h.series)}<div id="liveChart"></div>`
      : `<div class="chart-empty">📈 Coletando histórico… o gráfico aparece conforme os preços forem registrados.</div><div id="liveChart"></div>`;

    const body = `
${bc.html}
<div class="item-head">
  ${it.icon ? `<img src="${esc(it.icon)}" alt="${esc(it.name)}" width="72" height="72">` : ''}
  <div>
    <h1>${esc(it.name)}</h1>
    <div class="item-meta">${rarityDot(it)}<span>${it.isMaterial ? typePt(it.typeBase) : `Grade ${RARITY_PT[it.rarity]} · <a href="${ctx.typeUrl(it.typeBase)}">${esc(typePt(it.typeBase))}</a> · Nível ${it.lvl}`}</span><span>·</span><a href="${steamUrl(it.hash)}" target="_blank" rel="noopener">ver na Steam ↗</a></div>
  </div>
</div>
${stats}
<p class="updated">Dados atualizados em ${fmtDateTime(ctx.updatedAt)}. A venda imediata, a liquidez e o order book abaixo são consultados ao vivo quando a página abre.</p>

<div class="item-grid">
  <div>
    <h2>Preço e mercado</h2>
    <div class="prose">${prose(ctx, it)}</div>
    <h2>Histórico de preço</h2>
    ${chart}
    <h2>Order book ao vivo</h2>
    <p class="muted" style="font-size:13px;margin:0 0 8px">Ordens de compra e venda por preço, direto da Steam (região Brasil). Barras mostram a quantidade em cada nível.</p>
    <div id="liveOb" data-hash="${encodeURIComponent(it.hash)}"><div class="muted" style="padding:18px;text-align:center">carregando order book…</div></div>
    ${it.ad ? adUnit() : ''}
    <h2>Como vender ${g === 'f' ? 'esta' : 'este'} item</h2>
    <div class="prose">${tips(it)}</div>
    <p class="muted" style="font-size:13.5px">Leia também: <a href="/guias/como-vender/">como vender itens do TBH na Steam</a> · <a href="/guias/anuncio-vs-venda-imediata/">anúncio vs venda imediata</a> · <a href="/guias/grades-raridades/">grades e raridades</a>.</p>
  </div>
  <aside class="aside">
    ${relList(`Mesma família: ${esc(it.family)}`, family, subt)}
    ${relList(`${esc(tipoPl)} ${it.rarity ? RARITY_PT[it.rarity] : ''} Lv. ${it.lvl || ''}`.trim(), sameLvl, priceOf)}
    ${relList(`${esc(tipoPl)} mais valiosos`, typeTop, subt)}
    <div class="card"><h3>Ferramentas</h3><ul class="list"><li><a href="/avaliador/">Quanto vale o meu baú?</a></li><li><a href="/mercado/">Explorar o mercado</a></li><li><a href="${ctx.typeUrl(it.typeBase)}">Todos os ${esc(tipoPl.toLowerCase())}</a></li><li><a href="/boletim/">Boletim da semana</a></li></ul></div>
  </aside>
</div>`;

    const desc = it.isMaterial
      ? `${it.name}: material do TBH: Task Bar Hero no Mercado Steam. Menor venda ${it.lowestBrl != null ? moneyBrl(it.lowestBrl) : money(it.usdCents, 'usd')}${it.buyCount ? `, venda imediata ${moneyBrl(it.buyCents)}` : ''}${it.vol ? `, ${fmtInt(it.vol)} vendidos em 24h` : ''}. Histórico de preço, order book e liquidez.`
      : `${it.name}: ${typePt(it.typeBase).toLowerCase()} ${RARITY_PT[it.rarity]} nível ${it.lvl} do TBH no Mercado Steam. Menor venda ${it.lowestBrl != null ? moneyBrl(it.lowestBrl) : money(it.usdCents, 'usd')}${it.buyCount ? `, venda imediata ${moneyBrl(it.buyCents)}` : ''}${it.vol ? `, ${fmtInt(it.vol)} vendidos em 24h` : ''}. Histórico de preço, order book e itens relacionados.`;
    out.push({ path: `item/${it.slug}/index.html`, sitemap: it.indexable ? { priority: it.ad ? 0.6 : 0.4, changefreq: 'daily' } : null, html: page({
      path: ctx.itemUrl(it), active: '/itens/', updatedAt: ctx.updatedAt, noindex: !it.indexable, jsonld: [bc.ld], ogType: 'article',
      title: `${it.name}: preço no Mercado Steam (TBH) · tbhbau`, description: desc, body }) });
  }
  return out;
}
